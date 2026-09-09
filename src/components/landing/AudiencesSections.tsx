import React from 'react';
import { 
  Building2, 
  Users2, 
  Handshake, 
  TrendingUp, 
  ArrowRight, 
  ShieldCheck, 
  Receipt, 
  Zap, 
  CalendarCheck, 
  Coins, 
  Layers, 
  Globe2,
  Calendar,
  FileText,
  Laptop,
  Mic,
  Presentation
} from 'lucide-react';

interface AudiencesSectionsProps {
  onBookDemo: (track: 'enterprise' | 'operator' | 'investor' | 'partner') => void;
  onListSpace: () => void;
  onPartner: () => void;
  onRequestDeck: () => void;
  onScheduleMeeting: () => void;
}

export const AudiencesSections: React.FC<AudiencesSectionsProps> = ({
  onBookDemo,
  onListSpace,
  onPartner,
  onRequestDeck,
  onScheduleMeeting,
}) => {
  return (
    <div className="space-y-24 sm:space-y-36">
      
      {/* =========================================
          AUDIENCE HIGHLIGHTS
      ========================================== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0F766E]/15 border border-[#0F766E]/40 text-xs font-bold text-[#14B8A6] uppercase tracking-wider mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F4A261]" />
            <span>Built For Every Professional Need</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Who Uses OFIS?
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] mt-2">
            Tailored workspace solutions for remote teams, fast-growing companies, independent founders, and media creators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-[#0B1F33] border border-[#1E3A4D] hover:border-[#0F766E]/60 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F766E]/15 text-[#14B8A6] flex items-center justify-center">
              <Laptop className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Tech Teams & Remote Workers</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Quiet desks, stable power, and fast fiber internet to stay productive every single day without generator hassle.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1F33] border border-[#1E3A4D] hover:border-[#0F766E]/60 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F766E]/15 text-[#14B8A6] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Corporate Offsites & Strategy</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              High-spec executive boardrooms with dual screens, video conferencing gear, and catering for leadership alignment.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1F33] border border-[#1E3A4D] hover:border-[#0F766E]/60 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F766E]/15 text-[#14B8A6] flex items-center justify-center">
              <Users2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Founders & Startups</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Scale up or down on demand. Move from hot desks to private team offices without locking into multi-year commercial leases.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1F33] border border-[#1E3A4D] hover:border-[#0F766E]/60 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F766E]/15 text-[#14B8A6] flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Creators & Podcasters</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Soundproofed production studios with broadcast microphones, 4K cameras, and studio lighting ready to plug and record.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1F33] border border-[#1E3A4D] hover:border-[#0F766E]/60 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F766E]/15 text-[#14B8A6] flex items-center justify-center">
              <Presentation className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Event & Workshop Organizers</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Town halls, training rooms, and multipurpose event spaces with reliable AV setups, parking, and security.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION: For Companies & Teams
      ========================================== */}
      <section id="businesses" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-[#0B1F33] border border-[#1E3A4D] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-[0_20px_50px_rgba(7,21,33,0.5)]">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#0F766E]/10 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0F766E]/15 border border-[#0F766E]/40 text-xs font-bold text-[#14B8A6] uppercase tracking-wider">
                <Users2 className="w-3.5 h-3.5" />
                <span>For Companies & Teams</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Workspaces for Your Team
              </h2>

              <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
                Give your remote and hybrid staff flexible workspace access across Lagos, Abuja, and beyond. One monthly corporate invoice, zero expense receipt headaches, and guaranteed power and fiber internet.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => onBookDemo('enterprise')}
                  className="px-7 py-3.5 rounded-xl bg-[#0F766E] hover:bg-[#0D655E] text-white font-bold text-sm shadow-[0_4px_16px_rgba(15,118,110,0.3)] transition-all cursor-pointer flex items-center justify-center space-x-2 group"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book a Team Demo</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <a
                  href="mailto:partners@ofis.ng?subject=Corporate%20Team%20Inquiry"
                  className="px-6 py-3.5 rounded-xl bg-[#071521] hover:bg-[#0B1F33] border border-[#1E3A4D] text-xs font-semibold text-white transition-colors text-center flex items-center justify-center"
                >
                  partners@ofis.ng
                </a>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#071521] border border-[#1E3A4D] space-y-2 hover:border-[#0F766E]/50 transition-all">
                <ShieldCheck className="w-5 h-5 text-[#14B8A6]" />
                <h3 className="text-sm font-bold text-white">Guaranteed 24/7 Power</h3>
                <p className="text-xs text-[#94A3B8]">Tested generator + solar backup so staff never drop off client calls during public power outages.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#071521] border border-[#1E3A4D] space-y-2 hover:border-[#0F766E]/50 transition-all">
                <Receipt className="w-5 h-5 text-[#14B8A6]" />
                <h3 className="text-sm font-bold text-white">One Monthly Invoice</h3>
                <p className="text-xs text-[#94A3B8]">Consolidate all employee workspace usage into a single, clean statement for your accounting team.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#071521] border border-[#1E3A4D] space-y-2 hover:border-[#0F766E]/50 transition-all">
                <Globe2 className="w-5 h-5 text-[#14B8A6]" />
                <h3 className="text-sm font-bold text-white">Locations Across Cities</h3>
                <p className="text-xs text-[#94A3B8]">Desks and meeting rooms in Victoria Island, Ikoyi, Lekki, Ikeja GRA, and Maitama Abuja.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#071521] border border-[#1E3A4D] space-y-2 hover:border-[#0F766E]/50 transition-all">
                <Zap className="w-5 h-5 text-[#14B8A6]" />
                <h3 className="text-sm font-bold text-white">Simple QR Entry</h3>
                <p className="text-xs text-[#94A3B8]">Employees show an instant digital pass on their phone at the front desk and get straight to work.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================
          SECTION: List Your Space (For Space Operators)
      ========================================== */}
      <section id="hosts" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-[#0B1F33] border border-[#1E3A4D] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-[0_20px_50px_rgba(7,21,33,0.5)]">
          <div className="absolute top-0 left-0 w-80 h-80 bg-[#0F766E]/10 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            <div className="lg:col-span-6 order-2 lg:order-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#071521] border border-[#1E3A4D] space-y-2 hover:border-[#0F766E]/50 transition-all">
                <TrendingUp className="w-5 h-5 text-[#14B8A6]" />
                <h3 className="text-sm font-bold text-white">Higher Occupancy</h3>
                <p className="text-xs text-[#94A3B8]">Fill empty desks, quiet meeting rooms, and off-peak hours with verified business guests.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#071521] border border-[#1E3A4D] space-y-2 hover:border-[#0F766E]/50 transition-all">
                <Coins className="w-5 h-5 text-[#14B8A6]" />
                <h3 className="text-sm font-bold text-white">Guaranteed Payouts</h3>
                <p className="text-xs text-[#94A3B8]">Weekly earnings sent straight to your bank account without chasing overdue client invoices.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#071521] border border-[#1E3A4D] space-y-2 hover:border-[#0F766E]/50 transition-all">
                <CalendarCheck className="w-5 h-5 text-[#14B8A6]" />
                <h3 className="text-sm font-bold text-white">Calendar Sync</h3>
                <p className="text-xs text-[#94A3B8]">Syncs directly with your Google Calendar or Outlook so you never get double-booked.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#071521] border border-[#1E3A4D] space-y-2 hover:border-[#0F766E]/50 transition-all">
                <Building2 className="w-5 h-5 text-[#14B8A6]" />
                <h3 className="text-sm font-bold text-white">Zero Listing Fees</h3>
                <p className="text-xs text-[#94A3B8]">Listing your venue is 100% free. You only pay a small commission when you earn from a booking.</p>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0F766E]/15 border border-[#0F766E]/40 text-xs font-bold text-[#14B8A6] uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>For Space Operators & Landlords</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                List Your Space
              </h2>

              <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
                Monetize unbooked desks, boardrooms, podcast studios, and event venues. Reach thousands of verified professionals and teams across Nigeria.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={onListSpace}
                  className="px-7 py-3.5 rounded-xl bg-[#0F766E] hover:bg-[#0D655E] text-white font-bold text-sm shadow-[0_4px_16px_rgba(15,118,110,0.3)] transition-all cursor-pointer flex items-center justify-center space-x-2 group"
                >
                  <span>List Your Space</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={() => onBookDemo('operator')}
                  className="px-6 py-3.5 rounded-xl bg-[#071521] hover:bg-[#0B1F33] border border-[#1E3A4D] text-xs font-semibold text-white transition-colors text-center cursor-pointer"
                >
                  Host Onboarding Demo
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================
          SECTION: Strategic Partners
      ========================================== */}
      <section id="partners" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-[#0B1F33] border border-[#1E3A4D] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-[0_20px_50px_rgba(7,21,33,0.5)]">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#0F766E]/10 blur-3xl pointer-events-none" />

          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0F766E]/15 border border-[#0F766E]/40 text-xs font-bold text-[#14B8A6] uppercase tracking-wider mb-4">
              <Handshake className="w-3.5 h-3.5" />
              <span>Strategic Partnerships</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
              Partners
            </h2>
            <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
              We collaborate with hotels, corporate property developers, and business networks to make high-standard workspaces available across all major commercial hubs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="p-6 rounded-2xl bg-[#071521] border border-[#1E3A4D] space-y-3 hover:border-[#0F766E]/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#0F766E]/15 flex items-center justify-center text-[#14B8A6]">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Hotels & Hospitality</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Monetize your business lounges, executive meeting suites, and daytime workspaces for vetted corporate guests.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#071521] border border-[#1E3A4D] space-y-3 hover:border-[#0F766E]/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#0F766E]/15 flex items-center justify-center text-[#14B8A6]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Commercial Landlords</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Transform underutilized office floors into active, income-producing flexible workspaces with high-quality demand.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#071521] border border-[#1E3A4D] space-y-3 hover:border-[#0F766E]/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#0F766E]/15 flex items-center justify-center text-[#14B8A6]">
                <Users2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Accelerators & VCs</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Equip portfolio founders and remote engineering teams with workspace credits and private offsite spaces.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onPartner}
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-[#0F766E] hover:bg-[#0D655E] text-white font-bold text-sm transition-all cursor-pointer shadow-[0_4px_16px_rgba(15,118,110,0.3)] group"
            >
              <span>Become a Partner</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="text-xs text-[#94A3B8] mt-3">
              Direct partnership inquiries: <a href="mailto:partners@ofis.ng" className="text-[#14B8A6] hover:underline font-semibold">partners@ofis.ng</a>
            </p>
          </div>

        </div>
      </section>

      {/* =========================================
          SECTION: Investors
      ========================================== */}
      <section id="investors" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-[#0B1F33] border border-[#1E3A4D] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-[0_25px_60px_rgba(7,21,33,0.6)]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#0F766E]/10 blur-[150px] rounded-3xl pointer-events-none" />

          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0F766E]/15 border border-[#0F766E]/40 text-xs font-bold text-[#14B8A6] uppercase tracking-wider mb-4">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Investment Opportunity</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
              Building Africa&apos;s Physical Space Infrastructure
            </h2>

            <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
              Millions of remote professionals, growing tech companies, and creators across African cities need flexible, reliable workspaces with guaranteed electricity and fast internet. OFIS provides the trusted discovery and booking network.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <div className="p-5 rounded-2xl bg-[#071521] border border-[#1E3A4D] space-y-2 hover:border-[#0F766E]/50 transition-all">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#14B8A6] block">
                01 • Market Need
              </span>
              <h3 className="text-base font-bold text-white">High Demand</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Millions of professionals and distributed teams in Lagos and Abuja need ready-to-use office spaces with guaranteed backup power every day.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#071521] border border-[#1E3A4D] space-y-2 hover:border-[#0F766E]/50 transition-all">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#14B8A6] block">
                02 • Business Model
              </span>
              <h3 className="text-base font-bold text-white">Clear Revenue</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                A simple service commission on every completed booking, plus monthly workspace allowances for corporate employer accounts.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#071521] border border-[#1E3A4D] space-y-2 hover:border-[#0F766E]/50 transition-all">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#14B8A6] block">
                03 • Early Momentum
              </span>
              <h3 className="text-base font-bold text-white">Strong Traction</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Vetted partner spaces, tested power systems, and verified professionals registered across Nigeria.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#071521] border border-[#1E3A4D] space-y-2 hover:border-[#0F766E]/50 transition-all">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#14B8A6] block">
                04 • Expansion
              </span>
              <h3 className="text-base font-bold text-white">Regional Scale</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Deepening presence across Lagos, Abuja, Port Harcourt, and Ibadan, followed by regional tech hubs.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={onRequestDeck}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-[#0F766E] hover:bg-[#0D655E] text-white font-bold text-sm sm:text-base shadow-[0_4px_20px_rgba(15,118,110,0.3)] transition-all cursor-pointer group space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Request Investor Deck</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={onScheduleMeeting}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-[#071521] hover:bg-[#0B1F33] text-white font-semibold text-sm sm:text-base border border-[#1E3A4D] hover:border-[#14B8A6]/40 transition-all cursor-pointer space-x-2"
            >
              <Calendar className="w-4 h-4 text-[#14B8A6]" />
              <span>Schedule a Meeting</span>
            </button>
          </div>

          <p className="text-center text-xs text-[#94A3B8] mt-4">
            Confidential investor inquiries: <a href="mailto:investors@ofis.ng" className="text-[#14B8A6] hover:underline font-semibold">investors@ofis.ng</a>
          </p>

        </div>
      </section>

    </div>
  );
};
