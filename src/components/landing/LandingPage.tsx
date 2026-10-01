import React, { useState } from 'react';
import { 
  Compass, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Wifi, 
  Building2, 
  Users, 
  Calendar,
  CheckCircle2, 
  CreditCard,
  Tag,
  Headphones,
  Search,
  QrCode,
  Menu,
  X
} from 'lucide-react';
import { OFISWordmark } from '../OFISWordmark';
import { TrustedLogos } from './TrustedLogos';
import { ResponsiveLandingVideo } from './ResponsiveLandingVideo';
import { MarketplaceScreenshot } from './MarketplaceScreenshot';
import { FeaturedSpacesSection } from './FeaturedSpacesSection';
import { AudiencesSections } from './AudiencesSections';
import { PreLaunchSignupForm } from './PreLaunchSignupForm';
import { ContactSection } from './ContactSection';
import { BookDemoModal } from './BookDemoModal';
import { EarlyAccessModal } from './EarlyAccessModal';
import { InvestorDeckModal } from './InvestorDeckModal';
import { AboutModal } from './SimpleModals';

interface LandingPageProps {
  onEnterApp?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  // Navigation & Modals State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoTrack, setDemoTrack] = useState<'enterprise' | 'operator' | 'investor' | 'partner'>('enterprise');
  const [isEarlyAccessModalOpen, setIsEarlyAccessModalOpen] = useState(false);
  const [earlyAccessInterest, setEarlyAccessInterest] = useState<'Early Access' | 'Space Operator' | 'Strategic Partnership' | 'Investment' | 'Other'>('Early Access');
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const handleEnterMarketplace = () => {
    if (onEnterApp) {
      onEnterApp();
    } else {
      const url = new URL(window.location.href);
      url.searchParams.set('app', 'true');
      window.history.pushState({}, '', url.pathname + '?' + url.searchParams.toString());
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenDemo = (track: 'enterprise' | 'operator' | 'investor' | 'partner' = 'enterprise') => {
    setDemoTrack(track);
    setIsDemoModalOpen(true);
  };

  const handleOpenEarlyAccess = (interest: 'Early Access' | 'Space Operator' | 'Strategic Partnership' | 'Investment' | 'Other' = 'Early Access') => {
    setEarlyAccessInterest(interest);
    setIsEarlyAccessModalOpen(true);
  };

  const scrollToWaitlist = () => {
    const el = document.getElementById('waitlist-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      handleOpenEarlyAccess('Early Access');
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#07383D] text-[#FFFFFF] font-sans selection:bg-[#14BEB8] selection:text-white relative overflow-x-hidden">
      
      {/* Ambient Architectural Lighting Gradients with Subtle Teal Luminescence */}
      <div className="fixed top-0 left-1/4 w-[900px] h-[520px] bg-gradient-to-br from-[#006B70]/30 via-[#14BEB8]/20 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="fixed top-1/4 right-0 w-[640px] h-[640px] bg-gradient-to-bl from-[#006B70]/25 via-[#14BEB8]/15 to-transparent blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-1/3 w-[700px] h-[350px] bg-gradient-to-t from-[#28D2CB]/20 via-[#006B70]/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* ========================================================
          Top Navigation Bar
         ======================================================== */}
      <header className="sticky top-0 z-50 bg-[#07383D]/95 backdrop-blur-xl border-b border-[#166D74]/70 transition-colors">
        {/* Radiant OFIS Brand Accent Line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-[#006B70] via-[#14BEB8] to-[#006B70]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center cursor-pointer transition-opacity hover:opacity-90 py-1"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <OFISWordmark size="lg" />
          </div>

          {/* Navigation Items (Contact, Launching Soon, Join Early Access) */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('contact-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs sm:text-sm font-semibold text-[#B8D1D0] hover:text-white transition-colors cursor-pointer"
            >
              Contact
            </button>

            <div className="hidden sm:inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#006B70]/30 border border-[#14BEB8]/30 text-xs font-semibold text-[#28D2CB]">
              <span>Launching Soon</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#14BEB8] animate-ping" />
            </div>

            <button
              type="button"
              onClick={scrollToWaitlist}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0B4A50] hover:bg-[#105A60] border border-[#166D74] hover:border-[#14BEB8]/60 transition-all cursor-pointer shadow-sm active:scale-98"
            >
              Join Early Access
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          HERO SECTION
         ======================================================== */}
      <section className="relative pt-12 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          
          {/* Master Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            Work. Meet. Create. Record.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-[#B8D1D0] max-w-3xl mx-auto font-normal leading-relaxed">
            Book verified desks, private offices, boardrooms, and production studios across Nigeria in minutes with guaranteed power and high-speed internet.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              type="button"
              id="hero-explore-btn"
              onClick={handleEnterMarketplace}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#006B70] via-[#14BEB8] to-[#0EA8A2] hover:shadow-[0_0_30px_rgba(20,190,184,0.45)] text-white text-base font-bold transition-all duration-200 flex items-center justify-center space-x-3 cursor-pointer shadow-lg active:scale-98"
            >
              <Compass className="w-5 h-5" />
              <span>Explore Spaces</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenDemo('enterprise')}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#0B4A50]/90 hover:bg-[#105A60] text-[#F8FAFC] border border-[#166D74] hover:border-[#14BEB8]/50 text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2.5 cursor-pointer shadow-sm active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-[#28D2CB]" />
              <span>Book a Demo</span>
            </button>
          </div>

          {/* Key Trust Highlights (4 Pills) */}
          <div className="pt-6 sm:pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0B4A50]/80 border border-[#166D74] hover:border-[#14BEB8]/60 backdrop-blur-md transition-all flex items-center space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-[#14BEB8] shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-white">Inspected Spaces</span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0B4A50]/80 border border-[#166D74] hover:border-[#28D2CB]/60 backdrop-blur-md transition-all flex items-center space-x-2.5">
              <Zap className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-white">Guaranteed 24/7 Power</span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0B4A50]/80 border border-[#166D74] hover:border-[#14BEB8]/60 backdrop-blur-md transition-all flex items-center space-x-2.5">
              <CreditCard className="w-4 h-4 text-[#28D2CB] shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-white">Simple Online Payment</span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0B4A50]/80 border border-[#166D74] hover:border-[#28D2CB]/60 backdrop-blur-md transition-all flex items-center space-x-2.5">
              <Calendar className="w-4 h-4 text-[#14BEB8] shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-white">Instant Booking</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION: Interactive Live Space Preview & Instant Booking
         ======================================================== */}
      <div id="marketplace-preview">
        <MarketplaceScreenshot 
          onExploreClick={handleEnterMarketplace}
          onBookDemoClick={() => handleOpenDemo('enterprise')}
        />
      </div>

      {/* ========================================================
          SECTION: Verified Space Showcase
         ======================================================== */}
      <ResponsiveLandingVideo 
        onExploreClick={handleEnterMarketplace}
        onBookDemoClick={() => handleOpenDemo('enterprise')}
      />

      {/* ========================================================
          SECTION: Spaces Built for Every Need
         ======================================================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Spaces Built for Every Need
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] mt-3">
            Explore dedicated environments designed for focused productivity, team collaboration, and creative production.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#0B4A50] border border-[#166D74] hover:border-[#14BEB8]/60 transition-all space-y-3">
            <div className="text-3xl" role="img" aria-label="Work">🏢</div>
            <h3 className="text-lg font-bold text-white">Work</h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Book hot desks, dedicated desks, and private offices for you and your team.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B4A50] border border-[#166D74] hover:border-[#14BEB8]/60 transition-all space-y-3">
            <div className="text-3xl" role="img" aria-label="Meet">🤝</div>
            <h3 className="text-lg font-bold text-white">Meet</h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Reserve conference rooms and boardrooms with screens, projectors, and fast internet.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B4A50] border border-[#166D74] hover:border-[#14BEB8]/60 transition-all space-y-3">
            <div className="text-3xl" role="img" aria-label="Create">🎥</div>
            <h3 className="text-lg font-bold text-white">Create</h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Find ready-to-use photography and video production studios for your creative shoots.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B4A50] border border-[#166D74] hover:border-[#14BEB8]/60 transition-all space-y-3">
            <div className="text-3xl" role="img" aria-label="Record">🎙</div>
            <h3 className="text-lg font-bold text-white">Record</h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Book soundproof podcast booths and audio recording suites with professional microphones.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION: How OFIS Works
         ======================================================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#166D74]/40">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            How OFIS Works
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] mt-3">
            Three simple steps to start working in any space.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="p-7 rounded-2xl bg-[#0B4A50] border border-[#166D74] hover:border-[#14BEB8]/60 transition-all space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-[#006B70]/30 border border-[#14BEB8]/30 text-xs font-mono font-bold text-[#28D2CB]">
              Step 01
            </div>
            <h3 className="text-xl font-bold text-white">Search</h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Browse verified spaces in Victoria Island, Lekki, Ikeja, Abuja, and more. Filter by location, budget, or space type.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-[#0B4A50] border border-[#166D74] hover:border-[#14BEB8]/60 transition-all space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-[#006B70]/30 border border-[#14BEB8]/30 text-xs font-mono font-bold text-[#28D2CB]">
              Step 02
            </div>
            <h3 className="text-xl font-bold text-white">Book</h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Choose your hours or day pass, check live availability, and pay securely using your card or bank transfer.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-[#0B4A50] border border-[#166D74] hover:border-[#14BEB8]/60 transition-all space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-[#006B70]/30 border border-[#14BEB8]/30 text-xs font-mono font-bold text-[#28D2CB]">
              Step 03
            </div>
            <h3 className="text-xl font-bold text-white">Show Up</h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              You receive an instant digital QR pass on your phone. Show it at the front desk and get straight to work.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION: Why OFIS
         ======================================================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#166D74]/40">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Why OFIS
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] mt-3">
            Built specifically for the day-to-day needs of professionals and growing businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0B4A50] border border-[#166D74] hover:border-[#14BEB8]/60 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#006B70]/30 border border-[#14BEB8]/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#14BEB8]" />
            </div>
            <h3 className="text-base font-bold text-white">Verified Spaces</h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Inspected for quiet comfort &amp; working AC
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B4A50] border border-[#166D74] hover:border-[#14BEB8]/60 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#006B70]/30 border border-[#14BEB8]/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <h3 className="text-base font-bold text-white">Guaranteed 24/7 Power</h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Tested generators &amp; stable fiber Wi-Fi
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B4A50] border border-[#166D74] hover:border-[#14BEB8]/60 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#006B70]/30 border border-[#14BEB8]/30 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-[#28D2CB]" />
            </div>
            <h3 className="text-base font-bold text-white">Secure Payments</h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Pay with debit card or direct transfer
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B4A50] border border-[#166D74] hover:border-[#14BEB8]/60 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#006B70]/30 border border-[#14BEB8]/30 flex items-center justify-center">
              <Tag className="w-5 h-5 text-[#28D2CB]" />
            </div>
            <h3 className="text-base font-bold text-white">Transparent Pricing</h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Clear hourly, daily, or monthly rates
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B4A50] border border-[#166D74] hover:border-[#14BEB8]/60 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#006B70]/30 border border-[#14BEB8]/30 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[#14BEB8]" />
            </div>
            <h3 className="text-base font-bold text-white">Instant Confirmation</h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Book immediately without waiting for replies
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B4A50] border border-[#166D74] hover:border-[#14BEB8]/60 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#006B70]/30 border border-[#14BEB8]/30 flex items-center justify-center">
              <Headphones className="w-5 h-5 text-[#28D2CB]" />
            </div>
            <h3 className="text-base font-bold text-white">Dedicated Support</h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Fast local assistance via WhatsApp and phone
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION: The OFIS Verified Standard - Featured Spaces
         ======================================================== */}
      <FeaturedSpacesSection onExploreClick={handleEnterMarketplace} />

      {/* ========================================================
          SECTION: Who Uses OFIS? & Audience Solutions
         ======================================================== */}
      <div id="audiences-section" className="py-12 border-t border-[#166D74]/40">
        <AudiencesSections
          onBookDemo={handleOpenDemo}
          onListSpace={() => handleOpenEarlyAccess('Space Operator')}
          onPartner={() => handleOpenEarlyAccess('Strategic Partnership')}
          onRequestDeck={() => setIsDeckModalOpen(true)}
          onScheduleMeeting={() => handleOpenDemo('investor')}
        />
      </div>

      {/* ========================================================
          SECTION: Trusted by Top Operators
         ======================================================== */}
      <TrustedLogos />

      {/* ========================================================
          SECTION: Pre-Launch Signup • Phase 1 Priority
         ======================================================== */}
      <section id="waitlist-section" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#14BEB8]/15 border border-[#14BEB8]/30 text-xs font-bold text-[#14BEB8] uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#28D2CB]" />
            <span>Pre-Launch Signup • Phase 1 Priority</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Reserve Your Priority Access
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl mx-auto mt-2">
            Join founders, creators, and teams across Lagos, Abuja, and Port Harcourt getting early bookings and launch credits on OFIS.
          </p>
        </div>

        <PreLaunchSignupForm variant="card" />
      </section>

      {/* ========================================================
          SECTION: Get in Touch / Contact OFIS
         ======================================================== */}
      <div id="contact-section">
        <ContactSection />
      </div>

      {/* ========================================================
          SECTION: Pre-Footer CTA Banner
         ======================================================== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="rounded-3xl bg-[#0B4A50] border border-[#166D74] p-8 sm:p-14 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[500px] h-[250px] bg-[#006B70]/20 blur-[100px] rounded-full pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight relative z-10">
            Ready to find your next workspace?
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl mx-auto mt-3 mb-8 relative z-10">
            Enjoy reliable, fully equipped spaces with uninterrupted power, high-speed fiber, and instant online booking.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <button
              type="button"
              onClick={handleEnterMarketplace}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#006B70] via-[#14BEB8] to-[#0EA8A2] hover:shadow-[0_0_24px_rgba(20,190,184,0.5)] text-white text-sm font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md active:scale-98"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Spaces</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenDemo('enterprise')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#07383D] hover:bg-[#105A60] text-white border border-[#166D74] text-sm font-semibold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-[#28D2CB]" />
              <span>Book a Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          LANDING PAGE FOOTER
         ======================================================== */}
      <footer className="border-t border-[#166D74] bg-[#07383D] text-[#94A3B8] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="space-y-4">
            <OFISWordmark size="lg" />
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Discover, book, and manage flexible workspaces, boardrooms, and creative studios across Nigeria with guaranteed power and internet.
            </p>
            <p className="text-xs font-mono text-[#64748B]">
              Victoria Island, Lagos, Nigeria
            </p>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  type="button" 
                  onClick={handleEnterMarketplace}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Explore Spaces
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleOpenEarlyAccess('Space Operator')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  List Your Space
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleOpenDemo('enterprise')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  For Businesses
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleOpenDemo('enterprise')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Book a Team Demo
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  type="button" 
                  onClick={() => setIsAboutModalOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About OFIS
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleOpenEarlyAccess('Strategic Partnership')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Partners
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleOpenDemo('investor')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Investors
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => setIsDeckModalOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Investor Deck
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider mb-4">
              Contact &amp; Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="mailto:hello@ofis.ng" className="hover:text-white transition-colors">
                  hello@ofis.ng
                </a>
              </li>
              <li>
                <a href="mailto:partners@ofis.ng" className="hover:text-white transition-colors">
                  partners@ofis.ng
                </a>
              </li>
              <li>
                <a href="mailto:investors@ofis.ng" className="hover:text-white transition-colors">
                  investors@ofis.ng
                </a>
              </li>
              <li className="pt-2">
                <button 
                  type="button"
                  onClick={() => setIsAboutModalOpen(true)}
                  className="text-xs text-[#64748B] hover:text-[#94A3B8] transition-colors"
                >
                  Terms &amp; Privacy Policy
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#166D74]/50 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B]">
          <p>© 2026 OFIS Technologies Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0 font-medium text-[#94A3B8]">
            <span>Inspected Spaces</span>
            <span>•</span>
            <span>Guaranteed Backup Power</span>
            <span>•</span>
            <span>Lagos &amp; Abuja, Nigeria</span>
          </div>
        </div>
      </footer>

      {/* ========================================================
          MODALS
         ======================================================== */}
      <BookDemoModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
        defaultTrack={demoTrack}
      />

      <EarlyAccessModal 
        isOpen={isEarlyAccessModalOpen} 
        onClose={() => setIsEarlyAccessModalOpen(false)} 
        defaultInterest={earlyAccessInterest}
      />

      <InvestorDeckModal 
        isOpen={isDeckModalOpen} 
        onClose={() => setIsDeckModalOpen(false)} 
      />

      <AboutModal 
        isOpen={isAboutModalOpen} 
        onClose={() => setIsAboutModalOpen(false)} 
        onExploreClick={handleEnterMarketplace}
      />

    </div>
  );
};
