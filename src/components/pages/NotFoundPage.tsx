import React from 'react';
import { Compass, ArrowRight, Home, Search, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotFoundPage: React.FC = () => {
  const { setCurrentView, updateFilter } = useApp();

  return (
    <div className="min-h-screen bg-[#FFF9F4] dark:bg-[#07383D] text-[#12383B] dark:text-[#FFFFFF] transition-colors duration-150 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] shadow-2xl">
        
        <div className="w-20 h-20 rounded-3xl bg-[#006B70]/15 dark:bg-[#006B70]/20 text-[#006B70] dark:text-[#28D2CB] flex items-center justify-center mx-auto border border-[#006B70]/30 shadow-sm">
          <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '10s' }} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#006B70] dark:text-[#28D2CB]">
            404 Error • Page Not Found
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#12383B] dark:text-[#FFFFFF]">
            Lost in Space?
          </h1>
          <p className="text-xs sm:text-sm text-[#5D7A7D] dark:text-[#B8D1D0] leading-relaxed">
            The workspace or route you were looking for doesn&apos;t seem to exist or has been relocated.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full py-3.5 rounded-2xl bg-[#006B70] hover:bg-[#0EA8A2] text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>

          <button
            type="button"
            onClick={() => {
              updateFilter('city', 'All Cities');
              updateFilter('searchQuery', '');
              setCurrentView('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full py-3.5 rounded-2xl bg-[#F1F6F5] dark:bg-[#07383D] hover:bg-[#E2ECEB] dark:hover:bg-[#105A60] text-[#12383B] dark:text-[#FFFFFF] text-xs font-bold border border-[#E2ECEB] dark:border-[#166D74] transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <Search className="w-4 h-4 text-[#006B70] dark:text-[#28D2CB]" />
            <span>Explore Verified Spaces</span>
          </button>
        </div>

      </div>
    </div>
  );
};
