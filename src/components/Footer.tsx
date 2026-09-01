import React from 'react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Wifi, 
  Mail, 
  Phone, 
  Globe, 
  Sun, 
  Moon, 
  Sparkles,
  ArrowRight,
  Heart,
  Laptop,
  Presentation,
  Mic,
  Camera,
  Layers,
  ChevronRight,
  HelpCircle,
  FileText,
  Lock,
  Smartphone,
  Download,
  Apple
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OFISWordmark } from './OFISWordmark';
import { SupportedCurrency, CURRENCY_RATES } from '../services/currencyService';
import { SpaceCategory } from '../types';

export const Footer: React.FC = () => {
  const { 
    setCurrentView, 
    updateFilter, 
    setActiveCategory, 
    setIsListSpaceModalOpen,
    setIsAiModalOpen,
    setIsDiagnosticsModalOpen,
    setIsDownloadAppModalOpen,
    theme,
    toggleTheme,
    currency,
    setCurrency
  } = useApp();

  const handleCityClick = (city: string) => {
    updateFilter('city', city);
    updateFilter('searchQuery', '');
    setCurrentView('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (category: SpaceCategory) => {
    setActiveCategory(category);
    updateFilter('searchQuery', '');
    setCurrentView('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: any) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B1220] text-[#94A3B8] border-t border-[#1E293B] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Brand + Value Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-[#1E293B]">
          
          {/* Brand Col (5 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <div 
              className="cursor-pointer inline-block" 
              onClick={() => handleNavigate('home')}
            >
              <OFISWordmark size="lg" />
            </div>
            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-sm">
              Nigeria&apos;s physical-space marketplace for discovering and booking verified coworking desks, private offices, meeting rooms, and creator studios with guaranteed power and high-speed fiber.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/25 font-mono">
                <Zap className="w-3 h-3" />
                <span>100% Power Uptime</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/25 font-mono">
                <Wifi className="w-3 h-3" />
                <span>100+ Mbps Fiber</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/25 font-mono">
                <ShieldCheck className="w-3 h-3" />
                <span>Vetted Hubs</span>
              </span>
            </div>
          </div>

          {/* Quick Links (7 cols on lg) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs">
            
            {/* Col 1: Popular Hubs */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-[#F8FAFC] tracking-wider uppercase">Nigerian Hubs</h4>
              <ul className="space-y-2.5">
                <li>
                  <button 
                    type="button"
                    onClick={() => handleCityClick('Lagos')}
                    className="hover:text-[#10B981] transition-colors cursor-pointer text-left"
                  >
                    Lagos (VI, Lekki, Ikeja)
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleCityClick('Abuja')}
                    className="hover:text-[#10B981] transition-colors cursor-pointer text-left"
                  >
                    Abuja (Maitama, CBD)
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleCityClick('Port Harcourt')}
                    className="hover:text-[#10B981] transition-colors cursor-pointer text-left"
                  >
                    Port Harcourt (Old GRA)
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleCityClick('Ibadan')}
                    className="hover:text-[#10B981] transition-colors cursor-pointer text-left"
                  >
                    Ibadan (Bodija, Ring Rd)
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleNavigate('map')}
                    className="text-[#10B981] hover:underline font-semibold flex items-center space-x-1 cursor-pointer pt-1"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>View Map Directory</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 2: Categories */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-[#F8FAFC] tracking-wider uppercase">Spaces</h4>
              <ul className="space-y-2.5">
                <li>
                  <button 
                    type="button"
                    onClick={() => handleCategoryClick('coworking')}
                    className="hover:text-[#10B981] transition-colors cursor-pointer text-left"
                  >
                    Coworking Desks
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleCategoryClick('private-office')}
                    className="hover:text-[#10B981] transition-colors cursor-pointer text-left"
                  >
                    Private Offices
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleCategoryClick('meeting-room')}
                    className="hover:text-[#10B981] transition-colors cursor-pointer text-left"
                  >
                    Meeting Rooms
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleCategoryClick('studio')}
                    className="hover:text-[#10B981] transition-colors cursor-pointer text-left"
                  >
                    Podcast & Media Studios
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleCategoryClick('event-space')}
                    className="hover:text-[#10B981] transition-colors cursor-pointer text-left"
                  >
                    Event & Demo Spaces
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: For Hosts */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-[#F8FAFC] tracking-wider uppercase">For Hosts</h4>
              <ul className="space-y-2.5">
                <li>
                  <button 
                    type="button"
                    onClick={() => handleNavigate('become_host')}
                    className="hover:text-[#10B981] transition-colors cursor-pointer text-left"
                  >
                    Become a Space Host
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => setIsListSpaceModalOpen(true)}
                    className="text-[#10B981] hover:underline font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <span>List Your Space</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleNavigate('host_dashboard')}
                    className="hover:text-[#10B981] transition-colors cursor-pointer text-left"
                  >
                    Host Operations Portal
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleNavigate('faq')}
                    className="hover:text-[#10B981] transition-colors cursor-pointer text-left"
                  >
                    Host Standards & Payouts
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => setIsDiagnosticsModalOpen(true)}
                    className="hover:text-[#10B981] transition-colors cursor-pointer text-left"
                  >
                    IoT Telemetry Diagnostics
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Company & Legal */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-[#F8FAFC] tracking-wider uppercase">Company</h4>
              <ul className="space-y-2.5">
                <li>
                  <button 
                    type="button"
                    onClick={() => handleNavigate('about')}
                    className="hover:text-[#10B981] transition-colors cursor-pointer text-left"
                  >
                    About OFIS
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleNavigate('contact')}
                    className="hover:text-[#10B981] transition-colors cursor-pointer text-left"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleNavigate('help')}
                    className="hover:text-[#10B981] transition-colors cursor-pointer text-left"
                  >
                    Help Center & Guides
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleNavigate('faq')}
                    className="hover:text-[#10B981] transition-colors cursor-pointer text-left"
                  >
                    Frequently Asked Questions
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => setIsDownloadAppModalOpen(true)}
                    className="text-[#10B981] hover:underline font-semibold flex items-center space-x-1.5 cursor-pointer text-left"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Download Mobile App</span>
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleNavigate('privacy')}
                    className="hover:text-[#10B981] transition-colors cursor-pointer text-left"
                  >
                    Privacy Policy (NDPR)
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleNavigate('terms')}
                    className="hover:text-[#10B981] transition-colors cursor-pointer text-left"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Bar: Utilities, Currency, Theme & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="flex items-center space-x-4">
            <span>© {new Date().getFullYear()} OFIS Technologies Ltd. All rights reserved.</span>
            <span className="hidden sm:inline text-[#475569]">•</span>
            <span className="hidden sm:inline text-[#64748B]">Built for Nigeria&apos;s High-Performance Workforce</span>
          </div>

          <div className="flex items-center space-x-3">
            
            {/* Currency Selector */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#172033] border border-[#1E293B] text-xs">
              <Globe className="w-3.5 h-3.5 text-[#10B981]" />
              <select
                id="footer-currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
                className="bg-transparent text-[#F8FAFC] font-mono text-xs focus:outline-none cursor-pointer"
                aria-label="Select Currency"
              >
                {(Object.keys(CURRENCY_RATES) as SupportedCurrency[]).map((curr) => (
                  <option key={curr} value={curr} className="bg-[#172033] text-[#F8FAFC]">
                    {CURRENCY_RATES[curr].symbol} {curr} ({CURRENCY_RATES[curr].name})
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Switcher Button */}
            <button
              type="button"
              id="footer-theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-[#172033] hover:bg-[#1E293B] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
              title={`Toggle ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Ofis Assistant Quick Trigger */}
            <button
              type="button"
              id="footer-ai-assistant-btn"
              onClick={() => setIsAiModalOpen(true)}
              className="p-2 rounded-xl bg-[#10B981]/15 hover:bg-[#10B981]/25 border border-[#10B981]/30 text-[#10B981] transition-colors cursor-pointer"
              title="Open Ofis Assistant"
              aria-label="Open Ofis Assistant"
            >
              <Sparkles className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>
    </footer>
  );
};
