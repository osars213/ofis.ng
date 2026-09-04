import { Space, SpaceCategory, SearchFilters } from '../types';
import { normalizeCategory, getSpacePricing, calculateBookingPrice, formatPriceNGN } from '../utils/pricing';
import { normalizeLocationText } from '../utils/location';
import { findMatchingKnowledgeArticle, OfisKnowledgeArticle } from '../data/ofisKnowledgeBase';

export interface StructuredSearchIntent {
  rawQuery: string;
  isKnowledgeQuery: boolean;
  knowledgeArticle?: OfisKnowledgeArticle;
  category?: SpaceCategory;
  categoryLabel?: string;
  location?: string;
  city?: string;
  neighborhood?: string;
  capacity?: number;
  maxPrice?: number;
  pricingPeriod?: 'hour' | 'day' | 'month' | 'session';
  dateText?: string;
  timeText?: string;
  durationHours?: number;
  durationDays?: number;
  durationMonths?: number;
  amenities?: string[];
  instantBookingOnly?: boolean;
  needsParking?: boolean;
  needsHighSpeedInternet?: boolean;
  needsBackupPower?: boolean;
  needsSoundproofing?: boolean;
  needsProjector?: boolean;
  needsWhiteboard?: boolean;
  needsCameraEquipment?: boolean;
  isBookingIntent?: boolean;
  targetSpaceReferenceIndex?: number;
  targetSpaceId?: string;
  clarificationNeeded?: string;
  confidenceScore: number;
}

export interface AiConciergeResponse {
  intent: StructuredSearchIntent;
  message: string;
  matchingSpaces: Space[];
  totalMatches: number;
  recommendedSpace?: Space;
  recommendationReason?: string;
  bookingHandoff?: {
    space: Space;
    date: string;
    startTime: string;
    durationHours: number;
    guests: number;
    pricingBreakdown: ReturnType<typeof calculateBookingPrice>;
  };
  suggestedFollowUps: string[];
}

const NIGERIAN_LOCATIONS = [
  // Lagos Neighborhoods
  { name: 'Victoria Island', aliases: ['victoria island', 'vi', 'v.i', 'v.i.', 'ozumba', 'adeola odeku', 'kofo abayomi', 'ahmadu bello'], city: 'Lagos' },
  { name: 'Lekki', aliases: ['lekki', 'lekki phase 1', 'lekki 1', 'admiralty', 'freedom way', 'chevy view', 'osapa', 'ikate', 'marwa'], city: 'Lagos' },
  { name: 'Ikoyi', aliases: ['ikoyi', 'bourdillon', 'banana island', 'gerard', 'awolowo road', 'parkview', 'old ikoyi'], city: 'Lagos' },
  { name: 'Ikeja', aliases: ['ikeja', 'ikeja gra', 'gra ikeja', 'allen', 'alausa', 'maryland', 'opebi', 'toyin street', 'obafemi awolowo'], city: 'Lagos' },
  { name: 'Yaba', aliases: ['yaba', 'herbert macaulay', 'alagomeji', 'akoka', 'sabo yaba', 'commercial avenue'], city: 'Lagos' },
  { name: 'Surulere', aliases: ['surulere', 'bode thomas', 'adeniran ogunsanya', 'masha'], city: 'Lagos' },
  { name: 'Maryland', aliases: ['maryland', 'anthony', 'mende'], city: 'Lagos' },
  { name: 'Marina', aliases: ['marina', 'broad street', 'cms', 'lagos island'], city: 'Lagos' },
  { name: 'Gbagada', aliases: ['gbagada', 'phase 1', 'phase 2'], city: 'Lagos' },
  // Cities
  { name: 'Lagos', aliases: ['lagos', 'lasgidi', 'eko'], city: 'Lagos' },
  { name: 'Abuja', aliases: ['abuja', 'fct', 'federal capital'], city: 'Abuja' },
  { name: 'Maitama', aliases: ['maitama'], city: 'Abuja' },
  { name: 'Wuse', aliases: ['wuse', 'wuse 2', 'wuse ii'], city: 'Abuja' },
  { name: 'Central Business District', aliases: ['cbd', 'central business district', 'central area'], city: 'Abuja' },
  { name: 'Port Harcourt', aliases: ['port harcourt', 'ph', 'pitakwa', 'trans amadi', 'gra ph'], city: 'Port Harcourt' },
  { name: 'Ibadan', aliases: ['ibadan', 'bodija', 'dugbe', 'ring road'], city: 'Ibadan' },
];

export function parseUserQueryIntent(
  query: string, 
  previousIntent?: StructuredSearchIntent
): StructuredSearchIntent {
  const q = query.toLowerCase().trim();

  // 1. Check if it's an informational / about / FAQ query
  const knowledgeMatch = findMatchingKnowledgeArticle(q);
  const isExplicitQuestion = /^(what|how|who|why|where|can i|is ofis|tell me about|how do i|how does)\b/i.test(q) || 
    q.includes('what is') || q.includes('how to') || q.includes('verify') || q.includes('cost') || q.includes('refund');

  if (knowledgeMatch && isExplicitQuestion) {
    return {
      rawQuery: query,
      isKnowledgeQuery: true,
      knowledgeArticle: knowledgeMatch,
      confidenceScore: 95,
    };
  }

  // 2. Category Intelligence: Extract Space Category
  let category: SpaceCategory | undefined = undefined;
  let categoryLabel: string | undefined = undefined;

  if (
    /creative studio|studio|photoshoot|photo shoot|fashion video|video shoot|recording|podcast|audio|cyclorama|green screen|camera|lighting/i.test(q)
  ) {
    category = 'studio';
    categoryLabel = 'Creative Studio & Production';
  } else if (
    /meeting room|boardroom|board room|conference room|client meeting|zoom room|presentation room|huddle/i.test(q)
  ) {
    category = 'meeting-room';
    categoryLabel = 'Meeting Room & Boardroom';
  } else if (
    /private office|offices under|private workspace|team suite|dedicated office|enclosed office|executive suite|office/i.test(q)
  ) {
    category = 'private-office';
    categoryLabel = 'Private Office & Team Suite';
  } else if (
    /training room|training|classroom|workshop|seminar room|team training/i.test(q)
  ) {
    category = 'training-room';
    categoryLabel = 'Training & Workshop Room';
  } else if (
    /event space|event hall|conference for|event venue|tech meetup|product launch|keynote|cocktail|auditorium/i.test(q)
  ) {
    category = 'event-space';
    categoryLabel = 'Event Space & Hall';
  } else if (
    /coworking|quiet place to work|hot desk|focus desk|dedicated desk|work somewhere|desk|work for the day|somewhere to work/i.test(q)
  ) {
    category = 'coworking';
    categoryLabel = 'Coworking & Focus Desk';
  } else if (previousIntent?.category) {
    // Preserve category from conversation context
    category = previousIntent.category;
    categoryLabel = previousIntent.categoryLabel;
  }

  // 3. Location & City Extraction
  let location: string | undefined = undefined;
  let city: string | undefined = undefined;
  let neighborhood: string | undefined = undefined;

  for (const loc of NIGERIAN_LOCATIONS) {
    const match = loc.aliases.some(alias => {
      const regex = new RegExp(`\\b${alias.replace('.', '\\.')}\\b`, 'i');
      return regex.test(q);
    });
    if (match) {
      location = loc.name;
      city = loc.city;
      if (loc.name !== loc.city) {
        neighborhood = loc.name;
      }
      break;
    }
  }

  if (!location && previousIntent?.location) {
    location = previousIntent.location;
    city = previousIntent.city;
    neighborhood = previousIntent.neighborhood;
  }

  // 4. People / Capacity Extraction
  let capacity: number | undefined = undefined;
  const capacityMatch = q.match(/(?:for\s+)?(\d+)\s*(?:people|persons|guests|delegates|participants|seats|attendees|pax)\b/i) ||
                        q.match(/(?:team of|table of|group of)\s*(\d+)/i) ||
                        q.match(/(?:boardroom|room|table)\s+for\s+(\d+)/i);
  if (capacityMatch) {
    capacity = parseInt(capacityMatch[1], 10);
  } else if (/solo|just me|1 person|myself|single desk/i.test(q)) {
    capacity = 1;
  } else if (previousIntent?.capacity) {
    capacity = previousIntent.capacity;
  }

  // 5. Budget / Max Price Extraction
  let maxPrice: number | undefined = undefined;
  let pricingPeriod: 'hour' | 'day' | 'month' | 'session' | undefined = undefined;

  // Check period cues
  if (/per month|a month|\/mo|\/month|monthly/i.test(q)) {
    pricingPeriod = 'month';
  } else if (/per day|a day|\/day|daily|for the day/i.test(q)) {
    pricingPeriod = 'day';
  } else if (/per hour|an hour|\/hr|\/hour|hourly/i.test(q)) {
    pricingPeriod = 'hour';
  } else if (/session|recording session|shoot/i.test(q)) {
    pricingPeriod = 'session';
  }

  // Examples: under ₦80,000, under ₦80k, under 80k, ₦300,000, 300k, budget 50000
  const priceMatch = q.match(/(?:under|below|less than|max|budget of|budget|up to)\s*(?:₦|ngn|n)?\s*(\d+[\d,]*(?:\.\d+)?)\s*(k|thousand|m|million)?/i) ||
                     q.match(/(?:₦|ngn)\s*(\d+[\d,]*(?:\.\d+)?)\s*(k|thousand|m|million)?/i);

  if (priceMatch) {
    let num = parseFloat(priceMatch[1].replace(/,/g, ''));
    const unit = (priceMatch[2] || '').toLowerCase();
    if (unit === 'k' || unit === 'thousand') {
      num *= 1000;
    } else if (unit === 'm' || unit === 'million') {
      num *= 1000000;
    }
    if (num > 0) {
      maxPrice = num;
    }
  } else if (previousIntent?.maxPrice) {
    maxPrice = previousIntent.maxPrice;
    pricingPeriod = previousIntent.pricingPeriod;
  }

  // If period not explicitly mentioned, infer from context/category
  if (!pricingPeriod) {
    if (category === 'private-office' && maxPrice && maxPrice > 100000) {
      pricingPeriod = 'month';
    } else if (category === 'event-space' || (category === 'studio' && maxPrice && maxPrice > 50000)) {
      pricingPeriod = 'day';
    }
  }

  // 6. Time & Duration Extraction
  let dateText: string | undefined = undefined;
  let timeText: string | undefined = undefined;
  let durationHours: number | undefined = undefined;
  let durationDays: number | undefined = undefined;
  let durationMonths: number | undefined = undefined;

  if (/\btomorrow\b/i.test(q)) {
    dateText = 'tomorrow';
  } else if (/\btoday\b/i.test(q)) {
    dateText = 'today';
  } else if (/\bthis afternoon\b/i.test(q)) {
    dateText = 'today';
    timeText = '14:00';
  } else if (/\bthis morning\b/i.test(q)) {
    dateText = 'today';
    timeText = '09:00';
  } else if (/\bsaturday\b/i.test(q)) {
    dateText = 'Saturday';
  } else if (/\bsunday\b/i.test(q)) {
    dateText = 'Sunday';
  } else if (/\bnext week\b/i.test(q)) {
    dateText = 'next week';
  } else if (previousIntent?.dateText) {
    dateText = previousIntent.dateText;
  }

  // Duration
  const hoursMatch = q.match(/(\d+)\s*(?:hours|hrs|hour|hr)\b/i);
  if (hoursMatch) {
    durationHours = parseInt(hoursMatch[1], 10);
  }
  const daysMatch = q.match(/(\d+)\s*(?:days|day)\b/i);
  if (daysMatch) {
    durationDays = parseInt(daysMatch[1], 10);
  }
  const monthsMatch = q.match(/(\d+)\s*(?:months|month)\b/i);
  if (monthsMatch) {
    durationMonths = parseInt(monthsMatch[1], 10);
  }

  // Time window: e.g. "from 10am to 2pm"
  const windowMatch = q.match(/(?:from\s+)?(\d{1,2}(?::\d{2})?\s*(?:am|pm))\s*(?:to|-)\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm))/i);
  if (windowMatch) {
    timeText = `${windowMatch[1]} - ${windowMatch[2]}`;
  }

  // 7. Amenities & Specific Requirements
  const needsParking = /parking|car park|valet/i.test(q) || !!previousIntent?.needsParking;
  const needsHighSpeedInternet = /fast internet|high speed|fiber|starlink|wifi|ethernet/i.test(q) || !!previousIntent?.needsHighSpeedInternet;
  const needsBackupPower = /backup power|generator|solar|inverter|24\/7 power|uptime/i.test(q) || !!previousIntent?.needsBackupPower;
  const needsSoundproofing = /quiet|silent|soundproof|acoustic|noise/i.test(q) || !!previousIntent?.needsSoundproofing;
  const needsProjector = /projector|display|screen|tv|4k screen|presentation/i.test(q) || !!previousIntent?.needsProjector;
  const needsWhiteboard = /whiteboard|flipchart|board/i.test(q) || !!previousIntent?.needsWhiteboard;
  const needsCameraEquipment = /camera|lighting|video|cyclorama|rodecaster|mic|microphone/i.test(q) || !!previousIntent?.needsCameraEquipment;
  const instantBookingOnly = /instant|instant book|available now|immediately/i.test(q) || !!previousIntent?.instantBookingOnly;

  // 8. Booking Intent Check
  // e.g. "Book it", "Book the first one", "Book this space", "Book it tomorrow from 10am to 2pm"
  const isBookingIntent = /\b(?:book|reserve|lock in|secure)\b/i.test(q);
  let targetSpaceReferenceIndex: number | undefined = undefined;

  if (/\b(?:first|1st|number 1|first one)\b/i.test(q)) {
    targetSpaceReferenceIndex = 0;
  } else if (/\b(?:second|2nd|number 2|second one)\b/i.test(q)) {
    targetSpaceReferenceIndex = 1;
  } else if (/\b(?:third|3rd|number 3|third one)\b/i.test(q)) {
    targetSpaceReferenceIndex = 2;
  }

  // 9. Clarification Check
  // If the query is very sparse (e.g. "I need a meeting room"), we should note clarification
  let clarificationNeeded: string | undefined = undefined;
  if (category && !location && !capacity && !maxPrice) {
    clarificationNeeded = `Where in Lagos (e.g. Lekki, VI, or Ikeja), how many people, and when do you need this ${categoryLabel?.toLowerCase() || 'space'}?`;
  } else if (category && location && !capacity && (category === 'meeting-room' || category === 'training-room' || category === 'event-space')) {
    clarificationNeeded = `How many people will be attending in ${location}?`;
  }

  return {
    rawQuery: query,
    isKnowledgeQuery: false,
    category,
    categoryLabel,
    location,
    city,
    neighborhood,
    capacity,
    maxPrice,
    pricingPeriod,
    dateText,
    timeText,
    durationHours,
    durationDays,
    durationMonths,
    instantBookingOnly,
    needsParking,
    needsHighSpeedInternet,
    needsBackupPower,
    needsSoundproofing,
    needsProjector,
    needsWhiteboard,
    needsCameraEquipment,
    isBookingIntent,
    targetSpaceReferenceIndex,
    clarificationNeeded,
    confidenceScore: 85,
  };
}

/**
 * Executes a deterministic search over real OFIS inventory based on structured intent.
 * CRITICAL: Never invents spaces or pricing!
 */
export function executeStructuredSearch(
  intent: StructuredSearchIntent,
  inventory: Space[]
): {
  matchingSpaces: Space[];
  recommendation?: Space;
  recommendationReason?: string;
  summaryText: string;
} {
  let spaces = [...inventory];

  // Strictly filter only verified & active spaces
  spaces = spaces.filter(s => s.isActive !== false && s.isVerified !== false);

  // 1. Category Filter
  if (intent.category) {
    const targetNorm = normalizeCategory(intent.category);
    spaces = spaces.filter(s => normalizeCategory(s.category) === targetNorm);
  }

  // 2. Location Filter
  if (intent.location) {
    const target = normalizeLocationText(intent.location);
    spaces = spaces.filter(s => {
      const spaceCity = normalizeLocationText(s.city);
      const spaceNeighborhood = normalizeLocationText(s.neighborhood);
      const spaceAddress = normalizeLocationText(s.address);
      return spaceNeighborhood.includes(target) || 
             target.includes(spaceNeighborhood) ||
             spaceCity.includes(target) || 
             target.includes(spaceCity) ||
             spaceAddress.includes(target);
    });
  }

  // 3. Capacity Filter
  if (intent.capacity && intent.capacity > 0) {
    spaces = spaces.filter(s => (s.capacity || 1) >= (intent.capacity || 1));
  }

  // 4. Max Price Filter
  if (intent.maxPrice && intent.maxPrice > 0) {
    spaces = spaces.filter(s => {
      const pricing = getSpacePricing(s);
      if (intent.pricingPeriod === 'month') {
        return s.pricePerMonth ? s.pricePerMonth <= intent.maxPrice! : ((s.pricePerHour * 160) <= intent.maxPrice!);
      }
      if (intent.pricingPeriod === 'day') {
        return s.pricePerDay ? s.pricePerDay <= intent.maxPrice! : (pricing.rate <= intent.maxPrice!);
      }
      if (intent.pricingPeriod === 'hour') {
        return s.pricePerHour ? s.pricePerHour <= intent.maxPrice! : (pricing.rate <= intent.maxPrice!);
      }
      return pricing.rate <= intent.maxPrice! || (s.pricePerHour && s.pricePerHour <= intent.maxPrice!);
    });
  }

  // 5. Specific Amenity Filters
  if (intent.needsParking) {
    spaces = spaces.filter(s => 
      (s.amenities || []).some(a => /parking|garage|valet/i.test(a)) ||
      (s.tags || []).some(t => /parking/i.test(t)) ||
      (s.description || '').toLowerCase().includes('parking')
    );
  }

  if (intent.needsHighSpeedInternet) {
    spaces = spaces.filter(s => (s.internetSpeedMbps || 0) >= 150 || (s.amenities || []).some(a => /starlink|fiber/i.test(a)));
  }

  if (intent.needsBackupPower) {
    spaces = spaces.filter(s => s.hasBackupPower !== false);
  }

  if (intent.needsSoundproofing) {
    spaces = spaces.filter(s => 
      s.noiseLevel?.toLowerCase().includes('soundproof') ||
      s.noiseLevel?.toLowerCase().includes('silent') ||
      (s.amenities || []).some(a => /soundproof|acoustic/i.test(a)) ||
      (s.description || '').toLowerCase().includes('soundproof')
    );
  }

  if (intent.needsProjector) {
    spaces = spaces.filter(s => 
      (s.amenities || []).some(a => /projector|display|screen|tv|av|monitor/i.test(a)) ||
      (s.description || '').toLowerCase().includes('projector') ||
      (s.description || '').toLowerCase().includes('display')
    );
  }

  if (intent.needsCameraEquipment) {
    spaces = spaces.filter(s => 
      s.category === 'studio' ||
      (s.amenities || []).some(a => /camera|mic|lighting|cyclorama|strobe/i.test(a))
    );
  }

  if (intent.instantBookingOnly) {
    spaces = spaces.filter(s => s.instantBooking === true);
  }

  // 6. Deterministic Rank / Recommendation
  // Rank by rating, power uptime guarantee, and superhost
  spaces.sort((a, b) => {
    const scoreA = (a.isSuperhost ? 10 : 0) + (a.rating || 4.5) * 5 + (a.powerUptimeGuaranteePercent || 95) / 10;
    const scoreB = (b.isSuperhost ? 10 : 0) + (b.rating || 4.5) * 5 + (b.powerUptimeGuaranteePercent || 95) / 10;
    return scoreB - scoreA;
  });

  const topMatch = spaces[0];
  let recommendationReason: string | undefined = undefined;

  if (topMatch) {
    const pricing = getSpacePricing(topMatch);
    const highlights: string[] = [];
    if (topMatch.capacity >= (intent.capacity || 1)) {
      highlights.push(`supports up to ${topMatch.capacity} people`);
    }
    if (topMatch.hasBackupPower) {
      highlights.push(`guaranteed ${topMatch.powerType} (${topMatch.powerUptimeGuaranteePercent}% uptime)`);
    }
    if (topMatch.internetSpeedMbps) {
      highlights.push(`${topMatch.internetSpeedMbps}Mbps ${topMatch.internetIsp}`);
    }
    if (intent.maxPrice && pricing.rate <= intent.maxPrice) {
      highlights.push(`within your budget at ${pricing.rateDisplay}`);
    }

    recommendationReason = `Top match in ${topMatch.neighborhood || topMatch.city} because it ${highlights.join(', ')}.`;
  }

  // Build natural summary text
  let summaryText = '';
  if (spaces.length === 0) {
    summaryText = `No verified spaces match those exact criteria yet. We found no locations currently available for that combination.`;
  } else if (spaces.length === 1) {
    summaryText = `I found 1 verified space that matches your requirements.`;
  } else {
    summaryText = `I found ${spaces.length} verified physical spaces matching your criteria.`;
  }

  return {
    matchingSpaces: spaces,
    recommendation: topMatch,
    recommendationReason,
    summaryText,
  };
}
