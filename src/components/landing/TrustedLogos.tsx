import React from 'react';

export const TrustedLogos: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-10 items-center justify-items-center opacity-70 hover:opacity-100 transition-opacity">
        
        {/* CC-HUB */}
        <div className="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all text-[#94A3B8] hover:text-[#F9FAFB]">
          <svg className="w-6 h-6 fill-current text-[#10B981]" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="12" cy="12" r="3.5" fill="currentColor" />
          </svg>
          <span className="font-extrabold text-sm tracking-wider">CcHUB</span>
        </div>

        {/* Ventures Park */}
        <div className="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all text-[#94A3B8] hover:text-[#F9FAFB]">
          <svg className="w-6 h-6 fill-current text-[#10B981]" viewBox="0 0 24 24">
            <polygon points="12 2 2 22 22 22" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="12" cy="16" r="2.5" fill="currentColor" />
          </svg>
          <span className="font-bold text-sm tracking-tight">VenturesPark</span>
        </div>

        {/* Paystack */}
        <div className="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all text-[#94A3B8] hover:text-[#F9FAFB]">
          <svg className="w-6 h-6 fill-current text-[#10B981]" viewBox="0 0 24 24">
            <rect x="3" y="5" width="18" height="4" rx="1.5" fill="currentColor" />
            <rect x="3" y="11" width="13" height="4" rx="1.5" fill="currentColor" />
            <rect x="3" y="17" width="18" height="4" rx="1.5" fill="currentColor" />
          </svg>
          <span className="font-bold text-sm tracking-tight">Paystack</span>
        </div>

        {/* Flutterwave */}
        <div className="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all text-[#94A3B8] hover:text-[#F9FAFB]">
          <svg className="w-6 h-6 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 14c2-5 7-8 12-8M4 18c4-6 10-9 16-9" />
          </svg>
          <span className="font-extrabold text-sm tracking-tight">Flutterwave</span>
        </div>

        {/* Workstation */}
        <div className="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all text-[#94A3B8] hover:text-[#F9FAFB]">
          <svg className="w-6 h-6 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <span className="font-bold text-sm tracking-widest uppercase">Workstation</span>
        </div>

        {/* Techstars */}
        <div className="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all text-[#94A3B8] hover:text-[#F9FAFB]">
          <svg className="w-6 h-6 text-[#10B981]" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span className="font-bold text-sm tracking-tight">Techstars</span>
        </div>

      </div>
    </div>
  );
};
