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
  FileText
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
          SECTION 7: For Businesses
      ========================================== */}
      <section id="businesses" className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="rounded-3xl bg-[#171615] border border-[#292724] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Subtle Warm Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#10B981]/8 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs font-bold text-[#34D399] uppercase tracking-wider">
                <Users2 className="w-3.5 h-3.5" />
                <span>For Companies & Teams</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FAF8F5] tracking-tight leading-tight">
                Workspaces for Your Team
              </h2>

              <p className="text-base sm:text-lg text-[#A8A29E] leading-relaxed">
                Give your remote and hybrid staff flexible workspace access across Lagos, Abuja, and beyond. One monthly corporate invoice, zero expense receipt headaches, and guaranteed power and fiber internet.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => onBookDemo('enterprise')}
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-b from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-[#0C0B0A] font-bold text-sm shadow-[0_4px_16px_rgba(16,185,129,0.25)] transition-all cursor-pointer flex items-center justify-center space-x-2 group"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book a Team Demo</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <a
                  href="mailto:partners@ofis.ng?subject=Corporate%20Team%20Inquiry"
                  className="px-6 py-3.5 rounded-xl bg-[#0C0B0A] hover:bg-[#201E1C] border border-[#292724] text-xs font-semibold text-[#FAF8F5] transition-colors text-center flex items-center justify-center"
                >
                  partners@ofis.ng
                </a>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#0C0B0A] border border-[#292724] space-y-2 hover:border-[#10B981]/40 transition-all">
                <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                <h4 className="text-sm font-bold text-[#FAF8F5]">Guaranteed 24/7 Power</h4>
                <p className="text-xs text-[#A8A29E]">Tested generator backup so your staff never drop off client calls during public power cuts.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0C0B0A] border border-[#292724] space-y-2 hover:border-[#10B981]/40 transition-all">
                <Receipt className="w-5 h-5 text-[#10B981]" />
                <h4 className="text-sm font-bold text-[#FAF8F5]">One Monthly Invoice</h4>
                <p className="text-xs text-[#A8A29E]">Consolidate all employee workspace usage into a single, clean statement for your accounting team.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0C0B0A] border border-[#292724] space-y-2 hover:border-[#10B981]/40 transition-all">
                <Globe2 className="w-5 h-5 text-[#10B981]" />
                <h4 className="text-sm font-bold text-[#FAF8F5]">Locations Across Cities</h4>
                <p className="text-xs text-[#A8A29E]">Desks and meeting rooms in Victoria Island, Ikoyi, Lekki, Ikeja, and Abuja.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0C0B0A] border border-[#292724] space-y-2 hover:border-[#10B981]/40 transition-all">
                <Zap className="w-5 h-5 text-[#10B981]" />
                <h4 className="text-sm font-bold text-[#FAF8F5]">Simple QR Entry</h4>
                <p className="text-xs text-[#A8A29E]">Employees show an instant digital pass on their phone at the front desk and get straight to work.</p>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================
          SECTION 8: List Your Space
      ========================================== */}
      <section id="hosts" className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="rounded-3xl bg-[#171615] border border-[#292724] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 left-0 w-80 h-80 bg-[#10B981]/8 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            <div className="lg:col-span-6 order-2 lg:order-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#0C0B0A] border border-[#292724] space-y-2 hover:border-[#10B981]/40 transition-all">
                <TrendingUp className="w-5 h-5 text-[#10B981]" />
                <h4 className="text-sm font-bold text-[#FAF8F5]">Higher Occupancy</h4>
                <p className="text-xs text-[#A8A29E]">Fill empty desks, quiet meeting rooms, and off-peak hours with verified business guests.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0C0B0A] border border-[#292724] space-y-2 hover:border-[#10B981]/40 transition-all">
                <Coins className="w-5 h-5 text-[#10B981]" />
                <h4 className="text-sm font-bold text-[#FAF8F5]">Guaranteed Payouts</h4>
                <p className="text-xs text-[#A8A29E]">Weekly earnings sent straight to your bank account without chasing overdue client invoices.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0C0B0A] border border-[#292724] space-y-2 hover:border-[#10B981]/40 transition-all">
                <CalendarCheck className="w-5 h-5 text-[#10B981]" />
                <h4 className="text-sm font-bold text-[#FAF8F5]">Calendar Sync</h4>
                <p className="text-xs text-[#A8A29E]">Syncs directly with your Google Calendar or Outlook so you never get double-booked.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0C0B0A] border border-[#292724] space-y-2 hover:border-[#10B981]/40 transition-all">
                <Building2 className="w-5 h-5 text-[#10B981]" />
                <h4 className="text-sm font-bold text-[#FAF8F5]">Zero Listing Fees</h4>
                <p className="text-xs text-[#A8A29E]">Listing your venue is 100% free. You only pay a small commission when you earn from a booking.</p>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs font-bold text-[#34D399] uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>For Space Owners & Hosts</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FAF8F5] tracking-tight leading-tight">
                List Your Space
              </h2>

              <p className="text-base sm:text-lg text-[#A8A29E] leading-relaxed">
                Turn unused office desks, executive boardrooms, photo studios, or event venues into reliable income. Connect with thousands of verified professionals across Nigeria.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={onListSpace}
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-b from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-[#0C0B0A] font-bold text-sm shadow-[0_4px_16px_rgba(16,185,129,0.25)] transition-all cursor-pointer flex items-center justify-center space-x-2 group"
                >
                  <span>List Your Space</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={() => onBookDemo('operator')}
                  className="px-6 py-3.5 rounded-xl bg-[#0C0B0A] hover:bg-[#201E1C] border border-[#292724] text-xs font-semibold text-[#FAF8F5] transition-colors text-center"
                >
                  Host Onboarding Demo
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================
          SECTION 9: Partners
          CTA: Become a Partner
      ========================================== */}
      <section id="partners" className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="rounded-3xl bg-[#171615] border border-[#292724] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#10B981]/8 blur-3xl pointer-events-none" />

          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs font-bold text-[#34D399] uppercase tracking-wider mb-4">
              <Handshake className="w-3.5 h-3.5" />
              <span>Strategic Partnerships</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FAF8F5] tracking-tight mb-4">
              Partners
            </h2>
            <p className="text-base sm:text-lg text-[#A8A29E] leading-relaxed">
              We work with hotels, commercial property owners, and business accelerators to make quality workspaces easily accessible in every commercial district.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="p-6 rounded-2xl bg-[#0C0B0A] border border-[#292724] space-y-3 hover:border-[#10B981]/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 flex items-center justify-center text-[#34D399]">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#FAF8F5]">Hotels & Hospitality</h4>
              <p className="text-xs text-[#A8A29E] leading-relaxed">
                Monetize your business centers, quiet executive lounges, and daytime suites for vetted business travelers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0C0B0A] border border-[#292724] space-y-3 hover:border-[#10B981]/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 flex items-center justify-center text-[#34D399]">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#FAF8F5]">Commercial Landlords</h4>
              <p className="text-xs text-[#A8A29E] leading-relaxed">
                Transform vacant office floors into active, income-producing flexible workspaces with steady foot traffic.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0C0B0A] border border-[#292724] space-y-3 hover:border-[#10B981]/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 flex items-center justify-center text-[#34D399]">
                <Users2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#FAF8F5]">Accelerators & VCs</h4>
              <p className="text-xs text-[#A8A29E] leading-relaxed">
                Provide your portfolio founders and remote teams with workspace credits and private offsite meeting space.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onPartner}
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-b from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-[#0C0B0A] font-bold text-sm transition-all cursor-pointer shadow-[0_4px_16px_rgba(16,185,129,0.25)] group"
            >
              <span>Become a Partner</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="text-xs text-[#A8A29E] mt-3">
              Direct partnership inquiries: <a href="mailto:partners@ofis.ng" className="text-[#34D399] hover:underline font-semibold">partners@ofis.ng</a>
            </p>
          </div>

        </div>
      </section>


      {/* =========================================
          SECTION 10: Investors
          Title: Building Africa's Physical Space Infrastructure
          Buttons: Request Investor Deck, Schedule a Meeting
      ========================================== */}
      <section id="investors" className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="rounded-3xl bg-[#171615] border border-[#292724] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
          {/* Warm Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#10B981]/10 blur-[150px] rounded-3xl pointer-events-none" />

          {/* Heading and Plain-English Overview */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs font-bold text-[#34D399] uppercase tracking-wider mb-4">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Investment Opportunity</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FAF8F5] tracking-tight mb-4">
              Building Africa&apos;s Physical Space Infrastructure
            </h2>

            <p className="text-base sm:text-lg text-[#A8A29E] leading-relaxed">
              Millions of remote professionals, growing tech companies, and creators across African cities need flexible, reliable workspaces with guaranteed electricity and fast internet. OFIS provides the trusted discovery and booking platform connecting them directly with available spaces.
            </p>
          </div>

          {/* 4 Core Plain-English Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            
            {/* Pillar 1 */}
            <div className="p-5 rounded-2xl bg-[#0C0B0A] border border-[#292724] space-y-2 hover:border-[#10B981]/40 transition-all">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#10B981] block">
                01 • Market Need
              </span>
              <h3 className="text-base font-bold text-[#FAF8F5]">High Demand</h3>
              <p className="text-xs text-[#A8A29E] leading-relaxed">
                Millions of professionals and distributed teams in Lagos and Abuja need ready-to-use office spaces with guaranteed backup power every day.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-5 rounded-2xl bg-[#0C0B0A] border border-[#292724] space-y-2 hover:border-[#10B981]/40 transition-all">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#10B981] block">
                02 • Business Model
              </span>
              <h3 className="text-base font-bold text-[#FAF8F5]">Clear Revenue</h3>
              <p className="text-xs text-[#A8A29E] leading-relaxed">
                A simple service commission on every completed booking, plus monthly workspace allowances for corporate employer accounts.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-5 rounded-2xl bg-[#0C0B0A] border border-[#292724] space-y-2 hover:border-[#10B981]/40 transition-all">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#10B981] block">
                03 • Early Momentum
              </span>
              <h3 className="text-base font-bold text-[#FAF8F5]">Strong Traction</h3>
              <p className="text-xs text-[#A8A29E] leading-relaxed">
                Over 200 vetted partner spaces, tested generator backup systems, and thousands of professionals registered on our early waitlist.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-5 rounded-2xl bg-[#0C0B0A] border border-[#292724] space-y-2 hover:border-[#10B981]/40 transition-all">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#10B981] block">
                04 • Growth Plan
              </span>
              <h3 className="text-base font-bold text-[#FAF8F5]">Expansion</h3>
              <p className="text-xs text-[#A8A29E] leading-relaxed">
                Deepening presence across Lagos and Abuja, expanding to Accra and Nairobi, and adding mobile door access for registered members.
              </p>
            </div>

          </div>

          {/* Two Buttons: Request Investor Deck & Schedule a Meeting */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={onRequestDeck}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-gradient-to-b from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-[#0C0B0A] font-bold text-sm sm:text-base shadow-[0_4px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_6px_28px_rgba(16,185,129,0.4)] transition-all cursor-pointer group space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Request Investor Deck</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={onScheduleMeeting}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-[#0C0B0A] hover:bg-[#201E1C] text-[#FAF8F5] font-semibold text-sm sm:text-base border border-[#292724] hover:border-[#34D399]/40 transition-all cursor-pointer space-x-2"
            >
              <Calendar className="w-4 h-4 text-[#34D399]" />
              <span>Schedule a Meeting</span>
            </button>
          </div>

          <p className="text-center text-xs text-[#A8A29E] mt-4">
            Confidential investor inquiries: <a href="mailto:investors@ofis.ng" className="text-[#34D399] hover:underline font-semibold">investors@ofis.ng</a>
          </p>

        </div>
      </section>

    </div>
  );
};
