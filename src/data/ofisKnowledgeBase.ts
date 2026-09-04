export interface OfisKnowledgeArticle {
  id: string;
  category: 'about' | 'verification' | 'booking' | 'pricing' | 'hosts' | 'business' | 'cancellation' | 'support' | 'legal';
  title: string;
  summary: string;
  details: string;
  keywords: string[];
  linkAction?: {
    label: string;
    view: string;
    tab?: string;
  };
}

export const OFIS_KNOWLEDGE_ARTICLES: OfisKnowledgeArticle[] = [
  {
    id: 'what-is-ofis',
    category: 'about',
    title: 'What is OFIS?',
    summary: 'OFIS is Nigeria’s physical space network for discovering, understanding, and booking verified workspaces, boardrooms, creative studios, and event spaces.',
    details: 'OFIS connects professionals, teams, creators, and enterprises with verified physical spaces across Nigeria. Every space in our network is audited for guaranteed backup power (solar/inverter and dual generators), reliable high-speed fiber internet, and productive environments. Instead of dealing with opaque rental contracts or unreliable facilities, OFIS enables on-demand booking by the hour, day, month, or session with transparent Nigerian Naira pricing.',
    keywords: ['what is ofis', 'about ofis', 'who is ofis', 'how does ofis work', 'ofis meaning', 'concept', 'what do you do'],
    linkAction: {
      label: 'Read more about OFIS',
      view: 'about'
    }
  },
  {
    id: 'how-to-book',
    category: 'booking',
    title: 'How do bookings work on OFIS?',
    summary: 'You can book physical spaces instantly or by request with automated check-in and QR digital passes.',
    details: 'Booking on OFIS is seamless: 1. Tell OFIS what you need or browse our verified network. 2. Select your date, start time, and duration (hours, full days, months, or creative sessions). 3. Complete payment securely in Nigerian Naira via Paystack or your OFIS wallet. 4. Instantly receive your digital entry pass with a unique QR check-in code and host direct contact details. Show your pass at the front desk when you arrive.',
    keywords: ['how to book', 'booking process', 'reserve space', 'how do bookings work', 'digital pass', 'check in', 'make reservation'],
    linkAction: {
      label: 'Explore how booking works',
      view: 'faq'
    }
  },
  {
    id: 'verification-power-uptime',
    category: 'verification',
    title: 'How does OFIS verify spaces and guarantee power?',
    summary: 'Every OFIS location undergoes a 5-point physical audit verifying 24/7 backup power and high-speed fiber.',
    details: 'Power cuts and slow internet derail productivity. OFIS spaces must pass our strict 5-point physical verification: 1. Continuous Power Guarantee (automatic switchover between national grid, solar/inverters, and heavy-duty generators within seconds). 2. Fiber Speed Telemetry (minimum 100Mbps dedicated fiber/Starlink tested on-site). 3. Acoustic Sound Testing (measuring ambient decibel levels for quiet focus or studio soundproofing). 4. Ergonomics & Comfort (proper task chairs, air conditioning, and safety). 5. Host & Facility KYC inspection.',
    keywords: ['verify', 'verification', 'power uptime', 'electricity', 'generator', 'solar', 'internet speed', 'starlink', 'uptime guarantee', 'how do you verify'],
    linkAction: {
      label: 'Learn about trust & verification',
      view: 'about'
    }
  },
  {
    id: 'pricing-and-payment',
    category: 'pricing',
    title: 'How does pricing work on OFIS?',
    summary: 'Transparent, deterministic Nigerian Naira pricing with no hidden facility fees.',
    details: 'All rates on OFIS are displayed in Nigerian Naira (₦). Workspaces are priced based on their operational model: Coworking desks are typically priced per person (per hour or per day). Meeting rooms, private offices, and event halls are priced per space (the room rate covers the entire team capacity; guest counts do not multiply room rates). Creative podcast/photo studios are priced per hour or per creative session. We accept all Nigerian debit cards (Mastercard, Visa, Verve), direct bank transfers, and USSD via Paystack.',
    keywords: ['pricing', 'cost', 'how much', 'payment', 'paystack', 'currency', 'rates', 'hidden fees', 'naira', 'pricing model'],
    linkAction: {
      label: 'View pricing FAQ',
      view: 'faq'
    }
  },
  {
    id: 'list-your-space',
    category: 'hosts',
    title: 'How do I list my space on OFIS?',
    summary: 'Earn from your physical space by listing on Nigeria’s premier network with zero listing fees.',
    details: 'Commercial hub operators, studio owners, and private office managers can partner with OFIS. Listing is free: submit your space details, photos, amenities, and power setup. Our verification team will review your submission and schedule a physical audit. Once verified, your space goes live to thousands of remote workers, founders, and corporate teams. You retain 88% to 92% of all booking revenue with automated bank payouts.',
    keywords: ['list space', 'host', 'become a host', 'earn money', 'list your space', 'partner', 'property owner', 'monetize space'],
    linkAction: {
      label: 'List your space on OFIS',
      view: 'become_host'
    }
  },
  {
    id: 'cancellation-and-refunds',
    category: 'cancellation',
    title: 'What is the cancellation and refund policy?',
    summary: 'Flexible cancellation with full refunds up to 24 hours before your booking start time.',
    details: 'We understand plans change. For hourly and daily bookings, cancel at least 24 hours prior to scheduled start time for a 100% refund credited back to your original payment method or instant OFIS wallet. Cancellations within 24 hours are subject to a modest host preparation fee. In the rare event of a verified facility outage (such as total power or internet loss), OFIS provides an immediate full refund and rebooks you at an alternative verified space.',
    keywords: ['cancellation', 'refund', 'reschedule', 'cancel booking', 'policy', 'money back'],
    linkAction: {
      label: 'Read cancellation policy',
      view: 'terms'
    }
  },
  {
    id: 'enterprise-business-solutions',
    category: 'business',
    title: 'How can teams and companies use OFIS?',
    summary: 'OFIS for Business offers centralized billing, team credits, and custom multi-city physical space access.',
    details: 'Distributed companies and enterprise teams use OFIS for Business to provide their staff with flexible workspace access across Lagos, Abuja, Port Harcourt, and other hubs. Enjoy consolidated monthly invoicing, corporate discounts, access management, and dedicated account support. Whether your team needs weekly project rooms or all-hands meeting suites, OFIS provides corporate grade solutions.',
    keywords: ['business', 'enterprise', 'teams', 'corporate', 'company', 'bulk booking', 'team pass'],
    linkAction: {
      label: 'Contact business team',
      view: 'contact'
    }
  },
  {
    id: 'locations-and-cities',
    category: 'about',
    title: 'Where does OFIS operate?',
    summary: 'Available across major business and creative districts in Nigeria, including Lagos and Abuja.',
    details: 'OFIS curates verified physical spaces in key commercial hubs: In Lagos: Victoria Island (VI), Lekki Phase 1, Ikoyi, Ikeja (GRA, Allen, Alausa), Yaba, Surulere, and Marina. In Abuja: Maitama, Wuse 2, Central Business District (CBD), and Garki. We are actively expanding to Port Harcourt, Ibadan, and Enugu.',
    keywords: ['locations', 'cities', 'lagos', 'abuja', 'lekki', 'vi', 'victoria island', 'ikeja', 'yaba', 'where'],
    linkAction: {
      label: 'Explore physical space locations',
      view: 'explore'
    }
  },
  {
    id: 'contact-support',
    category: 'support',
    title: 'How do I contact OFIS support?',
    summary: 'Our dedicated Nigerian support team is available via chat, email, and phone.',
    details: 'Need assistance with an active booking, verification question, or custom requirement? You can reach the OFIS Concierge team at support@ofis.ng or via our in-app chat. We operate 7 days a week from 7:00 AM to 9:00 PM WAT.',
    keywords: ['contact', 'support', 'help', 'phone number', 'email', 'customer service', 'reach out'],
    linkAction: {
      label: 'Contact support',
      view: 'contact'
    }
  }
];

export function findMatchingKnowledgeArticle(query: string): OfisKnowledgeArticle | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  // Direct keyword scoring
  let bestMatch: OfisKnowledgeArticle | null = null;
  let highestScore = 0;

  for (const article of OFIS_KNOWLEDGE_ARTICLES) {
    let score = 0;
    
    // Check exact question phrases
    for (const kw of article.keywords) {
      if (q.includes(kw)) {
        score += 15;
      }
      const words = kw.split(' ');
      for (const w of words) {
        if (w.length > 2 && q.includes(w)) {
          score += 2;
        }
      }
    }

    if (article.title.toLowerCase().includes(q) || q.includes(article.title.toLowerCase())) {
      score += 25;
    }

    if (score > highestScore && score >= 10) {
      highestScore = score;
      bestMatch = article;
    }
  }

  return bestMatch;
}
