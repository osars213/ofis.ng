import React from 'react';

interface Partner {
  id: string;
  name: string;
  node: React.ReactNode;
}

const PARTNER_ITEMS: Partner[] = [
  {
    id: 'szndpay',
    name: 'Szndpay',
    node: (
      <div className="flex items-center space-x-2.5 grayscale hover:grayscale-0 transition-all text-[#94A3B8] hover:text-white shrink-0 px-6 sm:px-8 py-2">
        <div className="w-7 h-7 rounded-lg bg-[#0F766E]/20 border border-[#0F766E]/40 flex items-center justify-center text-[#14B8A6] shadow-[0_0_12px_rgba(20,184,166,0.2)]">
          <svg className="w-4 h-4 text-[#14B8A6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="3" fill="currentColor" fillOpacity="0.15" />
            <line x1="2" y1="10" x2="22" y2="10" />
            <path d="M6 15h3" />
            <circle cx="17" cy="15" r="1.5" fill="currentColor" />
          </svg>
        </div>
        <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">Szndpay</span>
      </div>
    )
  },
  {
    id: 'cchub',
    name: 'CcHUB',
    node: (
      <div className="flex items-center space-x-2.5 grayscale hover:grayscale-0 transition-all text-[#94A3B8] hover:text-white shrink-0 px-6 sm:px-8 py-2">
        <svg className="w-6 h-6 fill-current text-[#14B8A6]" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="12" cy="12" r="3.5" fill="currentColor" />
        </svg>
        <span className="font-extrabold text-sm sm:text-base tracking-wider">CcHUB</span>
      </div>
    )
  },
  {
    id: 'paystack',
    name: 'Paystack',
    node: (
      <div className="flex items-center space-x-2.5 grayscale hover:grayscale-0 transition-all text-[#94A3B8] hover:text-white shrink-0 px-6 sm:px-8 py-2">
        <svg className="w-6 h-6 fill-current text-[#14B8A6]" viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="4" rx="1.5" fill="currentColor" />
          <rect x="3" y="11" width="13" height="4" rx="1.5" fill="currentColor" />
          <rect x="3" y="17" width="18" height="4" rx="1.5" fill="currentColor" />
        </svg>
        <span className="font-bold text-sm sm:text-base tracking-tight">Paystack</span>
      </div>
    )
  },
  {
    id: 'venturespark',
    name: 'Ventures Park',
    node: (
      <div className="flex items-center space-x-2.5 grayscale hover:grayscale-0 transition-all text-[#94A3B8] hover:text-white shrink-0 px-6 sm:px-8 py-2">
        <svg className="w-6 h-6 fill-current text-[#14B8A6]" viewBox="0 0 24 24">
          <polygon points="12 2 2 22 22 22" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="12" cy="16" r="2.5" fill="currentColor" />
        </svg>
        <span className="font-bold text-sm sm:text-base tracking-tight">VenturesPark</span>
      </div>
    )
  },
  {
    id: 'flutterwave',
    name: 'Flutterwave',
    node: (
      <div className="flex items-center space-x-2.5 grayscale hover:grayscale-0 transition-all text-[#94A3B8] hover:text-white shrink-0 px-6 sm:px-8 py-2">
        <svg className="w-6 h-6 text-[#14B8A6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 14c2-5 7-8 12-8M4 18c4-6 10-9 16-9" />
        </svg>
        <span className="font-extrabold text-sm sm:text-base tracking-tight">Flutterwave</span>
      </div>
    )
  },
  {
    id: 'workstation',
    name: 'Workstation',
    node: (
      <div className="flex items-center space-x-2.5 grayscale hover:grayscale-0 transition-all text-[#94A3B8] hover:text-white shrink-0 px-6 sm:px-8 py-2">
        <svg className="w-6 h-6 text-[#14B8A6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span className="font-bold text-sm sm:text-base tracking-widest uppercase">Workstation</span>
      </div>
    )
  },
  {
    id: 'techstars',
    name: 'Techstars',
    node: (
      <div className="flex items-center space-x-2.5 grayscale hover:grayscale-0 transition-all text-[#94A3B8] hover:text-white shrink-0 px-6 sm:px-8 py-2">
        <svg className="w-6 h-6 text-[#14B8A6]" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span className="font-bold text-sm sm:text-base tracking-tight">Techstars</span>
      </div>
    )
  },
  {
    id: 'edenlife',
    name: 'Eden Life',
    node: (
      <div className="flex items-center space-x-2.5 grayscale hover:grayscale-0 transition-all text-[#94A3B8] hover:text-white shrink-0 px-6 sm:px-8 py-2">
        <svg className="w-6 h-6 text-[#14B8A6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span className="font-bold text-sm sm:text-base tracking-tight">Eden Life</span>
      </div>
    )
  }
];

export const TrustedLogos: React.FC = () => {
  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-hidden py-3">
      {/* Edge gradient masks for continuous fade */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-r from-[#071521] via-[#071521]/80 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 z-10 bg-gradient-to-l from-[#071521] via-[#071521]/80 to-transparent" />

      {/* Revolving infinite track */}
      <div className="animate-marquee-revolve items-center">
        {/* Set 1 */}
        <div className="flex items-center shrink-0">
          {PARTNER_ITEMS.map((partner) => (
            <React.Fragment key={`set1-${partner.id}`}>
              {partner.node}
            </React.Fragment>
          ))}
        </div>

        {/* Set 2 (Identical clone for seamless continuous revolution) */}
        <div className="flex items-center shrink-0" aria-hidden="true">
          {PARTNER_ITEMS.map((partner) => (
            <React.Fragment key={`set2-${partner.id}`}>
              {partner.node}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
