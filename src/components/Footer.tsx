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
    <footer className="bg-[#07383D] text-[#B8D1D0] border-t border-[#166D74] py-3 transition-colors relative overflow-hidden">
      {/* Brand Accent Top Line */}
      <div className="h-[2px] w-full absolute top-0 left-0 bg-gradient-to-r from-[#006B70] via-[#14BEB8] via-[#FFA987] to-[#006B70]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2.5">
        
        {/* Compact Single/Multi-Col Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
          
          {/* Brand Wordmark & Tag */}
          <div className="flex items-center gap-3 shrink-0">
            <div 
              className="cursor-pointer transition-transform hover:opacity-90 inline-block" 
              onClick={() => handleNavigate('home')}
              title="OFIS Home"
            >
              <OFISWordmark size="sm" theme="dark" />
            </div>
            <span className="hidden sm:inline-block text-[#166D74]">•</span>
            <span className="text-[11px] text-[#B8D1D0] hidden sm:inline">
              100% Power SLA Guaranteed
            </span>
          </div>

          {/* Compact Inline Navigation Links */}
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-[#B8D1D0]">
            <button 
              type="button"
              onClick={() => handleNavigate('explore')}
              className="text-white hover:text-[#FFA987] font-bold transition-colors cursor-pointer"
            >
              Explore
            </button>
            <button 
              type="button"
              onClick={() => handleNavigate('map')}
              className="text-white hover:text-[#FFA987] font-bold transition-colors cursor-pointer"
            >
              Map
            </button>
            <button 
              type="button"
              onClick={() => handleNavigate('become_host')}
              className="text-[#FFA987] hover:text-[#FFD0BD] font-bold transition-colors cursor-pointer"
            >
              Host Platform
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
              className="text-[#FFA987] hover:text-white font-semibold transition-colors flex items-center space-x-1"
              title="Contact OFIS"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>hello@ofis.ng</span>
            </a>
          </nav>
        </div>

        {/* Ultra-Slim Bottom Utility Bar: Copyright, Powered by OFIS, Currency & Theme */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-[#166D74]/40 text-[11px] text-[#B8D1D0]">
          
          {/* Powered by OFIS & Copyright */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
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
            <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded-md bg-[#0B4A50] border border-[#166D74] text-[11px]">
              <Globe className="w-3 h-3 text-[#FFA987]" />
              <select
                id="footer-currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
                className="bg-transparent text-[#FFFFFF] font-mono text-[10px] focus:outline-none cursor-pointer"
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
              className="p-1 rounded-md bg-[#0B4A50] hover:bg-[#105A60] border border-[#166D74] text-[#B8D1D0] hover:text-[#FFFFFF] transition-colors cursor-pointer"
              title={`Toggle ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-3 h-3 text-[#FFA987]" /> : <Moon className="w-3 h-3 text-[#28D2CB]" />}
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
};
