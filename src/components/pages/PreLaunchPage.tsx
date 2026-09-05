import React, { useState } from 'react';
import { 
  ArrowRight, 
  Check, 
  Building2, 
  Users, 
  Video, 
  Mic, 
  Menu, 
  X, 
  Calendar,
  FileText,
  Search,
  CreditCard,
  QrCode,
  ShieldCheck,
  Zap,
  Clock,
  Coins,
  Headphones
} from 'lucide-react';
import { MarketplaceScreenshot } from '../landing/MarketplaceScreenshot';
import { TrustedLogos } from '../landing/TrustedLogos';
import { EarlyAccessModal } from '../landing/EarlyAccessModal';
import { BookDemoModal } from '../landing/BookDemoModal';
import { InvestorDeckModal } from '../landing/InvestorDeckModal';
import { FeaturedSpacesSection } from '../landing/FeaturedSpacesSection';
import { AudiencesSections } from '../landing/AudiencesSections';
import { ContactSection } from '../landing/ContactSection';
import { PreLaunchSignupForm } from '../landing/PreLaunchSignupForm';
import { AboutModal, ContactModal } from '../landing/SimpleModals';

interface PreLaunchPageProps {
  onEnterApp?: () => void;
}

export const PreLaunchPage: React.FC<PreLaunchPageProps> = ({ onEnterApp }) => {
  // Modal states
  const [isEarlyAccessOpen, setIsEarlyAccessOpen] = useState(false);
  const [earlyAccessDefaultRole, setEarlyAccessDefaultRole] = useState<'Early Access' | 'Space Operator'>('Early Access');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoModalTrack, setDemoModalTrack] = useState<'enterprise' | 'operator' | 'investor' | 'partner'>('enterprise');
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleExplore = () => {
    if (onEnterApp) {
      onEnterApp();
    } else {
      window.location.href = '/?app=1';
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenDemoModal = (track: 'enterprise' | 'operator' | 'investor' | 'partner' = 'enterprise') => {
    setDemoModalTrack(track);
    setIsDemoModalOpen(true);
    setMobileMenuOpen(false);
  };

  const handleOpenEarlyAccess = (role: 'Early Access' | 'Space Operator' = 'Early Access') => {
    setEarlyAccessDefaultRole(role);
    setIsEarlyAccessOpen(true);
    setMobileMenuOpen(false);
  };

  const handleOpenHosts = () => {
    scrollToSection('hosts');
  };

  const handleOpenPartners = () => {
    scrollToSection('partners');
  };

  const handleOpenInvestors = () => {
    scrollToSection('investors');
  };

  const handleOpenContact = () => {
    window.location.href = 'mailto:hello@ofis.ng';
  };

  const handleOpenAbout = () => {
    setIsAboutOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-[#FAF8F5] font-sans antialiased selection:bg-[#10B981] selection:text-black relative overflow-x-hidden">
      
      {/* Warm Ambient Lighting: soft warm emerald and warm amber glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[480px] bg-gradient-to-b from-[#10B981]/10 via-[#10B981]/5 to-transparent blur-[160px] rounded-3xl" />
        <div className="absolute top-[35%] right-[-5%] w-[600px] h-[600px] bg-[#F59E0B]/4 blur-[180px] rounded-3xl" />
        <div className="absolute bottom-[20%] left-[-5%] w-[600px] h-[600px] bg-[#10B981]/5 blur-[180px] rounded-3xl" />
        
        {/* Soft floating warm particle accents */}
        <div className="absolute top-[18%] left-[20%] w-2 h-2 rounded-full bg-[#10B981]/30 blur-[1px] animate-particle-1" />
        <div className="absolute top-[32%] right-[22%] w-2 h-2 rounded-full bg-[#F59E0B]/20 blur-[1px] animate-particle-2" />
        <div className="absolute top-[68%] left-[16%] w-2 h-2 rounded-full bg-[#10B981]/25 blur-[1px] animate-particle-3" />
      </div>

      {/* =========================================
          NAVIGATION:
          Desktop: Logo | Explore | List Your Space | Partners | Investors | Contact | Explore (CTA)
          Mobile: ☰ Menu: Explore, List Your Space, Partners, Investors, About, Contact, Request Investor Deck
      ========================================== */}
      <header className="sticky top-0 z-40 bg-[#0C0B0A]/85 backdrop-blur-xl border-b border-[#292724]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          
          {/* Logo */}
          <a 
            href="/" 
            onClick={(e) => {
              e.preventDefault();
              const url = new URL(window.location.href);
              url.searchParams.delete('app');
              window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
              window.dispatchEvent(new PopStateEvent('popstate'));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center group cursor-pointer"
            title="OFIS Home"
          >
            <img 
              src="/ofis-logo-dark.png" 
              alt="OFIS" 
              className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-7 lg:space-x-8 text-sm font-medium text-[#A8A29E]">
            <button 
              onClick={handleExplore}
              className="hover:text-[#FAF8F5] transition-colors cursor-pointer"
            >
              Explore
            </button>
            <button 
              onClick={handleOpenHosts}
              className="hover:text-[#FAF8F5] transition-colors cursor-pointer"
            >
              List Your Space
            </button>
            <button 
              onClick={handleOpenPartners}
              className="hover:text-[#FAF8F5] transition-colors cursor-pointer"
            >
              Partners
            </button>
            <button 
              onClick={handleOpenInvestors}
              className="hover:text-[#FAF8F5] transition-colors cursor-pointer"
            >
              Investors
            </button>
            <a 
              href="mailto:hello@ofis.ng"
              className="hover:text-[#FAF8F5] transition-colors cursor-pointer"
            >
              Contact
            </a>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={handleExplore}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-b from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-[#0C0B0A] font-bold text-xs shadow-[0_2px_12px_rgba(16,185,129,0.25)] transition-all cursor-pointer flex items-center space-x-1.5 group"
            >
              <span>Explore Spaces</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Mobile Actions & Hamburger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={handleExplore}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-b from-[#10B981] to-[#059669] text-[#0C0B0A] font-bold text-xs"
            >
              Explore
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#A8A29E] hover:text-[#FAF8F5] hover:bg-[#171615] focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0C0B0A] border-b border-[#292724] px-5 py-5 space-y-3 animate-fade-in">
            <button
              onClick={() => { setMobileMenuOpen(false); handleExplore(); }}
              className="block w-full text-left py-2 text-base font-semibold text-[#FAF8F5] hover:text-[#34D399]"
            >
              Explore
            </button>
            <button
              onClick={() => scrollToSection('hosts')}
              className="block w-full text-left py-2 text-base font-medium text-[#A8A29E] hover:text-[#FAF8F5]"
            >
              List Your Space
            </button>
            <button
              onClick={() => scrollToSection('partners')}
              className="block w-full text-left py-2 text-base font-medium text-[#A8A29E] hover:text-[#FAF8F5]"
            >
              Partners
            </button>
            <button
              onClick={() => scrollToSection('investors')}
              className="block w-full text-left py-2 text-base font-medium text-[#A8A29E] hover:text-[#FAF8F5]"
            >
              Investors
            </button>
            <button
              onClick={handleOpenAbout}
              className="block w-full text-left py-2 text-base font-medium text-[#A8A29E] hover:text-[#FAF8F5]"
            >
              About
            </button>
            <a
              href="mailto:hello@ofis.ng"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left py-2 text-base font-medium text-[#A8A29E] hover:text-[#FAF8F5]"
            >
              Contact
            </a>
            
            <div className="pt-3 border-t border-[#292724] flex flex-col gap-2.5">
              <button
                onClick={() => { setMobileMenuOpen(false); setIsDeckModalOpen(true); }}
                className="w-full py-2.5 rounded-xl bg-[#171615] border border-[#10B981]/40 text-xs font-semibold text-[#34D399] flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4 text-[#34D399]" />
                <span>Request Investor Deck</span>
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); handleExplore(); }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-b from-[#10B981] to-[#059669] text-[#0C0B0A] text-xs font-bold text-center"
              >
                Explore Spaces
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10">

        {/* =========================================
            SECTION 1: HERO
            - Launching Soon segment: Clean, straight, professional card (NO ARC)
            - Headline: Work. Meet. Create. Record.
            - Subheadline: Clear, friendly business English (NO AI buzzwords)
            - Buttons: 🟢 Explore Spaces, ⚪ Book a Demo with refined glassmorphism & emerald glow
            - Below the buttons: Clear trust points in glassmorphic capsule
        ========================================== */}
        <section className="pt-18 sm:pt-26 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center relative">
          
          {/* Refined Emerald Ambient Glow & Soft Gradient Aura */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[850px] h-[360px] bg-gradient-to-b from-[#10B981]/15 via-[#34D399]/8 to-transparent blur-[140px] rounded-full pointer-events-none -z-0" />
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[450px] h-[180px] bg-[#10B981]/10 blur-[90px] rounded-full pointer-events-none -z-0" />

          {/* Launching Soon Segment: Transparent background & enlarged typography */}
          <div className="inline-flex items-center gap-3 sm:gap-3.5 mb-8 bg-transparent text-sm sm:text-base font-semibold">
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#10B981] animate-pulse shrink-0 shadow-[0_0_12px_#10B981]" />
            <span className="text-[#34D399] font-extrabold uppercase text-xs sm:text-sm tracking-wider">
              Launching Soon
            </span>
            <span className="text-[#57534E] text-base sm:text-lg">•</span>
            <button
              type="button"
              onClick={() => handleOpenEarlyAccess('Early Access')}
              className="text-[#FAF8F5] hover:text-[#34D399] transition-colors cursor-pointer flex items-center gap-1.5 font-medium group text-sm sm:text-base"
            >
              <span>Join Early Access</span>
              <ArrowRight className="w-4 h-4 text-[#34D399] transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Headline: single line on desktop, natural wrap on mobile */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#FAF8F5] max-w-5xl mx-auto leading-[1.12] mb-6 sm:whitespace-nowrap">
            Work. Meet. Create. Record.
          </h1>

          {/* Sub-headline: Easy-to-understand plain English */}
          <p className="text-base sm:text-lg lg:text-xl text-[#A8A29E] max-w-3xl mx-auto leading-relaxed mb-8 font-normal">
            Book verified desks, private offices, boardrooms, and production studios across Nigeria in minutes with guaranteed power and high-speed internet.
          </p>

          {/* Two Refined Glassmorphic Buttons with Emerald Glows & Specular Sheen */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-6">
            <button
              onClick={handleExplore}
              className="relative group overflow-hidden w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 sm:px-9 sm:py-4 rounded-xl bg-gradient-to-b from-[#34D399] via-[#10B981] to-[#059669] hover:from-[#10B981] hover:to-[#047857] text-[#0C0B0A] font-extrabold text-sm sm:text-base shadow-[0_4px_25px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.6),0_0_24px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_32px_rgba(16,185,129,0.5),inset_0_1px_2px_rgba(255,255,255,0.8),0_0_36px_rgba(16,185,129,0.35)] border border-white/25 active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/25 pointer-events-none" />
              <span className="relative z-10 flex items-center">
                <span>Explore Spaces</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </span>
            </button>

            <button
              onClick={() => handleOpenDemoModal('enterprise')}
              className="relative group overflow-hidden w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 sm:px-9 sm:py-4 rounded-xl bg-[#171615]/75 hover:bg-[#201E1C]/90 text-[#FAF8F5] font-bold text-sm sm:text-base backdrop-blur-xl border border-white/10 hover:border-[#10B981]/50 shadow-[0_8px_32px_rgba(0,0,0,0.37),inset_0_1px_1px_rgba(255,255,255,0.08),0_0_15px_rgba(16,185,129,0.05)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15),0_0_25px_rgba(16,185,129,0.2)] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center space-x-2"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#10B981]/5 via-transparent to-white/5 opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <Calendar className="w-4 h-4 text-[#34D399] relative z-10" />
              <span className="relative z-10">Book a Demo</span>
            </button>
          </div>

          {/* Trust Badges: Frosted Glass Capsule */}
          <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-7 px-5 sm:px-7 py-3 rounded-2xl bg-[#171615]/65 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06),0_0_20px_rgba(16,185,129,0.06)] text-xs text-[#A8A29E] pt-2 mb-2">
            <div className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-[#10B981] stroke-[2.5]" />
              <span className="font-medium text-[#FAF8F5]">Inspected Spaces</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-[#10B981] stroke-[2.5]" />
              <span className="font-medium text-[#FAF8F5]">Guaranteed 24/7 Power</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-[#10B981] stroke-[2.5]" />
              <span className="font-medium text-[#FAF8F5]">Simple Online Payment</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-[#10B981] stroke-[2.5]" />
              <span className="font-medium text-[#FAF8F5]">Instant Booking</span>
            </div>
          </div>

        </section>

        {/* =========================================
            SECTION 2: Live Demo Marketplace (Centerpiece)
            Bottom CTA: "Try the Live Demo Marketplace →"
        ========================================== */}
        <div className="-mt-6 mb-16 sm:mb-24">
          <MarketplaceScreenshot onExploreClick={handleExplore} />
        </div>

        {/* =========================================
            SECTION 3: Core Workspace Categories
            Refined glassmorphic cards with emerald accents.
        ========================================== */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          
          <div className="text-center mb-14 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FAF8F5] tracking-tight">
              Spaces Built for Every Need
            </h2>
            <p className="text-sm sm:text-base text-[#A8A29E] mt-3">
              Explore dedicated environments designed for focused productivity, team collaboration, and creative production.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Work */}
            <div className="relative overflow-hidden p-8 rounded-2xl bg-[#171615]/75 backdrop-blur-xl border border-white/[0.08] hover:border-[#10B981]/40 shadow-[0_10px_35px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] hover:shadow-[0_18px_50px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.12),0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300 hover:-translate-y-1 group">
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#10B981]/5 rounded-full blur-2xl group-hover:bg-[#10B981]/15 transition-all duration-300 pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#34D399] mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#FAF8F5] mb-2">
                🏢 Work
              </h3>
              <p className="text-sm text-[#A8A29E] leading-relaxed">
                Book hot desks, dedicated desks, and private offices for you and your team.
              </p>
            </div>

            {/* Card 2: Meet */}
            <div className="relative overflow-hidden p-8 rounded-2xl bg-[#171615]/75 backdrop-blur-xl border border-white/[0.08] hover:border-[#10B981]/40 shadow-[0_10px_35px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] hover:shadow-[0_18px_50px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.12),0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300 hover:-translate-y-1 group">
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#10B981]/5 rounded-full blur-2xl group-hover:bg-[#10B981]/15 transition-all duration-300 pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#34D399] mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#FAF8F5] mb-2">
                🤝 Meet
              </h3>
              <p className="text-sm text-[#A8A29E] leading-relaxed">
                Reserve conference rooms and boardrooms with screens, projectors, and fast internet.
              </p>
            </div>

            {/* Card 3: Create */}
            <div className="relative overflow-hidden p-8 rounded-2xl bg-[#171615]/75 backdrop-blur-xl border border-white/[0.08] hover:border-[#10B981]/40 shadow-[0_10px_35px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] hover:shadow-[0_18px_50px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.12),0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300 hover:-translate-y-1 group">
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#10B981]/5 rounded-full blur-2xl group-hover:bg-[#10B981]/15 transition-all duration-300 pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#34D399] mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#FAF8F5] mb-2">
                🎥 Create
              </h3>
              <p className="text-sm text-[#A8A29E] leading-relaxed">
                Find ready-to-use photography and video production studios for your creative shoots.
              </p>
            </div>

            {/* Card 4: Record */}
            <div className="relative overflow-hidden p-8 rounded-2xl bg-[#171615]/75 backdrop-blur-xl border border-white/[0.08] hover:border-[#10B981]/40 shadow-[0_10px_35px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] hover:shadow-[0_18px_50px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.12),0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300 hover:-translate-y-1 group">
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#10B981]/5 rounded-full blur-2xl group-hover:bg-[#10B981]/15 transition-all duration-300 pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#34D399] mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#FAF8F5] mb-2">
                🎙 Record
              </h3>
              <p className="text-sm text-[#A8A29E] leading-relaxed">
                Book soundproof podcast booths and audio recording suites with professional microphones.
              </p>
            </div>

          </div>

        </section>


        {/* =========================================
            SECTION 4: How OFIS Works
            Three simple steps: Search, Book, Show Up
        ========================================== */}
        <section className="py-24 sm:py-32 bg-[#121110] border-y border-[#292724] px-4 sm:px-6 lg:px-8 relative">
          
          <div className="max-w-5xl mx-auto">
            
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FAF8F5] tracking-tight">
                How OFIS Works
              </h2>
              <p className="text-sm sm:text-base text-[#A8A29E] mt-3">
                Three simple steps to start working in any space.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 relative">
              
              {/* Step 1: Search */}
              <div className="p-8 rounded-2xl bg-[#171615] border border-[#292724] text-center flex flex-col items-center group hover:border-[#10B981]/40 transition-all">
                <div className="w-16 h-16 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-xl font-extrabold text-[#34D399] mb-6">
                  <Search className="w-7 h-7 text-[#10B981]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#10B981] mb-2">Step 01</span>
                <h3 className="text-2xl font-bold text-[#FAF8F5] mb-2">
                  Search
                </h3>
                <p className="text-sm text-[#A8A29E] leading-relaxed">
                  Browse verified spaces in Victoria Island, Lekki, Ikeja, Abuja, and more. Filter by location, budget, or space type.
                </p>
              </div>

              {/* Step 2: Book */}
              <div className="p-8 rounded-2xl bg-[#171615] border border-[#292724] text-center flex flex-col items-center group hover:border-[#10B981]/40 transition-all">
                <div className="w-16 h-16 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-xl font-extrabold text-[#34D399] mb-6">
                  <CreditCard className="w-7 h-7 text-[#10B981]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#10B981] mb-2">Step 02</span>
                <h3 className="text-2xl font-bold text-[#FAF8F5] mb-2">
                  Book
                </h3>
                <p className="text-sm text-[#A8A29E] leading-relaxed">
                  Choose your hours or day pass, check live availability, and pay securely using your card or bank transfer.
                </p>
              </div>

              {/* Step 3: Show Up */}
              <div className="p-8 rounded-2xl bg-[#171615] border border-[#292724] text-center flex flex-col items-center group hover:border-[#10B981]/40 transition-all">
                <div className="w-16 h-16 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-xl font-extrabold text-[#34D399] mb-6">
                  <QrCode className="w-7 h-7 text-[#10B981]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#10B981] mb-2">Step 03</span>
                <h3 className="text-2xl font-bold text-[#FAF8F5] mb-2">
                  Show Up
                </h3>
                <p className="text-sm text-[#A8A29E] leading-relaxed">
                  You receive an instant digital QR pass on your phone. Show it at the front desk and get straight to work.
                </p>
              </div>

            </div>

          </div>

        </section>


        {/* =========================================
            SECTION 5: Why OFIS
            Simple icon cards: Real business benefits
        ========================================== */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FAF8F5] tracking-tight">
              Why OFIS
            </h2>
            <p className="text-sm sm:text-base text-[#A8A29E] mt-3">
              Built specifically for the day-to-day needs of professionals and growing businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            
            <div className="p-6 rounded-2xl bg-[#171615] border border-[#292724] flex items-center space-x-4 hover:border-[#10B981]/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 flex items-center justify-center text-[#34D399] shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#10B981]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#FAF8F5]">Verified Spaces</h4>
                <p className="text-xs text-[#A8A29E]">Inspected for quiet comfort & working AC</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#171615] border border-[#292724] flex items-center space-x-4 hover:border-[#10B981]/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 flex items-center justify-center text-[#34D399] shrink-0">
                <Zap className="w-5 h-5 text-[#10B981]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#FAF8F5]">Guaranteed 24/7 Power</h4>
                <p className="text-xs text-[#A8A29E]">Tested generators & stable fiber Wi-Fi</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#171615] border border-[#292724] flex items-center space-x-4 hover:border-[#10B981]/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 flex items-center justify-center text-[#34D399] shrink-0">
                <CreditCard className="w-5 h-5 text-[#10B981]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#FAF8F5]">Secure Payments</h4>
                <p className="text-xs text-[#A8A29E]">Pay with debit card or direct transfer</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#171615] border border-[#292724] flex items-center space-x-4 hover:border-[#10B981]/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 flex items-center justify-center text-[#34D399] shrink-0">
                <Coins className="w-5 h-5 text-[#10B981]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#FAF8F5]">Transparent Pricing</h4>
                <p className="text-xs text-[#A8A29E]">Clear hourly, daily, or monthly rates</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#171615] border border-[#292724] flex items-center space-x-4 hover:border-[#10B981]/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 flex items-center justify-center text-[#34D399] shrink-0">
                <Clock className="w-5 h-5 text-[#10B981]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#FAF8F5]">Instant Confirmation</h4>
                <p className="text-xs text-[#A8A29E]">Book immediately without waiting for replies</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#171615] border border-[#292724] flex items-center space-x-4 hover:border-[#10B981]/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 flex items-center justify-center text-[#34D399] shrink-0">
                <Headphones className="w-5 h-5 text-[#10B981]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#FAF8F5]">Dedicated Support</h4>
                <p className="text-xs text-[#A8A29E]">Fast local assistance via WhatsApp and phone</p>
              </div>
            </div>

          </div>

        </section>


        {/* =========================================
            SECTION 6: Featured Spaces
        ========================================== */}
        <FeaturedSpacesSection onExploreClick={handleExplore} />


        {/* =========================================
            SECTIONS 7, 8, 9, 10:
            - Section 7: For Businesses
            - Section 8: List Your Space
            - Section 9: Partners
            - Section 10: Investors
        ========================================== */}
        <AudiencesSections
          onBookDemo={(track) => handleOpenDemoModal(track)}
          onListSpace={() => handleOpenEarlyAccess('Space Operator')}
          onPartner={() => handleOpenDemoModal('partner')}
          onRequestDeck={() => setIsDeckModalOpen(true)}
          onScheduleMeeting={() => handleOpenDemoModal('investor')}
        />


        {/* =========================================
            TRUSTED PARTNER LOGOS
        ========================================== */}
        <section className="py-20 sm:py-28 border-t border-[#292724] px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-10 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A8A29E]">
              Trusted by top workspace operators across Nigeria
            </span>
          </div>
          <TrustedLogos />
        </section>


        {/* =========================================
            SECTION 10.5: Pre-Launch Priority Signup
            Captures leads directly into the Supabase "leads" table
            (mapping to name, email, interest, message, source, landing_path)
        ========================================== */}
        <section id="prelaunch-signup" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <PreLaunchSignupForm />
        </section>


        {/* =========================================
            SECTION 11: Contact Us
        ========================================== */}
        <ContactSection />


        {/* =========================================
            FINAL CALL TO ACTION
        ========================================== */}
        <section className="py-24 sm:py-36 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#10B981]/10 blur-[150px] rounded-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#FAF8F5] tracking-tight mb-5">
            Ready to find your next workspace?
          </h2>

          <p className="text-base sm:text-xl text-[#A8A29E] max-w-2xl mx-auto leading-relaxed mb-10">
            Enjoy reliable, fully equipped spaces with uninterrupted power, high-speed fiber, and instant online booking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleExplore}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 sm:px-9 sm:py-4 rounded-xl bg-gradient-to-b from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-[#0C0B0A] font-bold text-sm sm:text-base shadow-[0_4px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_6px_28px_rgba(16,185,129,0.4)] active:scale-[0.98] transition-all duration-200 cursor-pointer group"
            >
              <span>Explore Spaces</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => handleOpenDemoModal('enterprise')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 sm:px-9 sm:py-4 rounded-xl bg-[#171615] hover:bg-[#201E1C] text-[#FAF8F5] font-semibold text-sm sm:text-base border border-[#292724] hover:border-[#34D399]/40 active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4 text-[#34D399]" />
              <span>Book a Demo</span>
            </button>
          </div>

        </section>

      </main>


      {/* =========================================
          SECTION 12: FOOTER
      ========================================== */}
      <footer className="border-t border-[#292724] bg-[#0C0B0A] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Main Footer Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Column 1: Logo & Mission */}
            <div className="lg:col-span-2 space-y-4">
              <a 
                href="/" 
                onClick={(e) => {
                  e.preventDefault();
                  const url = new URL(window.location.href);
                  url.searchParams.delete('app');
                  window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
                  window.dispatchEvent(new PopStateEvent('popstate'));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-block cursor-pointer"
                title="OFIS Home"
              >
                <img 
                  src="/ofis-logo-dark.png" 
                  alt="OFIS" 
                  className="h-7 w-auto object-contain"
                />
              </a>
              <p className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed max-w-sm">
                Discover, book, and manage flexible workspaces, boardrooms, and creative studios across Nigeria with guaranteed power and internet.
              </p>
              <div className="text-xs text-[#34D399] font-medium">
                Victoria Island, Lagos, Nigeria
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#FAF8F5]">Quick Links</h4>
              <ul className="space-y-2 text-xs text-[#A8A29E]">
                <li>
                  <button onClick={handleExplore} className="hover:text-[#34D399] transition-colors cursor-pointer">
                    Explore Spaces
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('hosts')} className="hover:text-[#34D399] transition-colors cursor-pointer">
                    List Your Space
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('businesses')} className="hover:text-[#34D399] transition-colors cursor-pointer">
                    For Businesses
                  </button>
                </li>
                <li>
                  <button onClick={() => handleOpenDemoModal('enterprise')} className="hover:text-[#34D399] transition-colors cursor-pointer">
                    Book a Team Demo
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#FAF8F5]">Company</h4>
              <ul className="space-y-2 text-xs text-[#A8A29E]">
                <li>
                  <button onClick={handleOpenAbout} className="hover:text-[#34D399] transition-colors cursor-pointer">
                    About OFIS
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('partners')} className="hover:text-[#34D399] transition-colors cursor-pointer">
                    Partners
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('investors')} className="hover:text-[#34D399] transition-colors cursor-pointer">
                    Investors
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsDeckModalOpen(true)} className="hover:text-[#34D399] transition-colors cursor-pointer">
                    Investor Deck
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Legal */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#FAF8F5]">Contact & Support</h4>
              <ul className="space-y-2 text-xs text-[#A8A29E]">
                <li>
                  <a href="mailto:hello@ofis.ng" className="hover:text-[#34D399] transition-colors">
                    hello@ofis.ng
                  </a>
                </li>
                <li>
                  <a href="mailto:partners@ofis.ng" className="hover:text-[#34D399] transition-colors">
                    partners@ofis.ng
                  </a>
                </li>
                <li>
                  <a href="mailto:investors@ofis.ng" className="hover:text-[#34D399] transition-colors">
                    investors@ofis.ng
                  </a>
                </li>
                <li className="pt-2 text-[11px] text-stone-500">
                  <a href="#terms" onClick={(e) => { e.preventDefault(); handleOpenAbout(); }} className="hover:underline">
                    Terms & Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Row: Copyright */}
          <div className="pt-8 border-t border-[#292724] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A8A29E]">
            <div className="text-stone-500">
              © {new Date().getFullYear()} OFIS Technologies Ltd. All rights reserved.
            </div>

            <div className="flex items-center space-x-6 text-stone-500 text-xs">
              <span>Inspected Spaces</span>
              <span>•</span>
              <span>Guaranteed Backup Power</span>
              <span>•</span>
              <span>Lagos & Abuja, Nigeria</span>
            </div>
          </div>

        </div>
      </footer>


      {/* =========================================
          MODALS
      ========================================== */}
      
      {/* BOOK A DEMO MODAL */}
      <BookDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        defaultTrack={demoModalTrack}
      />

      {/* REQUEST INVESTOR DECK MODAL */}
      <InvestorDeckModal
        isOpen={isDeckModalOpen}
        onClose={() => setIsDeckModalOpen(false)}
      />

      {/* EARLY ACCESS / HOST SIGNUP MODAL */}
      <EarlyAccessModal
        isOpen={isEarlyAccessOpen}
        onClose={() => setIsEarlyAccessOpen(false)}
        defaultInterest={earlyAccessDefaultRole}
        title={earlyAccessDefaultRole === 'Space Operator' ? 'List Your Space on OFIS' : 'Join Early Access'}
        subtitle={
          earlyAccessDefaultRole === 'Space Operator' 
            ? 'List your desks, meeting rooms, or creative studio to reach thousands of verified local professionals.'
            : 'Be the first to book verified spaces and get early access discounts when we launch.'
        }
      />

      {/* ABOUT MODAL */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onExploreClick={handleExplore}
      />

      {/* CONTACT MODAL */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

    </div>
  );
};
