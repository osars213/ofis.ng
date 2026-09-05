import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Wifi, 
  Zap, 
  Sparkles,
  QrCode,
  CheckCircle2,
  Calendar,
  Clock,
  Building2,
  Users,
  Video,
  Mic,
  Copy,
  Check
} from 'lucide-react';

interface MarketplaceScreenshotProps {
  onExploreClick?: () => void;
  onBookDemoClick?: () => void;
}

interface DemoListing {
  id: string;
  name: string;
  category: 'work' | 'meet' | 'create' | 'record';
  categoryLabel: string;
  city: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  badge: string;
  badgeIcon: 'sla' | 'wifi' | 'sound' | 'mic';
  price: number;
  unit: string;
  description: string;
  amenities: string[];
}

const DEMO_LISTINGS: DemoListing[] = [
  {
    id: 'atrium-vi',
    name: 'The Atrium Executive Workspace',
    category: 'work',
    categoryLabel: 'Executive Desk & Suite',
    city: 'Lagos',
    location: 'Victoria Island, Lagos',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80',
    rating: 4.98,
    reviews: 64,
    badge: '24/7 Generator Backup',
    badgeIcon: 'sla',
    price: 8500,
    unit: 'day',
    description: 'Ergonomic seating, solar generator backup, quiet phone booths, and free coffee.',
    amenities: ['Fiber Internet', 'Espresso Bar', 'Solar Backup', 'Phone Pods']
  },
  {
    id: 'capital-boardroom',
    name: 'Capital Boardroom',
    category: 'meet',
    categoryLabel: 'Executive Boardroom',
    city: 'Abuja',
    location: 'Maitama, Abuja',
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&auto=format&fit=crop&q=80',
    rating: 4.96,
    reviews: 51,
    badge: 'Dual Starlink + Fiber',
    badgeIcon: 'wifi',
    price: 25000,
    unit: 'hr',
    description: '4K dual-screen video conferencing, 16 executive leather seats, digital whiteboards.',
    amenities: ['Dual Starlink', '4K Video Bar', 'Acoustic Glass', 'Tea/Coffee']
  },
  {
    id: 'lekki-soundstage',
    name: 'Lekki Soundstage',
    category: 'create',
    categoryLabel: 'Photo & Video Studio',
    city: 'Lagos',
    location: 'Lekki Phase 1, Lagos',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviews: 38,
    badge: 'Professional Studio Lights',
    badgeIcon: 'sound',
    price: 35000,
    unit: 'hr',
    description: 'Quiet cyclorama stage with overhead lighting grid, air-conditioned makeup room, and changing room.',
    amenities: ['Cyclorama Wall', 'Heavy AC Power', 'Sound Isolating', 'Green Room']
  },
  {
    id: 'podcast-studio',
    name: 'Podcast Studio',
    category: 'record',
    categoryLabel: 'Audio & Video Podcast Studio',
    city: 'Lagos',
    location: 'Ikoyi, Lagos',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
    rating: 4.95,
    reviews: 42,
    badge: '4x Shure Microphones',
    badgeIcon: 'mic',
    price: 18000,
    unit: 'hr',
    description: 'Sound-dampened 4-person studio with broadcast microphones, 4K camera angles, and headphone monitors.',
    amenities: ['4x Shure SM7B', 'Blackmagic 4K', 'Sound Dampening', 'Engineer Ready']
  }
];

export const MarketplaceScreenshot: React.FC<MarketplaceScreenshotProps> = ({ 
  onExploreClick 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'work' | 'meet' | 'create' | 'record'>('all');
  const [activeSpaceId, setActiveSpaceId] = useState<string>('atrium-vi');
  const [selectedPassTime, setSelectedPassTime] = useState<'full' | 'half'>('full');
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  const filteredSpaces = selectedCategory === 'all' 
    ? DEMO_LISTINGS 
    : DEMO_LISTINGS.filter(s => s.category === selectedCategory);

  const activeSpace = DEMO_LISTINGS.find(s => s.id === activeSpaceId) || DEMO_LISTINGS[0];

  const calculatedTotal = selectedPassTime === 'full' 
    ? activeSpace.price 
    : Math.round(activeSpace.price * 0.65);

  const handleSimulateBooking = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCheckoutSuccess(true);
  };

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText('OFIS-PASS-88421');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="demo-marketplace" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="sr-only">Interactive Live Space Preview and Instant Booking</h2>
      
      {/* Outer Glow & Warm Elevation Container with Refined Glassmorphism */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#171615]/80 backdrop-blur-2xl border border-white/10 hover:border-[#10B981]/50 p-3 sm:p-5 lg:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.7),0_0_40px_rgba(16,185,129,0.12),inset_0_1px_1px_rgba(255,255,255,0.08)] transition-all duration-300 overflow-hidden">
        
        {/* Soft Warm Radial Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[320px] bg-[#10B981]/15 blur-[130px] rounded-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[450px] h-[250px] bg-[#34D399]/8 blur-[110px] rounded-3xl pointer-events-none" />
        
        {/* Browser / App Frame Bar */}
        <div className="flex items-center justify-between px-3 py-2.5 sm:px-5 sm:py-3.5 border-b border-[#292724] mb-4 sm:mb-6 bg-[#0C0B0A]/90 backdrop-blur-md rounded-t-xl sm:rounded-t-2xl">
          {/* Traffic Lights */}
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          {/* URL Bar */}
          <div className="flex items-center space-x-2 px-4 py-1.5 rounded-xl bg-[#171615]/80 border border-white/10 text-xs text-[#A8A29E] max-w-xs sm:max-w-sm w-full justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <Lock className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="font-mono text-[#FAF8F5]/95 font-medium">ofis.ng/explore</span>
          </div>

          {/* Live Marketplace Indicator */}
          <div className="flex items-center space-x-2 text-xs font-bold text-[#34D399]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
            </span>
            <span className="hidden sm:inline font-mono uppercase tracking-wider text-[11px]">Live Demo Marketplace</span>
          </div>
        </div>

        {/* Realistic Marketplace Interface */}
        <div className="bg-[#0C0B0A]/85 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/[0.07] p-4 sm:p-6 lg:p-8">
          
          {/* Top Search & Filter Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-6 border-b border-[#292724]">
            {/* Search Pill */}
            <div className="flex-1 flex items-center space-x-3 px-4 sm:px-5 py-3 rounded-xl bg-[#171615]/70 backdrop-blur-md border border-white/[0.08] text-xs text-[#A8A29E] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <Search className="w-4 h-4 text-[#10B981] shrink-0" />
              <span className="text-[#FAF8F5] font-medium truncate">Nigeria • Lagos & Abuja</span>
              <span className="text-[#A8A29E]">•</span>
              <span className="text-[#A8A29E] truncate hidden sm:inline">Desks, Studios, Boardrooms</span>
              <span className="text-[#A8A29E] hidden sm:inline">•</span>
              <span className="text-[#34D399] font-medium truncate hidden md:inline">Instant Check-in</span>
            </div>

            {/* Category Filter Pills (Work • Meet • Create • Record) */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {[
                { id: 'all', label: 'All Spaces' },
                { id: 'work', label: 'Work', icon: Building2 },
                { id: 'meet', label: 'Meet', icon: Users },
                { id: 'create', label: 'Create', icon: Video },
                { id: 'record', label: 'Record', icon: Mic },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-3.5 py-2 rounded-xl font-semibold transition-all duration-200 cursor-pointer flex items-center space-x-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-b from-[#34D399] via-[#10B981] to-[#059669] text-[#0C0B0A] font-bold shadow-[0_2px_14px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.6)] border border-white/20'
                      : 'bg-[#171615]/75 text-[#A8A29E] backdrop-blur-md border border-white/[0.08] hover:border-[#10B981]/40 hover:text-[#FAF8F5]'
                  }`}
                >
                  {cat.icon && <cat.icon className="w-3.5 h-3.5" />}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cards Showcase Grid (4 realistic spaces) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-6">
            {filteredSpaces.map((space) => {
              const isSelected = space.id === activeSpaceId;

              return (
                <div 
                  key={space.id}
                  onClick={() => {
                    setActiveSpaceId(space.id);
                    setShowCheckoutSuccess(false);
                  }}
                  className={`rounded-2xl bg-[#171615]/80 backdrop-blur-xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between group/card ${
                    isSelected 
                      ? 'border-[#10B981] shadow-[0_0_28px_rgba(16,185,129,0.25),inset_0_1px_1px_rgba(255,255,255,0.12)] ring-1 ring-[#10B981]' 
                      : 'border-white/[0.08] hover:border-[#10B981]/50 shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4),0_0_20px_rgba(16,185,129,0.12)]'
                  }`}
                >
                  <div>
                    {/* Space Image & Overlay */}
                    <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-stone-900">
                      <img 
                        src={space.image} 
                        alt={space.name}
                        loading={isSelected ? 'eager' : 'lazy'}
                        fetchPriority={isSelected ? 'high' : 'auto'}
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0A] via-transparent to-transparent" />
                      
                      {/* Feature Badge */}
                      <div className="absolute top-3 left-3 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#0C0B0A]/85 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-[#34D399]">
                        {space.badgeIcon === 'sla' && <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />}
                        {space.badgeIcon === 'wifi' && <Wifi className="w-3.5 h-3.5 text-[#10B981]" />}
                        {space.badgeIcon === 'sound' && <Zap className="w-3.5 h-3.5 text-[#10B981]" />}
                        {space.badgeIcon === 'mic' && <Mic className="w-3.5 h-3.5 text-[#10B981]" />}
                        <span>{space.badge}</span>
                      </div>

                      {/* Rating */}
                      <div className="absolute bottom-3 left-3 flex items-center space-x-1 text-xs text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{space.rating}</span>
                        <span className="text-[#A8A29E] font-normal">({space.reviews})</span>
                      </div>

                      {isSelected && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#10B981] text-[#0C0B0A] font-extrabold text-[10px] uppercase tracking-wider">
                          Selected
                        </div>
                      )}
                    </div>

                    {/* Space Details */}
                    <div className="p-4 space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E]">
                        {space.categoryLabel}
                      </div>
                      <h3 className="text-sm font-bold text-[#FAF8F5] line-clamp-1 group-hover/card:text-[#34D399] transition-colors">
                        {space.name}
                      </h3>
                      <div className="flex items-center text-xs text-[#A8A29E]">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-[#10B981] shrink-0" />
                        <span className="truncate">{space.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action Footer */}
                  <div className="p-4 pt-2 border-t border-[#292724] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-extrabold text-[#FAF8F5] text-sm">
                        ₦{space.price.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-normal text-[#A8A29E] ml-1">
                        /{space.unit}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-[#10B981] group-hover/card:text-[#34D399]">
                      View Details →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Live Checkout & QR Check-in Simulator */}
          <div className="mt-8 rounded-2xl bg-[#171615] border border-[#10B981]/30 p-4 sm:p-6 lg:p-7">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-[#10B981]/15 text-[#34D399] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Try It Out</span>
                </div>
                <h3 className="text-xl font-bold text-[#FAF8F5]">
                  Test a Sample Booking: <span className="text-[#34D399]">{activeSpace.name}</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#A8A29E]">
                  Choose between a full-day pass or half-day reservation, calculate your cost, and preview the instant digital pass you receive on your phone.
                </p>
              </div>

              {/* Booking Controls */}
              <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex rounded-xl bg-[#0C0B0A] p-1 border border-[#292724] text-xs">
                  <button
                    type="button"
                    onClick={() => { setSelectedPassTime('full'); setShowCheckoutSuccess(false); }}
                    className={`px-3.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                      selectedPassTime === 'full' 
                        ? 'bg-[#10B981] text-[#0C0B0A]' 
                        : 'text-[#A8A29E] hover:text-[#FAF8F5]'
                    }`}
                  >
                    Full Day Pass
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedPassTime('half'); setShowCheckoutSuccess(false); }}
                    className={`px-3.5 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                      selectedPassTime === 'half' 
                        ? 'bg-[#10B981] text-[#0C0B0A]' 
                        : 'text-[#A8A29E] hover:text-[#FAF8F5]'
                    }`}
                  >
                    Half Day Pass
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSimulateBooking}
                  className="relative overflow-hidden px-6 py-2.5 rounded-xl bg-gradient-to-b from-[#34D399] via-[#10B981] to-[#059669] hover:from-[#10B981] hover:to-[#047857] text-[#0C0B0A] font-extrabold text-xs sm:text-sm shadow-[0_4px_16px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.6)] border border-white/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/20 pointer-events-none" />
                  <QrCode className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Preview Booking Pass (₦{calculatedTotal.toLocaleString()})</span>
                </button>
              </div>

            </div>

            {/* Generated QR Pass Preview */}
            {showCheckoutSuccess && (
              <div className="mt-6 pt-6 border-t border-white/10 animate-fade-in bg-[#0C0B0A]/90 backdrop-blur-xl rounded-xl p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_25px_rgba(16,185,129,0.15)] border border-white/[0.08]">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-white p-2 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <QrCode className="w-16 h-16 text-black" />
                  </div>
                  <div className="space-y-1">
                    <div className="inline-flex items-center space-x-1.5 text-xs text-[#34D399] font-bold">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      <span>Your Digital Pass is Ready</span>
                    </div>
                    <h4 className="text-base font-bold text-[#FAF8F5]">
                      {activeSpace.name} • {activeSpace.location}
                    </h4>
                    <p className="text-xs text-[#A8A29E]">
                      Valid Today • Booking Code: <span className="font-mono text-[#FAF8F5] font-semibold">OFIS-PASS-88421</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-[#171615]/80 backdrop-blur-md border border-white/10 hover:border-[#10B981] text-xs font-semibold text-[#FAF8F5] flex items-center justify-center space-x-1.5 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Code Copied' : 'Copy Booking Code'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={onExploreClick}
                    className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-b from-[#34D399] to-[#10B981] text-[#0C0B0A] font-extrabold text-xs hover:from-[#10B981] hover:to-[#059669] shadow-[0_2px_12px_rgba(16,185,129,0.3),inset_0_1px_1px_rgba(255,255,255,0.5)] transition-all cursor-pointer"
                  >
                    Open Live App →
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Bottom CTA with Refined Emerald Glow & Glassmorphic Highlights */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={onExploreClick}
            className="relative group overflow-hidden w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-gradient-to-b from-[#34D399] via-[#10B981] to-[#059669] hover:from-[#10B981] hover:to-[#047857] text-[#0C0B0A] font-extrabold text-sm sm:text-base shadow-[0_4px_25px_rgba(16,185,129,0.35),0_0_30px_rgba(16,185,129,0.2),inset_0_1px_1px_rgba(255,255,255,0.6)] hover:shadow-[0_6px_35px_rgba(16,185,129,0.5),0_0_40px_rgba(16,185,129,0.35),inset_0_1px_2px_rgba(255,255,255,0.8)] border border-white/20 active:scale-[0.98] transition-all duration-300 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/20 pointer-events-none" />
            <span className="relative z-10 flex items-center">
              <span>Try the Live Demo Marketplace</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>

      </div>

    </section>
  );
};
