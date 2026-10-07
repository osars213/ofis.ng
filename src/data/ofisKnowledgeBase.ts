export interface OfisKnowledgeArticle {
  id: string;
  category: 'about' | 'verification' | 'booking' | 'pricing' | 'hosts' | 'business' | 'cancellation' | 'support' | 'legal' | 'spaces' | 'payments' | 'wallet';
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
    details: 'OFIS connects professionals, remote workers, teams, creators, and enterprises with verified physical spaces across Nigeria. Every space in our network is audited for guaranteed 24/7 backup power (automatic switchover between grid, solar/inverters, and dual heavy-duty generators), dedicated high-speed fiber internet (with Starlink redundancy), air conditioning, and productive environments.\n\nInstead of dealing with opaque long-term leases, erratic electricity, or unreliable facilities, OFIS enables on-demand booking by the hour, day, month, or session with transparent Nigerian Naira pricing and instant digital check-in passes.',
    keywords: [
      'what is ofis', 'about ofis', 'who is ofis', 'how does ofis work', 'ofis meaning', 
      'concept', 'what do you do', 'what is this website', 'tell me about ofis', 'about us', 
      'company profile', 'who are you', 'what is the platform'
    ],
    linkAction: {
      label: 'Read more about OFIS',
      view: 'about'
    }
  },
  {
    id: 'how-to-book',
    category: 'booking',
    title: 'How do bookings work on OFIS?',
    summary: 'You can book physical spaces instantly or by request with automated check-in and digital QR entry passes.',
    details: 'Booking a verified workspace on OFIS is simple and seamless:\n\n1. Search or use Ofis Assistant: Browse verified spaces by location, capacity, or space type (hot desk, private office, meeting room, creative studio).\n2. Choose Date & Time: Select your date, start time, and duration (hours, full days, months, or creative sessions).\n3. Secure Checkout: Complete payment in Nigerian Naira (₦) via debit card (Mastercard, Visa, Verve), bank transfer, USSD via Paystack, or instant OFIS Wallet balance.\n4. Instant Digital Entry Pass: You receive a digital pass with a unique QR check-in code, venue host direct contact, and arrival directions.\n5. Front Desk Check-in: Show your QR pass upon arrival at the hub turnstile/reception for instant access.',
    keywords: [
      'how to book', 'booking process', 'reserve space', 'how do bookings work', 'digital pass', 
      'check in', 'make reservation', 'how does booking work', 'how to reserve', 'step by step booking',
      'can i book', 'booking steps', 'qr code', 'entry pass'
    ],
    linkAction: {
      label: 'Explore how booking works',
      view: 'faq'
    }
  },
  {
    id: 'cancellation-and-refunds',
    category: 'cancellation',
    title: 'What is the cancellation and refund policy?',
    summary: 'Cancellations and refunds are issued as OFIS wallet credit with NO expiry date, usable anytime for future bookings.',
    details: 'Our cancellation and refund policy is flexible, transparent, and user-centric:\n\n• Wallet Credit Refund: When you cancel an eligible booking, your refund is credited directly to your OFIS Wallet as wallet credit.\n• No Expiry Date: OFIS wallet credits have NO EXPIRY DATE. Your credit remains safely in your account indefinitely.\n• Universal Reusability: You can apply your wallet credit anytime towards any future desk, meeting room, private office, or creative studio booking across the entire OFIS network.\n• Notice Period: Cancellations made at least 24 hours prior to the scheduled booking start time receive a 100% wallet credit refund. Cancellations within 24 hours may be subject to a modest host preparation fee.\n• 100% Power & Facility SLA Guarantee: In the rare event of a verified venue outage (such as total power or internet downtime), OFIS provides an immediate 100% wallet credit refund and will assist you in rebooking at an alternative verified space.',
    keywords: [
      'cancellation', 'refund', 'refund policy', 'cancellation policy', 'reschedule', 
      'cancel booking', 'policy', 'money back', 'wallet credit', 'no expiry', 'do credits expire', 
      'expire', 'expiration', 'can i cancel', 'how do refunds work', 'wallet refund', 'get refund'
    ],
    linkAction: {
      label: 'Read cancellation policy',
      view: 'terms'
    }
  },
  {
    id: 'pricing-and-payment',
    category: 'pricing',
    title: 'How does pricing work on OFIS?',
    summary: 'Transparent, deterministic Nigerian Naira pricing with zero hidden facility fees.',
    details: 'All rates on OFIS are transparent and displayed in Nigerian Naira (₦). Pricing models depend on the space type:\n\n• Coworking & Hot Desks: Typically priced per person (e.g., from ₦1,500/hr or ₦8,000/day). Covers high-speed fiber internet and uninterrupted power.\n• Meeting Rooms & Boardrooms: Priced per room per hour (e.g., from ₦15,000/hr). The room rate covers the entire team up to full room capacity (guest count does NOT multiply the room rate).\n• Private Offices: Priced per office by the day or month, covering dedicated lockable team suites.\n• Creative Studios: Priced by the hour or creative production session (typically 3–4 hours) with basic lighting rigs and acoustics included.\n• Zero Hidden Fees: Electricity, backup generators, and fiber connectivity are always included in the listed price.',
    keywords: [
      'pricing', 'cost', 'how much', 'rates', 'hidden fees', 'naira', 'pricing model', 
      'how much does it cost', 'how does pricing work', 'desk price', 'meeting room price', 
      'studio price', 'is it expensive', 'hourly rate', 'daily rate'
    ],
    linkAction: {
      label: 'View pricing FAQ',
      view: 'faq'
    }
  },
  {
    id: 'how-payments-work',
    category: 'payments',
    title: 'How do payments work on OFIS?',
    summary: 'Secure Nigerian payments powered by Paystack, supporting cards, bank transfers, USSD, and OFIS Wallet.',
    details: 'Payments on OFIS are fast, secure, and PCI-DSS compliant:\n\n• Accepted Payment Methods: Nigerian debit cards (Mastercard, Visa, Verve), instant bank transfers, and USSD via Paystack.\n• OFIS Wallet: Use your accumulated wallet balance or cancellation refund credits for instant, 1-click checkout.\n• Currency: All transactions are processed in Nigerian Naira (₦). For international users, you can toggle currency preview to USD ($), GBP (£), or EUR (€) at live rates, but billing is settled securely in NGN.\n• Automatic Receipts: Detailed digital receipts and VAT-compliant invoices are generated immediately upon payment completion.',
    keywords: [
      'payment', 'payments', 'how payments work', 'paystack', 'card', 'debit card', 
      'bank transfer', 'ussd', 'mastercard', 'visa', 'verve', 'currency', 'pay online', 
      'how do i pay', 'wallet payment', 'secure payment'
    ],
    linkAction: {
      label: 'View payment methods',
      view: 'faq'
    }
  },
  {
    id: 'available-spaces',
    category: 'spaces',
    title: 'What spaces are available on OFIS?',
    summary: 'Coworking desks, private offices, meeting rooms, creative studios, training rooms, and event halls across Lagos and Abuja.',
    details: 'OFIS offers 6 core categories of verified physical spaces:\n\n1. Coworking Desks: Ergonomic hot desks and dedicated focus desks with guaranteed power and fast fiber.\n2. Meeting Rooms & Boardrooms: Professional presentation and conference rooms equipped with smart TVs, whiteboards, and video-conferencing setups (4 to 20+ seats).\n3. Private Offices: Lockable, fully furnished private team offices for startups and enterprise branches.\n4. Creative Studios: Soundproof podcast recording studios, photography cycloramas, and video production suites.\n5. Training & Workshop Rooms: Configurable classroom spaces with projectors and audio systems for up to 50 people.\n6. Event Spaces: Modern indoor and outdoor venues for tech demos, product launches, and community gatherings.\n\nAll spaces feature verified 100% backup power and enterprise internet.',
    keywords: [
      'what spaces are available', 'what spaces do you have', 'available spaces', 'space types', 
      'categories', 'coworking', 'private office', 'meeting room', 'boardroom', 'studio', 
      'podcast studio', 'training room', 'event space', 'desks', 'types of spaces'
    ],
    linkAction: {
      label: 'Explore all spaces',
      view: 'explore'
    }
  },
  {
    id: 'contact-info',
    category: 'support',
    title: 'How do I contact OFIS? (Contact & Support)',
    summary: 'General inquiries: hello@ofis.ng • Customer & booking support: support@ofis.ng.',
    details: 'You can reach the OFIS team through our official channels:\n\n• General Inquiries ("Contact Us"): hello@ofis.ng (for partnerships, corporate billing, space owner onboarding, media, and general questions).\n• Customer Support ("Support"): support@ofis.ng (for active booking assistance, turnstile pass verification, venue check-in questions, and technical help).\n\nOur support team is online 7 days a week from 7:00 AM to 9:00 PM WAT.',
    keywords: [
      'contact', 'contact info', 'contact us', 'support', 'support contact', 'email', 
      'hello@ofis.ng', 'support@ofis.ng', 'how to contact', 'reach out', 'customer care', 
      'help desk', 'customer service', 'phone', 'address', 'talk to someone'
    ],
    linkAction: {
      label: 'Contact us',
      view: 'contact'
    }
  },
  {
    id: 'verification-power-uptime',
    category: 'verification',
    title: 'How does OFIS verify spaces and guarantee power?',
    summary: 'Every OFIS location undergoes a 5-point physical audit verifying 24/7 backup power and high-speed fiber.',
    details: 'Power outages and slow internet derail productivity. Every space on OFIS must pass our physical 5-point audit:\n\n1. Continuous Power SLA: Automated switchover between national grid, solar/inverters, and dual heavy-duty diesel generators within seconds.\n2. Fiber & Starlink Speed Telemetry: Minimum 100Mbps dedicated fiber verified on-site.\n3. Acoustic Decibel Testing: Ensuring quiet focus areas and sound-treated studio environments.\n4. Ergonomics & Comfort: Certified task seating, functional air conditioning, and safety standards.\n5. Host & Facility KYC: Verification of space operators and safety compliance.',
    keywords: [
      'verify', 'verification', 'power uptime', 'electricity', 'generator', 'solar', 
      'internet speed', 'starlink', 'uptime guarantee', 'how do you verify', 'light', 
      'sla', 'power guarantee', 'backup power'
    ],
    linkAction: {
      label: 'Learn about trust & verification',
      view: 'about'
    }
  },
  {
    id: 'locations-and-cities',
    category: 'about',
    title: 'Where does OFIS operate in Nigeria?',
    summary: 'Available across major commercial hubs in Lagos and Abuja, with expansion underway.',
    details: 'OFIS curates verified physical spaces in key commercial hubs:\n\n• Lagos: Victoria Island (VI), Lekki Phase 1, Ikoyi, Ikeja (GRA, Alausa, Allen), Yaba, Maryland, and Surulere.\n• Abuja: Maitama, Wuse 2, Central Business District (CBD), and Garki.\n\nWe are actively onboarding verified partners in Port Harcourt, Ibadan, and Enugu.',
    keywords: [
      'locations', 'cities', 'lagos', 'abuja', 'lekki', 'vi', 'victoria island', 
      'ikeja', 'yaba', 'where', 'where are you located', 'where does ofis operate', 
      'ikoyi', 'maitama', 'wuse'
    ],
    linkAction: {
      label: 'Explore physical space locations',
      view: 'explore'
    }
  },
  {
    id: 'list-your-space',
    category: 'hosts',
    title: 'How do I list my space on OFIS? (Host Platform)',
    summary: 'Monetize your physical space by listing on Nigeria’s premier network with zero upfront fees.',
    details: 'Commercial hub operators, private office managers, and creative studio owners can list on the OFIS Host Platform:\n\n1. Free Submission: Submit your space specifications, photos, and power setup.\n2. Physical Audit: Our verification team schedules an on-site inspection for power SLA and connectivity.\n3. Go Live: Once approved, your space is instantly bookable by thousands of verified professionals and enterprise teams.\n4. Automated Payouts: Retain 88% to 92% of booking revenue with automated direct bank settlements to any Nigerian bank.',
    keywords: [
      'list space', 'host', 'become a host', 'earn money', 'list your space', 'partner', 
      'property owner', 'monetize space', 'host standards', 'payouts'
    ],
    linkAction: {
      label: 'List your space on OFIS',
      view: 'become_host'
    }
  },
  {
    id: 'ofis-wallet-system',
    category: 'wallet',
    title: 'How does the OFIS Wallet work?',
    summary: 'Your digital account balance for 1-click bookings and non-expiring cancellation credits.',
    details: 'The OFIS Wallet provides frictionless booking across Nigeria:\n\n• Instant Funding: Fund your wallet directly with debit card or bank transfer via Paystack.\n• Non-Expiring Credits: All cancellation refunds are deposited into your OFIS Wallet and NEVER EXPIRE.\n• 1-Click Checkout: Book desks or meeting rooms instantly without re-entering card details.\n• Secure Balance: Track all deposits, refunds, and booking debits with transparent statement logs.',
    keywords: [
      'wallet', 'ofis wallet', 'wallet credit', 'wallet balance', 'fund wallet', 
      'how does wallet work', 'wallet refund', 'credits', 'no expiry'
    ],
    linkAction: {
      label: 'View wallet in account',
      view: 'dashboard'
    }
  },
  {
    id: 'enterprise-business-solutions',
    category: 'business',
    title: 'How can teams and corporate companies use OFIS?',
    summary: 'OFIS for Business offers consolidated corporate billing, team credits, and multi-city physical space access.',
    details: 'Distributed companies, remote startups, and corporate teams use OFIS for Business to provide staff with flexible workspace access across Lagos and Abuja. Benefits include consolidated monthly invoicing, corporate discounts, access management, and dedicated account support. Contact hello@ofis.ng for custom corporate packages.',
    keywords: [
      'business', 'enterprise', 'teams', 'corporate', 'company', 'bulk booking', 
      'team pass', 'corporate billing'
    ],
    linkAction: {
      label: 'Contact business team',
      view: 'contact'
    }
  }
];

export function findMatchingKnowledgeArticle(query: string): OfisKnowledgeArticle | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  // Direct fast-path triggers for core policy & business questions
  if (/(support@ofis|support contact|customer support|support email|customer service|help desk|technical support)/i.test(q)) {
    return OFIS_KNOWLEDGE_ARTICLES.find(a => a.id === 'contact-info') || null;
  }
  if (/(hello@ofis|general contact|contact us|contact info|contact ofis|reach out|how do i contact|how to contact|email address|phone number)/i.test(q)) {
    return OFIS_KNOWLEDGE_ARTICLES.find(a => a.id === 'contact-info') || null;
  }
  if (/(cancel|cancellation|refund|refunds|wallet credit|no expiry|do credits expire|expire|money back|reschedule|can i cancel)/i.test(q)) {
    return OFIS_KNOWLEDGE_ARTICLES.find(a => a.id === 'cancellation-and-refunds') || null;
  }
  if (/(what is ofis|about ofis|who is ofis|tell me about ofis|about the company|what do you do|what is this website|about us)/i.test(q)) {
    return OFIS_KNOWLEDGE_ARTICLES.find(a => a.id === 'what-is-ofis') || null;
  }
  if (/(how does booking work|how to book|booking process|how do i reserve|step by step booking|how do bookings work|how to make a booking|can i book)/i.test(q)) {
    return OFIS_KNOWLEDGE_ARTICLES.find(a => a.id === 'how-to-book') || null;
  }
  if (/(pricing|how much does it cost|pricing model|hidden fees|rates|cost of|hourly rate|daily rate|how does pricing work|what are the prices)/i.test(q)) {
    return OFIS_KNOWLEDGE_ARTICLES.find(a => a.id === 'pricing-and-payment') || null;
  }
  if (/(how payments work|payment method|paystack|debit card|bank transfer|ussd|how do i pay|how does payment work|payment options)/i.test(q)) {
    return OFIS_KNOWLEDGE_ARTICLES.find(a => a.id === 'how-payments-work') || null;
  }
  if (/(what spaces are available|what spaces do you have|available spaces|space types|categories of spaces|what kind of spaces|spaces available)/i.test(q)) {
    return OFIS_KNOWLEDGE_ARTICLES.find(a => a.id === 'available-spaces') || null;
  }
  if (/(power sla|generator|solar|inverter|24\/7 power|electricity|uptime guarantee|backup power|verified spaces|how do you verify)/i.test(q)) {
    return OFIS_KNOWLEDGE_ARTICLES.find(a => a.id === 'verification-power-uptime') || null;
  }
  if (/(where do you operate|locations|where is ofis|which cities|what cities)/i.test(q)) {
    return OFIS_KNOWLEDGE_ARTICLES.find(a => a.id === 'locations-and-cities') || null;
  }
  if (/(list your space|become a host|list my space|host standards|earn money as host|how to host)/i.test(q)) {
    return OFIS_KNOWLEDGE_ARTICLES.find(a => a.id === 'list-your-space') || null;
  }
  if (/(ofis wallet|wallet balance|fund wallet|wallet credit)/i.test(q)) {
    return OFIS_KNOWLEDGE_ARTICLES.find(a => a.id === 'ofis-wallet-system') || null;
  }

  // Generalized keyword scoring
  let bestMatch: OfisKnowledgeArticle | null = null;
  let highestScore = 0;

  for (const article of OFIS_KNOWLEDGE_ARTICLES) {
    let score = 0;

    // Check exact question phrases and keywords
    for (const kw of article.keywords) {
      if (q === kw || q.includes(kw)) {
        score += 25;
      }
      const words = kw.split(' ');
      for (const w of words) {
        if (w.length > 2 && q.includes(w)) {
          score += 4;
        }
      }
    }

    if (article.title.toLowerCase().includes(q) || q.includes(article.title.toLowerCase())) {
      score += 30;
    }

    if (score > highestScore && score >= 8) {
      highestScore = score;
      bestMatch = article;
    }
  }

  return bestMatch;
}
