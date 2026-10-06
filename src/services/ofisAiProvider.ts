import { Space } from '../types';
import { 
  parseUserQueryIntent, 
  executeStructuredSearch, 
  StructuredSearchIntent, 
  OfisAssistantResponse 
} from './ofisIntentParser';
import { calculateBookingPrice, formatPriceNGN } from '../utils/pricing';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ofis';
  text: string;
  intent?: StructuredSearchIntent;
  matchingSpaces?: Space[];
  recommendationReason?: string;
  recommendedSpaceId?: string;
  knowledgeLink?: {
    label: string;
    view: string;
    tab?: string;
  };
  bookingHandoff?: {
    space: Space;
    date: string;
    startTime: string;
    durationHours: number;
    guests: number;
    pricingBreakdown: ReturnType<typeof calculateBookingPrice>;
  };
  suggestedFollowUps?: string[];
  timestamp: string;
}

export class OfisAiProvider {
  /**
   * Main conversational reasoning engine.
   * Deterministic, zero-cost, real-inventory grounded, with optional server enrichment.
   */
  static async processMessage(
    userQuery: string,
    allSpaces: Space[],
    conversationHistory: ChatMessage[] = [],
    activeIntent?: StructuredSearchIntent
  ): Promise<ChatMessage> {
    const rawTrimmed = userQuery.trim();

    // 1. Structured Intent Extraction
    const intent = parseUserQueryIntent(rawTrimmed, activeIntent);

    // 2. Informational / Knowledge Base Query Handling
    if (intent.isKnowledgeQuery && intent.knowledgeArticle) {
      const article = intent.knowledgeArticle;
      
      let followUps: string[] = [];
      let sampleSpaces: Space[] | undefined = undefined;

      if (article.id === 'cancellation-and-refunds') {
        followUps = [
          'How do bookings work on OFIS?',
          'How does the OFIS Wallet work?',
          'Contact support: support@ofis.ng',
          'Find a workspace in Lagos'
        ];
      } else if (article.id === 'contact-info') {
        followUps = [
          'What is OFIS and how does it work?',
          'What is the cancellation & refund policy?',
          'How does pricing work?',
          'Browse verified spaces in Explore'
        ];
      } else if (article.id === 'available-spaces') {
        sampleSpaces = allSpaces.slice(0, 6);
        followUps = [
          'Show coworking desks in Lekki',
          'Show meeting rooms in Victoria Island',
          'Show creative studios in Lagos',
          'How does booking work?'
        ];
      } else if (article.id === 'pricing-and-payment' || article.id === 'how-payments-work') {
        followUps = [
          'What is the cancellation and refund policy?',
          'How do bookings work?',
          'What spaces are available?',
          'Contact hello@ofis.ng'
        ];
      } else if (article.id === 'what-is-ofis') {
        followUps = [
          'How do bookings work on OFIS?',
          'What spaces are available?',
          'What is your cancellation and refund policy?',
          'How does OFIS verify 24/7 power?'
        ];
      } else {
        followUps = [
          'Find a creative studio in Lekki',
          'Find a meeting room in Victoria Island',
          'What is the cancellation & refund policy?',
          'Contact support: support@ofis.ng'
        ];
      }

      return {
        id: `msg-${Date.now()}`,
        sender: 'ofis',
        text: `${article.summary}\n\n${article.details}`,
        intent,
        matchingSpaces: sampleSpaces,
        knowledgeLink: article.linkAction,
        suggestedFollowUps: followUps.slice(0, 4),
        timestamp: new Date().toISOString(),
      };
    }

    // 3. Check for Conversational Refinement & Booking Handoff
    // If user says "Book it", "Book the first one", or "Book it tomorrow from 10am to 2pm"
    if (intent.isBookingIntent && conversationHistory.length > 0) {
      // Look back for last matching spaces
      const lastBotMessage = [...conversationHistory].reverse().find(m => m.sender === 'ofis' && m.matchingSpaces && m.matchingSpaces.length > 0);
      const candidates = lastBotMessage?.matchingSpaces || allSpaces;

      let targetSpace = candidates[0];
      if (typeof intent.targetSpaceReferenceIndex === 'number' && candidates[intent.targetSpaceReferenceIndex]) {
        targetSpace = candidates[intent.targetSpaceReferenceIndex];
      }

      if (targetSpace) {
        const guests = intent.capacity || 1;
        const durationHours = intent.durationHours || 2;
        const startTime = intent.timeText ? intent.timeText.split(' ')[0] : '10:00';
        
        // Calculate deterministic pricing
        const priceBreakdown = calculateBookingPrice(targetSpace, {
          quantity: durationHours,
          durationHours,
          guests,
        });

        const dateDisplay = intent.dateText || 'tomorrow';

        return {
          id: `msg-${Date.now()}`,
          sender: 'ofis',
          text: `Checking availability for ${targetSpace.title} in ${targetSpace.neighborhood || targetSpace.city} for ${guests} ${guests === 1 ? 'person' : 'people'} (${dateDisplay}, ${startTime}, ${durationHours} hrs).\n\nTotal: ${formatPriceNGN(priceBreakdown.totalAmount)} (${priceBreakdown.rateDescription}). Ready to proceed with your booking!`,
          intent,
          matchingSpaces: [targetSpace],
          bookingHandoff: {
            space: targetSpace,
            date: dateDisplay,
            startTime,
            durationHours,
            guests,
            pricingBreakdown: priceBreakdown,
          },
          suggestedFollowUps: [
            'Confirm & Complete Booking',
            'Change time or guest count',
            'Show other options in Lekki'
          ],
          timestamp: new Date().toISOString(),
        };
      }
    }

    // 4. Execute Real Structured Search over Supabase Inventory
    const searchResult = executeStructuredSearch(intent, allSpaces);

    // 5. Compose Human, Nigerian, Professional Response
    let responseText = '';
    const suggestedFollowUps: string[] = [];

    if (searchResult.matchingSpaces.length === 0) {
      responseText = `No spaces match that exact request in our verified network yet.\n\nWe couldn't find available spaces matching ${intent.location ? `"${intent.location}"` : ''} ${intent.categoryLabel ? `for ${intent.categoryLabel}` : ''}${intent.maxPrice ? ` under ${formatPriceNGN(intent.maxPrice)}` : ''}.\n\nYou can try expanding your search to neighboring areas like Victoria Island or Ikeja, adjusting your budget, or browsing all verified hubs.`;
      
      suggestedFollowUps.push('Show all spaces in Lagos');
      suggestedFollowUps.push('Find meeting rooms in VI');
      suggestedFollowUps.push('Show creative studios in Lekki');
      suggestedFollowUps.push('Ask how OFIS works');
    } else {
      const count = searchResult.matchingSpaces.length;
      const countPhrase = count === 1 ? '1 verified space' : `${count} verified spaces`;
      const locationPhrase = intent.location ? ` in ${intent.location}` : ' across Nigeria';
      const budgetPhrase = intent.maxPrice ? ` within your budget of ${formatPriceNGN(intent.maxPrice)}` : '';
      const categoryPhrase = intent.categoryLabel ? ` for ${intent.categoryLabel.toLowerCase()}` : '';

      responseText = `I found ${countPhrase}${locationPhrase}${categoryPhrase}${budgetPhrase}.`;

      if (searchResult.recommendationReason) {
        responseText += `\n\n${searchResult.recommendationReason}`;
      }

      if (intent.clarificationNeeded) {
        responseText += `\n\n💡 ${intent.clarificationNeeded}`;
      }

      // Generate context-aware refinement suggestions
      if (!intent.needsParking) {
        suggestedFollowUps.push('Only ones with parking');
      }
      if (intent.category === 'studio') {
        suggestedFollowUps.push('Which one is best for video?');
      }
      if (!intent.maxPrice) {
        suggestedFollowUps.push('Show options under ₦50k');
      }
      if (searchResult.matchingSpaces.length > 0) {
        suggestedFollowUps.push('Book the first one');
      }
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'ofis',
      text: responseText,
      intent,
      matchingSpaces: searchResult.matchingSpaces,
      recommendedSpaceId: searchResult.recommendation?.id,
      recommendationReason: searchResult.recommendationReason,
      suggestedFollowUps: suggestedFollowUps.slice(0, 4),
      timestamp: new Date().toISOString(),
    };
  }
}
