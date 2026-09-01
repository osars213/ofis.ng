import React from 'react';
import { Compass, ArrowRight, Home, Search, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotFoundPage: React.FC = () => {
  const { setCurrentView, updateFilter } = useApp();

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#111827] dark:text-[#F8FAFC] transition-colors duration-150 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] shadow-2xl">
        
        <div className="w-20 h-20 rounded-3xl bg-[#D1FAE5] dark:bg-[#10B981]/15 text-[#10B981] flex items-center justify-center mx-auto border border-[#10B981]/30">
          <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '10s' }} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#10B981]">
            404 Error • Page Not Found
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Lost in Space?
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">
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
            className="w-full py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
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
            className="w-full py-3.5 rounded-2xl bg-[#F1F5F9] dark:bg-[#1E293B] hover:bg-[#E2E8F0] dark:hover:bg-[#374151] text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Explore Verified Spaces</span>
          </button>
        </div>

      </div>
    </div>
  );
};
