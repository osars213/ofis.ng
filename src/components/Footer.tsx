import React from 'react';
import { 
  Globe, 
  Sun, 
  Moon, 
  Mail,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OFISWordmark } from './OFISWordmark';
import { SupportedCurrency, CURRENCY_RATES } from '../services/currencyService';

export const Footer: React.FC = () => {
  const { 
    setCurrentView, 
    setIsListSpaceModalOpen,
    theme,
    toggleTheme,
    currency,
    setCurrency
  } = useApp();

  const handleNavigate = (view: any) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#07383D] text-[#B8D1D0] border-t border-[#166D74] py-5 sm:py-6 transition-colors relative overflow-hidden">
      {/* Brand Accent Top Line */}
      <div className="h-[2px] w-full absolute top-0 left-0 bg-gradient-to-r from-[#006B70] via-[#14BEB8] via-[#FFA987] to-[#006B70]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Main Compact Row: Logo, Links & General Contact */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-[#166D74]/50">
          
          {/* Brand Wordmark & Quick Pitch */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 shrink-0">
            <div 
              className="cursor-pointer transition-transform hover:opacity-90 inline-block" 
              onClick={() => handleNavigate('home')}
              title="OFIS Home"
            >
              <OFISWordmark size="md" theme="dark" />
            </div>
            <span className="hidden sm:inline-block text-[#166D74]">•</span>
            <p className="text-xs text-[#B8D1D0] leading-snug">
              Nigeria&apos;s physical workspace network. 100% Power SLA Guaranteed.
            </p>
          </div>

          {/* Compact Inline Navigation Links */}
          <nav className="flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-2 text-xs font-medium text-[#B8D1D0]">
            <button 
              type="button"
              onClick={() => handleNavigate('home')}
              className="hover:text-[#FFA987] transition-colors cursor-pointer"
            >
              Home
            </button>
            <button 
              type="button"
              onClick={() => handleNavigate('explore')}
              className="hover:text-[#FFA987] transition-colors cursor-pointer"
            >
              Explore
            </button>
            <button 
              type="button"
              onClick={() => handleNavigate('map')}
              className="hover:text-[#FFA987] transition-colors cursor-pointer"
            >
              Map
            </button>
            <button 
              type="button"
              onClick={() => setIsListSpaceModalOpen(true)}
              className="text-[#FFA987] hover:text-[#FFD0BD] font-bold transition-colors cursor-pointer"
            >
              List Space
            </button>
            <button 
              type="button"
              onClick={() => handleNavigate('about')}
              className="hover:text-[#FFA987] transition-colors cursor-pointer"
            >
              About
            </button>
            <button 
              type="button"
              onClick={() => handleNavigate('help')}
              className="hover:text-[#FFA987] transition-colors cursor-pointer"
            >
              Help & FAQ
            </button>
            <button 
              type="button"
              onClick={() => handleNavigate('privacy')}
              className="hover:text-[#FFA987] transition-colors cursor-pointer"
            >
              Privacy & Terms
            </button>

            {/* General Contact (No address, only hello@ofis.ng) */}
            <a 
              href="mailto:hello@ofis.ng"
              className="text-[#FFA987] hover:text-white font-semibold transition-colors flex items-center space-x-1 ml-auto md:ml-0"
              title="Contact OFIS"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>hello@ofis.ng</span>
            </a>
          </nav>
        </div>

        {/* Bottom Utility Bar: Copyright, Powered by OFIS, Currency & Theme */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#B8D1D0]">
          
          {/* Powered by OFIS & Copyright */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] sm:text-xs">
            <span>© {new Date().getFullYear()} OFIS</span>
            <span className="text-[#166D74]">•</span>
            <span className="text-white font-bold tracking-wide">Powered by OFIS</span>
            <span className="text-[#166D74]">•</span>
            <span className="text-[#FFA987] inline-flex items-center space-x-1">
              <Zap className="w-3 h-3 fill-[#FFA987]/30 text-[#FFA987]" />
              <span>Power Guaranteed</span>
            </span>
          </div>

          {/* Right: Currency & Theme Controls */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Currency Selector */}
            <div className="flex items-center space-x-1.5 px-2 py-1 rounded-lg bg-[#0B4A50] border border-[#166D74] text-xs">
              <Globe className="w-3 h-3 text-[#FFA987]" />
              <select
                id="footer-currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
                className="bg-transparent text-[#FFFFFF] font-mono text-[11px] focus:outline-none cursor-pointer"
                aria-label="Select Currency"
              >
                {(Object.keys(CURRENCY_RATES) as SupportedCurrency[]).map((curr) => (
                  <option key={curr} value={curr} className="bg-[#0B4A50] text-[#FFFFFF]">
                    {CURRENCY_RATES[curr].symbol} {curr}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              id="footer-theme-toggle-btn"
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-[#0B4A50] hover:bg-[#105A60] border border-[#166D74] text-[#B8D1D0] hover:text-[#FFFFFF] transition-colors cursor-pointer"
              title={`Toggle ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#FFA987]" /> : <Moon className="w-3.5 h-3.5 text-[#28D2CB]" />}
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
};
