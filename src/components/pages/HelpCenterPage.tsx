import React, { useState } from 'react';
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  Zap, 
  Wifi, 
  QrCode, 
  CreditCard, 
  ShieldCheck, 
  ChevronRight, 
  ChevronDown,
  ArrowRight,
  MessageCircle,
  FileQuestion
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const HELP_CATEGORIES = [
  {
    id: 'getting-started',
    title: 'Getting Started & Booking',
    icon: BookOpen,
    description: 'How to search, select desks, and make your first instant reservation.'
  },
  {
    id: 'passes-checkin',
    title: 'Digital Passes & Turnstile Access',
    icon: QrCode,
    description: 'Using your live QR pass, reception verification, and door codes.'
  },
  {
    id: 'power-wifi',
    title: 'Power & Wi-Fi Guarantees',
    icon: Zap,
    description: 'Generator switchover protocols, Starlink speeds, and troubleshooting.'
  },
  {
    id: 'billing-receipts',
    title: 'Payments, Currencies & Receipts',
    icon: CreditCard,
    description: 'Paystack, Flutterwave, multi-currency conversion, and VAT invoices.'
  },
  {
    id: 'host-tools',
    title: 'Space Hosts & Property Managers',
    icon: ShieldCheck,
    description: 'Listing spaces, setting rates, calendar sync, and weekly bank payouts.'
  }
];

const HELP_ARTICLES = [
  {
    category: 'getting-started',
    title: 'How do I book a desk or meeting room for today?',
    content: 'Find a workspace on the Explore page or Map, choose your arrival time, select the number of hours or day pass, and click "Book Space Now". You can checkout with card, bank transfer, or wallet balance.'
  },
  {
    category: 'getting-started',
    title: 'Can I extend my booking duration while working at the space?',
    content: 'Yes! Open your active booking pass in "My Bookings" and tap "Extend Pass". You can add 1, 2, or 4 hours at the standard hourly rate, subject to desk availability.'
  },
  {
    category: 'passes-checkin',
    title: 'Where do I find my digital QR pass upon arrival?',
    content: 'Your live QR pass is available immediately in the "Bookings" tab. Flash the QR code at the entrance turnstile or front desk scanner. The pass automatically validates and reveals the space Wi-Fi password.'
  },
  {
    category: 'power-wifi',
    title: 'What happens if there is a city grid power outage?',
    content: 'All OFIS partner spaces are audited and equipped with automated dual diesel generators and pure sine wave solar inverters with 0.00ms switchover lag. Your power and Wi-Fi will not experience interruptions.'
  },
  {
    category: 'billing-receipts',
    title: 'Can I pay in foreign currencies (USD, GBP, EUR)?',
    content: 'Yes. OFIS supports Paystack and Flutterwave international payment channels. The app automatically detects your IP location or lets you select USD, GBP, EUR, CAD, KES, GHS, or ZAR from the currency selector.'
  },
  {
    category: 'host-tools',
    title: 'When and how do space hosts receive their booking payouts?',
    content: 'Host earnings are automatically accumulated in your host wallet and disbursed weekly on Fridays directly to your verified Nigerian NGN commercial bank account via NIBSS Instant Payment.'
  }
];

export const HelpCenterPage: React.FC = () => {
  const { setCurrentView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const filteredArticles = HELP_ARTICLES.filter(art => {
    const matchesCategory = activeCategory === 'all' || art.category === activeCategory;
    const matchesSearch = !searchQuery || 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#111827] dark:text-[#F8FAFC] transition-colors duration-150">
      
      {/* Search Header */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E5E7EB] dark:border-[#1E293B] text-center bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B1220] dark:via-[#0F172A] dark:to-[#0B1220]">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#0F766E]/15 dark:bg-[#0F766E]/15 border border-[#0F766E]/30 text-xs font-bold text-[#0F766E] dark:text-[#14B8A6]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Knowledge Base & Guides</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">How can we help you today?</h1>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help articles (e.g. WiFi password, QR pass, power backup, payouts)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] text-xs sm:text-sm shadow-md focus:outline-none focus:border-[#0F766E]"
            />
          </div>
        </div>
      </section>

      {/* Main Categories */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        
        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`p-5 rounded-2xl text-left border transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#0F766E]/15 dark:bg-[#0F766E]/15 border-[#0F766E] shadow-xs'
                : 'bg-white dark:bg-[#172033] border-[#E5E7EB] dark:border-[#1E293B] hover:border-[#0F766E]'
            }`}
          >
            <div className="flex items-center space-x-3">
              <FileQuestion className="w-6 h-6 text-[#0F766E] dark:text-[#14B8A6]" />
              <div>
                <h4 className="font-bold text-xs">All Topics</h4>
                <p className="text-[11px] text-[#6B7280] dark:text-[#94A3B8]">Browse all guides</p>
              </div>
            </div>
          </button>

          {HELP_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`p-5 rounded-2xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0F766E]/15 dark:bg-[#0F766E]/15 border-[#0F766E] shadow-xs'
                    : 'bg-white dark:bg-[#172033] border-[#E5E7EB] dark:border-[#1E293B] hover:border-[#0F766E]'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Icon className="w-6 h-6 text-[#0F766E] dark:text-[#14B8A6] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs">{cat.title}</h4>
                    <p className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] line-clamp-1">{cat.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Article Accordion List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold">Frequently Consulted Guides ({filteredArticles.length})</h3>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#0F766E] dark:text-[#14B8A6] font-bold hover:underline"
              >
                Clear Search
              </button>
            )}
          </div>

          <div className="space-y-3">
            {filteredArticles.map((art) => {
              const isExpanded = expandedArticle === art.title;

              return (
                <div
                  key={art.title}
                  className="rounded-2xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] overflow-hidden shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedArticle(isExpanded ? null : art.title)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold cursor-pointer hover:text-[#0F766E] dark:text-[#14B8A6]"
                  >
                    <span>{art.title}</span>
                    <ChevronDown className={`w-4 h-4 text-[#94A3B8] transition-transform ${isExpanded ? 'rotate-180 text-[#0F766E] dark:text-[#14B8A6]' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-[#4B5563] dark:text-[#CBD5E1] border-t border-[#E5E7EB] dark:border-[#1E293B] leading-relaxed">
                      {art.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Still Need Help Box */}
        <div className="p-8 rounded-3xl bg-[#172033] border border-[#1E293B] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold">Still need personalized assistance?</h4>
            <p className="text-xs text-[#94A3B8]">Our Lagos & Abuja concierge support team is online 7 days a week.</p>
          </div>

          <button
            type="button"
            onClick={() => setCurrentView('contact')}
            className="px-5 py-3 rounded-2xl bg-[#0F766E] hover:bg-[#14B8A6] text-white text-xs font-bold shadow-md cursor-pointer transition-all flex items-center space-x-2 shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Contact Support Desk</span>
          </button>
        </div>

      </section>

    </div>
  );
};
