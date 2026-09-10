import React, { useState } from 'react';
import { 
  ArrowRight, 
  Check, 
  Building2, 
  Users, 
  Video, 
  Mic, 
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
  Headphones,
  Mail
} from 'lucide-react';
import { MarketplaceScreenshot } from '../landing/MarketplaceScreenshot';
import { ResponsiveLandingVideo, ResponsiveLandingVideoProps } from '../landing/ResponsiveLandingVideo';
import { TrustedLogos } from '../landing/TrustedLogos';

export { ResponsiveLandingVideo };
export type { ResponsiveLandingVideoProps };
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

  const handleExplore = () => {
    if (onEnterApp) {
      onEnterApp();
    } else {
      window.location.href = '/?app=1';
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenDemoModal = (track: 'enterprise' | 'operator' | 'investor' | 'partner' = 'enterprise') => {
    setDemoModalTrack(track);
    setIsDemoModalOpen(true);
  };

  const handleOpenEarlyAccess = (role: 'Early Access' | 'Space Operator' = 'Early Access') => {
    setEarlyAccessDefaultRole(role);
    setIsEarlyAccessOpen(true);
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
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsContactOpen(true);
    }
  };

  const handleOpenAbout = () => {
    setIsAboutOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#071521] text-white font-sans antialiased selection:bg-[#14B8A6] selection:text-[#071521] relative overflow-x-hidden">
      
      {/* Ambient Lighting: soft teal and subtle peach glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[480px] bg-gradient-to-b from-[#0F766E]/20 via-[#0F766E]/5 to-transparent blur-[160px] rounded-3xl" />
        <div className="absolute top-[35%] right-[-5%] w-[600px] h-[600px] bg-[#F4A261]/8 blur-[180px] rounded-3xl" />
        <div className="absolute bottom-[20%] left-[-5%] w-[600px] h-[600px] bg-[#0F766E]/10 blur-[180px] rounded-3xl" />
        
        {/* Soft floating particle accents */}
        <div className="absolute top-[18%] left-[20%] w-2 h-2 rounded-full bg-[#14B8A6]/40 blur-[1px] animate-particle-1" />
        <div className="absolute top-[32%] right-[22%] w-2 h-2 rounded-full bg-[#F4A261]/30 blur-[1px] animate-particle-2" />
        <div className="absolute top-[68%] left-[16%] w-2 h-2 rounded-full bg-[#14B8A6]/35 blur-[1px] animate-particle-3" />
      </div>

      {/* =========================================
          LANDING PAGE HEADER: Logo + Contact Only
      ========================================== */}
      <header className="sticky top-0 z-40 bg-[#071521]/90 backdrop-blur-xl border-b border-[#1E3A4D]">
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
              width="150"
              height="40"
              fetchPriority="high"
              decoding="async"
              className="h-9 sm:h-10.5 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
          </a>

          {/* Header: Contact Only */}
          <div>
            <button 
              type="button"
              id="prelaunch-header-contact-btn"
              onClick={handleOpenContact}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#0B1F33] hover:bg-[#132A44] border border-[#1E3A4D] hover:border-[#14B8A6]/50 text-white hover:text-[#14B8A6] text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-[#14B8A6]" />
              <span>Contact</span>
            </button>
          </div>

        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10">

        {/* =========================================
            SECTION 1: HERO
            - Launching Soon segment: Clean, straight, professional card (NO ARC)
            - Headline: Work. Meet. Create. Record.
            - Subheadline: Clear, friendly business English (NO AI buzzwords)
            - Buttons: Explore Spaces, Book a Demo with brand palette
            - Below the buttons: Clear trust points in capsule
        ========================================== */}
        <section className="pt-18 sm:pt-26 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center relative">
          
          {/* Refined Teal Ambient Glow & Soft Gradient Aura */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[850px] h-[360px] bg-gradient-to-b from-[#0F766E]/20 via-[#14B8A6]/10 to-transparent blur-[140px] rounded-full pointer-events-none -z-0" />
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[450px] h-[180px] bg-[#0F766E]/15 blur-[90px] rounded-full pointer-events-none -z-0" />

          {/* Launching Soon Segment */}
          <div className="inline-flex items-center gap-3 sm:gap-3.5 mb-8 bg-transparent text-sm sm:text-base font-semibold">
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#14B8A6] animate-pulse shrink-0 shadow-[0_0_12px_#14B8A6]" />
            <span className="text-[#14B8A6] font-extrabold uppercase text-xs sm:text-sm tracking-wider">
              Launching Soon
            </span>
            <span className="text-[#94A3B8] text-base sm:text-lg">•</span>
            <button
              type="button"
              onClick={() => handleOpenEarlyAccess('Early Access')}
              className="text-white hover:text-[#F4A261] transition-colors cursor-pointer flex items-center gap-1.5 font-medium group text-sm sm:text-base"
            >
              <span>Join Early Access</span>
              <ArrowRight className="w-4 h-4 text-[#F4A261] transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Headline: single line on desktop, natural wrap on mobile */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.12] mb-6 sm:whitespace-nowrap">
            Work. Meet. Create. Record.
          </h1>

          {/* Sub-headline: Easy-to-understand plain English */}
          <p className="text-base sm:text-lg lg:text-xl text-[#CBD5E1] max-w-3xl mx-auto leading-relaxed mb-8 font-normal">
            Book verified desks, private offices, boardrooms, and production studios across Nigeria in minutes with guaranteed power and high-speed internet.
          </p>

          {/* Two Buttons with Master Brand Palette */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-6">
            <button
              onClick={handleExplore}
              className="relative group overflow-hidden w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 sm:px-9 sm:py-4 rounded-xl bg-[#0F766E] hover:bg-[#14B8A6] text-white font-extrabold text-sm sm:text-base shadow-[0_4px_25px_rgba(15,118,110,0.35)] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <span className="relative z-10 flex items-center">
                <span>Explore Spaces</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </span>
            </button>

            <button
              onClick={() => handleOpenDemoModal('enterprise')}
              className="relative group overflow-hidden w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 sm:px-9 sm:py-4 rounded-xl bg-[#0B1F33] hover:bg-[#1E3A4D] text-white font-bold text-sm sm:text-base border border-[#1E3A4D] hover:border-[#14B8A6]/50 shadow-[0_8px_32px_rgba(0,0,0,0.37)] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4 text-[#14B8A6] relative z-10" />
              <span className="relative z-10">Book a Demo</span>
            </button>
          </div>

          {/* Trust Badges Capsule */}
          <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-7 px-5 sm:px-7 py-3 rounded-2xl bg-[#0B1F33]/80 backdrop-blur-xl border border-[#1E3A4D] shadow-[0_8px_32px_rgba(7,21,33,0.3)] text-xs text-[#CBD5E1] pt-2 mb-2">
            <div className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-[#14B8A6] stroke-[2.5]" />
              <span className="font-medium text-white">Inspected Spaces</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-[#14B8A6] stroke-[2.5]" />
              <span className="font-medium text-white">Guaranteed 24/7 Power</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-[#14B8A6] stroke-[2.5]" />
              <span className="font-medium text-white">Simple Online Payment</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-[#14B8A6] stroke-[2.5]" />
              <span className="font-medium text-white">Instant Booking</span>
            </div>
          </div>

        </section>

        {/* =========================================
            SECTION 2: Live Demo Marketplace (Centerpiece)
            Bottom CTA: "Try the Live Demo Marketplace →"
        ========================================== */}
        <div className="-mt-6 mb-12 sm:mb-16">
          <MarketplaceScreenshot onExploreClick={handleExplore} />
        </div>

        {/* =========================================
            SECTION 2.5: Verified Workspace Video Showcase
            Responsive Video with Automatic High-Resolution Poster Switch
            on mobile devices and when reduced-motion preferences are detected.
        ========================================== */}
        <div className="mb-14 sm:mb-20">
          <ResponsiveLandingVideo 
            videoSrc="/media/ofis-workspace-tour.mp4"
            posterSrc="/media/ofis-workspace-poster.jpg"
            title="Experience OFIS Workspaces in Action"
            subtitle="From executive boardrooms in Abuja to creative soundstages and private suites across Lagos — tour our verified spaces."
            onExploreClick={handleExplore}
            onBookDemoClick={() => handleOpenDemoModal('enterprise')}
          />
        </div>

        {/* =========================================
            SECTION 3: Core Workspace Categories
            Refined cards with peach accents.
        ========================================== */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          
          <div className="text-center mb-14 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Spaces Built for Every Need
            </h2>
            <p className="text-sm sm:text-base text-[#CBD5E1] mt-3">
              Explore dedicated environments designed for focused productivity, team collaboration, and creative production.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Work */}
            <div className="relative overflow-hidden p-8 rounded-2xl bg-[#0B1F33] border border-[#1E3A4D] hover:border-[#F4A261]/50 shadow-[0_10px_35px_rgba(7,21,33,0.35)] hover:shadow-[0_18px_50px_rgba(7,21,33,0.55),0_0_24px_rgba(244,162,97,0.15)] transition-all duration-300 hover:-translate-y-1 group">
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#F4A261]/10 rounded-full blur-2xl group-hover:bg-[#F4A261]/20 transition-all duration-300 pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-[#F4A261]/20 border border-[#F4A261]/40 flex items-center justify-center text-[#F4A261] mb-6 shadow-[0_0_15px_rgba(244,162,97,0.18)]">
                <Building2 className="w-6 h-6 text-[#F4A261]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                🏢 Work
              </h3>
              <p className="text-sm text-[#CBD5E1] leading-relaxed">
                Book hot desks, dedicated desks, and private offices for you and your team.
              </p>
            </div>

            {/* Card 2: Meet */}
            <div className="relative overflow-hidden p-8 rounded-2xl bg-[#0B1F33] border border-[#1E3A4D] hover:border-[#F4A261]/50 shadow-[0_10px_35px_rgba(7,21,33,0.35)] hover:shadow-[0_18px_50px_rgba(7,21,33,0.55),0_0_24px_rgba(244,162,97,0.15)] transition-all duration-300 hover:-translate-y-1 group">
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#F4A261]/10 rounded-full blur-2xl group-hover:bg-[#F4A261]/20 transition-all duration-300 pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-[#F4A261]/20 border border-[#F4A261]/40 flex items-center justify-center text-[#F4A261] mb-6 shadow-[0_0_15px_rgba(244,162,97,0.18)]">
                <Users className="w-6 h-6 text-[#F4A261]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                🤝 Meet
              </h3>
              <p className="text-sm text-[#CBD5E1] leading-relaxed">
                Reserve conference rooms and boardrooms with screens, projectors, and fast internet.
              </p>
            </div>

            {/* Card 3: Create */}
            <div className="relative overflow-hidden p-8 rounded-2xl bg-[#0B1F33] border border-[#1E3A4D] hover:border-[#F4A261]/50 shadow-[0_10px_35px_rgba(7,21,33,0.35)] hover:shadow-[0_18px_50px_rgba(7,21,33,0.55),0_0_24px_rgba(244,162,97,0.15)] transition-all duration-300 hover:-translate-y-1 group">
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#F4A261]/10 rounded-full blur-2xl group-hover:bg-[#F4A261]/20 transition-all duration-300 pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-[#F4A261]/20 border border-[#F4A261]/40 flex items-center justify-center text-[#F4A261] mb-6 shadow-[0_0_15px_rgba(244,162,97,0.18)]">
                <Video className="w-6 h-6 text-[#F4A261]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                🎥 Create
              </h3>
              <p className="text-sm text-[#CBD5E1] leading-relaxed">
                Find ready-to-use photography and video production studios for your creative shoots.
              </p>
            </div>

            {/* Card 4: Record */}
            <div className="relative overflow-hidden p-8 rounded-2xl bg-[#0B1F33] border border-[#1E3A4D] hover:border-[#F4A261]/50 shadow-[0_10px_35px_rgba(7,21,33,0.35)] hover:shadow-[0_18px_50px_rgba(7,21,33,0.55),0_0_24px_rgba(244,162,97,0.15)] transition-all duration-300 hover:-translate-y-1 group">
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#F4A261]/10 rounded-full blur-2xl group-hover:bg-[#F4A261]/20 transition-all duration-300 pointer-events-none" />
              <div className="w-12 h-12 rounded-xl bg-[#F4A261]/20 border border-[#F4A261]/40 flex items-center justify-center text-[#F4A261] mb-6 shadow-[0_0_15px_rgba(244,162,97,0.18)]">
                <Mic className="w-6 h-6 text-[#F4A261]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                🎙 Record
              </h3>
              <p className="text-sm text-[#CBD5E1] leading-relaxed">
                Book soundproof podcast booths and audio recording suites with professional microphones.
              </p>
            </div>

          </div>

        </section>


        {/* =========================================
            SECTION 4: How OFIS Works
            Three simple steps: Search, Book, Show Up
        ========================================== */}
        <section className="py-24 sm:py-32 bg-[#0B1F33]/60 border-y border-[#1E3A4D] px-4 sm:px-6 lg:px-8 relative">
          
          <div className="max-w-5xl mx-auto">
            
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                How OFIS Works
              </h2>
              <p className="text-sm sm:text-base text-[#CBD5E1] mt-3">
                Three simple steps to start working in any space.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 relative">
              
              {/* Step 1: Search */}
              <div className="p-8 rounded-2xl bg-[#071521] border border-[#1E3A4D] text-center flex flex-col items-center group hover:border-[#F4A261]/50 shadow-[0_10px_35px_rgba(7,21,33,0.35)] hover:shadow-[0_18px_50px_rgba(7,21,33,0.55),0_0_24px_rgba(244,162,97,0.15)] transition-all">
                <div className="w-16 h-16 rounded-xl bg-[#F4A261]/20 border border-[#F4A261]/40 flex items-center justify-center text-xl font-extrabold text-[#F4A261] mb-6 shadow-[0_0_15px_rgba(244,162,97,0.18)]">
                  <Search className="w-7 h-7 text-[#F4A261]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F4A261] mb-2">Step 01</span>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Search
                </h3>
                <p className="text-sm text-[#CBD5E1] leading-relaxed">
                  Browse verified spaces in Victoria Island, Lekki, Ikeja, Abuja, and more. Filter by location, budget, or space type.
                </p>
              </div>

              {/* Step 2: Book */}
              <div className="p-8 rounded-2xl bg-[#071521] border border-[#1E3A4D] text-center flex flex-col items-center group hover:border-[#F4A261]/50 shadow-[0_10px_35px_rgba(7,21,33,0.35)] hover:shadow-[0_18px_50px_rgba(7,21,33,0.55),0_0_24px_rgba(244,162,97,0.15)] transition-all">
                <div className="w-16 h-16 rounded-xl bg-[#F4A261]/20 border border-[#F4A261]/40 flex items-center justify-center text-xl font-extrabold text-[#F4A261] mb-6 shadow-[0_0_15px_rgba(244,162,97,0.18)]">
                  <CreditCard className="w-7 h-7 text-[#F4A261]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F4A261] mb-2">Step 02</span>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Book
                </h3>
                <p className="text-sm text-[#CBD5E1] leading-relaxed">
                  Choose your hours or day pass, check live availability, and pay securely using your card or bank transfer.
                </p>
              </div>

              {/* Step 3: Show Up */}
              <div className="p-8 rounded-2xl bg-[#071521] border border-[#1E3A4D] text-center flex flex-col items-center group hover:border-[#F4A261]/50 shadow-[0_10px_35px_rgba(7,21,33,0.35)] hover:shadow-[0_18px_50px_rgba(7,21,33,0.55),0_0_24px_rgba(244,162,97,0.15)] transition-all">
                <div className="w-16 h-16 rounded-xl bg-[#F4A261]/20 border border-[#F4A261]/40 flex items-center justify-center text-xl font-extrabold text-[#F4A261] mb-6 shadow-[0_0_15px_rgba(244,162,97,0.18)]">
                  <QrCode className="w-7 h-7 text-[#F4A261]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F4A261] mb-2">Step 03</span>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Show Up
                </h3>
                <p className="text-sm text-[#CBD5E1] leading-relaxed">
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
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Why OFIS
            </h2>
            <p className="text-sm sm:text-base text-[#CBD5E1] mt-3">
              Built specifically for the day-to-day needs of professionals and growing businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            
            <div className="p-6 rounded-2xl bg-[#0B1F33] border border-[#1E3A4D] flex items-center space-x-4 hover:border-[#F4A261]/50 shadow-[0_4px_20px_rgba(7,21,33,0.3)] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#F4A261]/20 border border-[#F4A261]/40 flex items-center justify-center text-[#F4A261] shrink-0 shadow-[0_0_12px_rgba(244,162,97,0.15)]">
                <ShieldCheck className="w-5 h-5 text-[#F4A261]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Verified Spaces</h3>
                <p className="text-xs text-[#CBD5E1]">Inspected for quiet comfort & working AC</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B1F33] border border-[#1E3A4D] flex items-center space-x-4 hover:border-[#F4A261]/50 shadow-[0_4px_20px_rgba(7,21,33,0.3)] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#F4A261]/20 border border-[#F4A261]/40 flex items-center justify-center text-[#F4A261] shrink-0 shadow-[0_0_12px_rgba(244,162,97,0.15)]">
                <Zap className="w-5 h-5 text-[#F4A261]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Guaranteed 24/7 Power</h3>
                <p className="text-xs text-[#CBD5E1]">Tested generators & stable fiber Wi-Fi</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B1F33] border border-[#1E3A4D] flex items-center space-x-4 hover:border-[#F4A261]/50 shadow-[0_4px_20px_rgba(7,21,33,0.3)] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#F4A261]/20 border border-[#F4A261]/40 flex items-center justify-center text-[#F4A261] shrink-0 shadow-[0_0_12px_rgba(244,162,97,0.15)]">
                <CreditCard className="w-5 h-5 text-[#F4A261]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Secure Payments</h3>
                <p className="text-xs text-[#CBD5E1]">Pay with debit card or direct transfer</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B1F33] border border-[#1E3A4D] flex items-center space-x-4 hover:border-[#F4A261]/50 shadow-[0_4px_20px_rgba(7,21,33,0.3)] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#F4A261]/20 border border-[#F4A261]/40 flex items-center justify-center text-[#F4A261] shrink-0 shadow-[0_0_12px_rgba(244,162,97,0.15)]">
                <Coins className="w-5 h-5 text-[#F4A261]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Transparent Pricing</h3>
                <p className="text-xs text-[#CBD5E1]">Clear hourly, daily, or monthly rates</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B1F33] border border-[#1E3A4D] flex items-center space-x-4 hover:border-[#F4A261]/50 shadow-[0_4px_20px_rgba(7,21,33,0.3)] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#F4A261]/20 border border-[#F4A261]/40 flex items-center justify-center text-[#F4A261] shrink-0 shadow-[0_0_12px_rgba(244,162,97,0.15)]">
                <Clock className="w-5 h-5 text-[#F4A261]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Instant Confirmation</h3>
                <p className="text-xs text-[#CBD5E1]">Book immediately without waiting for replies</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B1F33] border border-[#1E3A4D] flex items-center space-x-4 hover:border-[#F4A261]/50 shadow-[0_4px_20px_rgba(7,21,33,0.3)] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#F4A261]/20 border border-[#F4A261]/40 flex items-center justify-center text-[#F4A261] shrink-0 shadow-[0_0_12px_rgba(244,162,97,0.15)]">
                <Headphones className="w-5 h-5 text-[#F4A261]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Dedicated Support</h3>
                <p className="text-xs text-[#CBD5E1]">Fast local assistance via WhatsApp and phone</p>
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
        <section className="py-20 sm:py-28 border-t border-[#1E3A4D] px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-10 sm:mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
              Trusted by top workspace operators across Nigeria
            </h2>
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
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#0F766E]/15 blur-[150px] rounded-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-5">
            Ready to find your next workspace?
          </h2>

          <p className="text-base sm:text-xl text-[#CBD5E1] max-w-2xl mx-auto leading-relaxed mb-10">
            Enjoy reliable, fully equipped spaces with uninterrupted power, high-speed fiber, and instant online booking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleExplore}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 sm:px-9 sm:py-4 rounded-xl bg-[#0F766E] hover:bg-[#14B8A6] text-white font-bold text-sm sm:text-base shadow-[0_4px_20px_rgba(15,118,110,0.3)] active:scale-[0.98] transition-all duration-200 cursor-pointer group"
            >
              <span>Explore Spaces</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => handleOpenDemoModal('enterprise')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 sm:px-9 sm:py-4 rounded-xl bg-[#0B1F33] hover:bg-[#1E3A4D] text-white font-semibold text-sm sm:text-base border border-[#1E3A4D] hover:border-[#14B8A6]/40 active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4 text-[#14B8A6]" />
              <span>Book a Demo</span>
            </button>
          </div>

        </section>

      </main>


      {/* =========================================
          SECTION 12: FOOTER
      ========================================== */}
      <footer className="border-t border-[#1E3A4D] bg-[#071521] py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="sr-only">Footer Navigation</h2>
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
                  width="135"
                  height="36"
                  loading="lazy"
                  decoding="async"
                  className="h-9 sm:h-10 w-auto object-contain"
                />
              </a>
              <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed max-w-sm">
                Discover, book, and manage flexible workspaces, boardrooms, and creative studios across Nigeria with guaranteed power and internet.
              </p>
              <div className="text-xs text-[#14B8A6] font-medium">
                Victoria Island, Lagos, Nigeria
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Quick Links</h3>
              <ul className="space-y-2 text-xs text-[#CBD5E1]">
                <li>
                  <button onClick={handleExplore} className="hover:text-[#14B8A6] transition-colors cursor-pointer">
                    Explore Spaces
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('hosts')} className="hover:text-[#14B8A6] transition-colors cursor-pointer">
                    List Your Space
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('businesses')} className="hover:text-[#14B8A6] transition-colors cursor-pointer">
                    For Businesses
                  </button>
                </li>
                <li>
                  <button onClick={() => handleOpenDemoModal('enterprise')} className="hover:text-[#14B8A6] transition-colors cursor-pointer">
                    Book a Team Demo
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Company</h3>
              <ul className="space-y-2 text-xs text-[#CBD5E1]">
                <li>
                  <button onClick={handleOpenAbout} className="hover:text-[#14B8A6] transition-colors cursor-pointer">
                    About OFIS
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('partners')} className="hover:text-[#14B8A6] transition-colors cursor-pointer">
                    Partners
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('investors')} className="hover:text-[#14B8A6] transition-colors cursor-pointer">
                    Investors
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsDeckModalOpen(true)} className="hover:text-[#14B8A6] transition-colors cursor-pointer">
                    Investor Deck
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Legal */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Contact & Support</h3>
              <ul className="space-y-2 text-xs text-[#CBD5E1]">
                <li>
                  <a href="mailto:hello@ofis.ng" className="hover:text-[#14B8A6] transition-colors">
                    hello@ofis.ng
                  </a>
                </li>
                <li>
                  <a href="mailto:partners@ofis.ng" className="hover:text-[#14B8A6] transition-colors">
                    partners@ofis.ng
                  </a>
                </li>
                <li>
                  <a href="mailto:investors@ofis.ng" className="hover:text-[#14B8A6] transition-colors">
                    investors@ofis.ng
                  </a>
                </li>
                <li className="pt-2 text-[11px] text-[#CBD5E1]">
                  <a href="#terms" onClick={(e) => { e.preventDefault(); handleOpenAbout(); }} className="hover:underline hover:text-white">
                    Terms & Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Row: Copyright */}
          <div className="pt-8 border-t border-[#1E3A4D] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#CBD5E1]">
            <div className="text-[#CBD5E1]">
              © {new Date().getFullYear()} OFIS Technologies Ltd. All rights reserved.
            </div>

            <div className="flex items-center space-x-6 text-[#CBD5E1] text-xs">
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
