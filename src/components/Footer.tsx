import React from 'react';
import { 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Wifi, 
  Globe, 
  Sun, 
  Moon, 
  ArrowRight,
  Smartphone
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
    <footer className="bg-[#07383D] text-[#B8D1D0] border-t border-[#166D74] pt-12 pb-10 transition-colors relative overflow-hidden">
      {/* Radiant OFIS Brand Accent Line (Multi-Color Spectrum with Prominent Peach Glow) */}
      <div className="h-[2.5px] w-full absolute top-0 left-0 bg-gradient-to-r from-[#006B70] via-[#14BEB8] via-[#FFA987] to-[#006B70]" />

      {/* Ambient Warm Peach Glow in the Background */}
      <div className="absolute -bottom-20 right-1/4 w-96 h-48 bg-[#FFA987]/10 blur-3xl rounded-full pointer-events-none -z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Streamlined & Decluttered */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-[#166D74]/70">
          
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-3.5">
            <div 
              className="cursor-pointer inline-block transition-transform hover:opacity-90" 
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.delete('app');
                window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
                window.dispatchEvent(new PopStateEvent('popstate'));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              title="Return to Launch Page"
            >
              <OFISWordmark size="lg" theme="dark" />
            </div>

            <p className="text-xs sm:text-sm text-[#B8D1D0] leading-relaxed max-w-sm">
              Nigeria&apos;s physical workspace network. Discover and book verified desks, offices, meeting rooms, and studios with guaranteed power.
            </p>

            {/* Clean Trust Indicators with Warm Peach Highlight */}
            <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
              <span className="inline-flex items-center space-x-1.5 text-[#FFA987] font-medium">
                <Zap className="w-3.5 h-3.5 fill-[#FFA987]/30 text-[#FFA987]" />
                <span>100% Power SLA</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 text-[#28D2CB] font-medium">
                <Wifi className="w-3.5 h-3.5 text-[#28D2CB]" />
                <span>Fiber + Starlink</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 text-[#FFD0BD] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FFA987]" />
                <span>Vetted Hubs</span>
              </span>
            </div>
          </div>

          {/* Clean 3-Column Navigation Grid (8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 text-xs">
            
            {/* Column 1: Explore Spaces & Cities */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#FFFFFF] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFA987]" />
                <span>Spaces & Hubs</span>
              </h4>
              <ul className="space-y-2 text-[#B8D1D0]">
                <li>
                  <button 
                    type="button"
                    onClick={() => handleCityClick('Lagos')}
                    className="hover:text-[#FFA987] transition-colors cursor-pointer text-left"
                  >
                    Lagos (VI, Lekki, Ikeja)
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleCityClick('Abuja')}
                    className="hover:text-[#FFA987] transition-colors cursor-pointer text-left"
                  >
                    Abuja (Maitama, CBD)
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleCategoryClick('coworking')}
                    className="hover:text-[#FFA987] transition-colors cursor-pointer text-left"
                  >
                    Coworking Desks
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleCategoryClick('private_office')}
                    className="hover:text-[#FFA987] transition-colors cursor-pointer text-left"
                  >
                    Private Offices
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleCategoryClick('studio')}
                    className="hover:text-[#FFA987] transition-colors cursor-pointer text-left"
                  >
                    Podcast & Production
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleNavigate('map')}
                    className="text-[#FFA987] hover:text-[#FFD0BD] font-semibold flex items-center space-x-1 cursor-pointer pt-0.5"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>Interactive Map</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: For Space Hosts */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#FFFFFF] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#28D2CB]" />
                <span>For Hosts</span>
              </h4>
              <ul className="space-y-2 text-[#B8D1D0]">
                <li>
                  <button 
                    type="button"
                    onClick={() => setIsListSpaceModalOpen(true)}
                    className="text-[#FFA987] hover:text-[#FFD0BD] font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <span>List Your Space</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleNavigate('become_host')}
                    className="hover:text-[#FFA987] transition-colors cursor-pointer text-left"
                  >
                    Become an OFIS Host
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleNavigate('host_dashboard')}
                    className="hover:text-[#FFA987] transition-colors cursor-pointer text-left"
                  >
                    Host Operations Hub
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleNavigate('faq')}
                    className="hover:text-[#FFA987] transition-colors cursor-pointer text-left"
                  >
                    Host Standards & Payouts
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Company & Support */}
            <div className="space-y-3 col-span-2 sm:col-span-1">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#FFFFFF] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#14BEB8]" />
                <span>Company</span>
              </h4>
              <ul className="space-y-2 text-[#B8D1D0]">
                <li>
                  <button 
                    type="button"
                    onClick={() => handleNavigate('about')}
                    className="hover:text-[#FFA987] transition-colors cursor-pointer text-left"
                  >
                    About OFIS
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleNavigate('contact')}
                    className="hover:text-[#FFA987] transition-colors cursor-pointer text-left"
                  >
                    Contact Support
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleNavigate('help')}
                    className="hover:text-[#FFA987] transition-colors cursor-pointer text-left"
                  >
                    Help Center & Guides
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => setIsDownloadAppModalOpen(true)}
                    className="text-[#FFA987] hover:text-[#FFD0BD] font-semibold flex items-center space-x-1.5 cursor-pointer text-left"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Download App</span>
                  </button>
                </li>
                <li>
                  <a 
                    href="/api/download/ofis-logo-assets.zip" 
                    download="ofis-logo-assets.zip"
                    className="text-[#28D2CB] hover:underline font-semibold flex items-center space-x-1.5 cursor-pointer text-left text-xs"
                  >
                    <span>Download Brand Assets (.zip)</span>
                  </a>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => handleNavigate('privacy')}
                    className="hover:text-[#B8D1D0] transition-colors cursor-pointer text-left text-[11px]"
                  >
                    Privacy (NDPR) & Terms
                  </button>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Bar: Utilities, Currency, Theme & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2 text-[#B8D1D0] text-[11px] sm:text-xs">
            <span>© {new Date().getFullYear()} OFIS Technologies Ltd.</span>
            <span className="text-[#166D74]">•</span>
            <span className="text-[#FFA987] font-medium">Power Guaranteed</span>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Currency Selector */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-[#0B4A50] border border-[#166D74] text-xs">
              <Globe className="w-3.5 h-3.5 text-[#FFA987]" />
              <select
                id="footer-currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
                className="bg-transparent text-[#FFFFFF] font-mono text-xs focus:outline-none cursor-pointer"
                aria-label="Select Currency"
              >
                {(Object.keys(CURRENCY_RATES) as SupportedCurrency[]).map((curr) => (
                  <option key={curr} value={curr} className="bg-[#0B4A50] text-[#FFFFFF]">
                    {CURRENCY_RATES[curr].symbol} {curr}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Switcher Button */}
            <button
              type="button"
              id="footer-theme-toggle-btn"
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl bg-[#0B4A50] hover:bg-[#105A60] border border-[#166D74] text-[#B8D1D0] hover:text-[#FFFFFF] transition-colors cursor-pointer"
              title={`Toggle ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#FFA987]" /> : <Moon className="w-4 h-4 text-[#28D2CB]" />}
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
