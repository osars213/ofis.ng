import React from 'react';
import { 
  MapPin, 
  CalendarCheck, 
  Building2,
  Wallet,
  Bookmark,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    setIsHostPayoutModalOpen,
    currentUser,
    switchUserRole,
    savedSpaceIds
  } = useApp();

  if (currentView === 'details' || currentView === 'payment_result') {
    return null;
  }

  // Host Mode Bottom Navigation (Clean, touch-friendly, no Home/Assistant)
  if (currentUser.role === 'host') {
    return (
      <nav 
        aria-label="Host mobile navigation" 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-[calc(60px+env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,0px)] bg-white/95 dark:bg-[#07383D]/95 backdrop-blur-xl border-t border-[#E2ECEB] dark:border-[#166D74] px-4 flex items-center justify-around transition-colors shadow-lg"
      >
        <div className="h-[2px] w-full absolute top-0 left-0 bg-gradient-to-r from-[#006B70] via-[#14BEB8] via-[#FFA987] to-[#006B70]" />
        
        <button
          type="button"
          onClick={() => setCurrentView('host_dashboard')}
          className={`flex flex-col items-center justify-center space-y-1 min-w-[56px] min-h-[44px] p-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
            currentView === 'host_dashboard'
              ? 'text-[#14BEB8] dark:text-[#28D2CB] font-bold'
              : 'text-[#5D7A7D] dark:text-[#B8D1D0] hover:text-[#12383B] dark:hover:text-[#FFFFFF]'
          }`}
          title="Host Platform Dashboard"
        >
          <Building2 className="w-5 h-5 text-[#FFA987]" />
          <span className="text-[11px] font-semibold whitespace-nowrap">Hubs</span>
        </button>

        <button
          type="button"
          onClick={() => setIsHostPayoutModalOpen(true)}
          className="flex flex-col items-center justify-center space-y-1 min-w-[56px] min-h-[44px] p-1 rounded-xl text-[#5D7A7D] dark:text-[#B8D1D0] hover:text-[#FFA987] transition-all cursor-pointer active:scale-95"
          title="Host Payouts"
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[11px] font-medium whitespace-nowrap">Payouts</span>
        </button>

        <button
          type="button"
          onClick={() => switchUserRole('user')}
          className="flex flex-col items-center justify-center space-y-1 min-w-[56px] min-h-[44px] p-1 rounded-xl text-[#5D7A7D] dark:text-[#B8D1D0] hover:text-[#14BEB8] transition-all cursor-pointer active:scale-95"
          title="Switch to Guest View"
        >
          <User className="w-5 h-5" />
          <span className="text-[11px] font-medium whitespace-nowrap">Guest View</span>
        </button>
      </nav>
    );
  }

  // Standard User Mode Bottom Navigation (Touch-Friendly Tabs: Map, Saved, Bookings)
  return (
    <nav 
      aria-label="Mobile navigation" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-[calc(60px+env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,0px)] bg-white/95 dark:bg-[#07383D]/95 backdrop-blur-xl border-t border-[#E2ECEB] dark:border-[#166D74] px-4 flex items-center justify-around transition-colors shadow-lg"
    >
      <div className="h-[2px] w-full absolute top-0 left-0 bg-gradient-to-r from-[#006B70] via-[#14BEB8] via-[#FFA987] to-[#006B70]" />
      
      {/* 1. Map / Around Me */}
      <button
        type="button"
        id="mobile-nav-map-btn"
        onClick={() => {
          setCurrentView('map');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center space-y-1 min-w-[56px] min-h-[44px] px-2 py-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
          currentView === 'map' 
            ? 'text-[#006B70] dark:text-[#28D2CB] font-bold bg-[#14BEB8]/15 dark:bg-[#14BEB8]/20' 
            : 'text-[#5D7A7D] dark:text-[#B8D1D0] hover:text-[#12383B] dark:hover:text-[#FFFFFF]'
        }`}
        title="Interactive Map"
      >
        <MapPin className="w-5 h-5" />
        <span className="text-[11px] whitespace-nowrap">Map</span>
      </button>

      {/* 2. Saved Spaces */}
      <button
        type="button"
        id="mobile-nav-saved-btn"
        onClick={() => {
          setCurrentView('saved');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center space-y-1 min-w-[56px] min-h-[44px] px-2 py-1 rounded-xl transition-all cursor-pointer active:scale-95 relative ${
          currentView === 'saved' 
            ? 'text-[#006B70] dark:text-[#28D2CB] font-bold bg-[#14BEB8]/15 dark:bg-[#14BEB8]/20' 
            : 'text-[#5D7A7D] dark:text-[#B8D1D0] hover:text-[#12383B] dark:hover:text-[#FFFFFF]'
        }`}
        title="Saved Spaces"
      >
        <div className="relative">
          <Bookmark className="w-5 h-5" />
          {savedSpaceIds.length > 0 && (
            <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full bg-[#FFA987] text-[#07383D] text-[9px] font-black">
              {savedSpaceIds.length}
            </span>
          )}
        </div>
        <span className="text-[11px] whitespace-nowrap">Saved</span>
      </button>

      {/* 3. Bookings */}
      <button
        type="button"
        id="mobile-nav-bookings-btn"
        onClick={() => {
          setCurrentView('bookings');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center space-y-1 min-w-[56px] min-h-[44px] px-2 py-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
          currentView === 'bookings' 
            ? 'text-[#006B70] dark:text-[#28D2CB] font-bold bg-[#14BEB8]/15 dark:bg-[#14BEB8]/20' 
            : 'text-[#5D7A7D] dark:text-[#B8D1D0] hover:text-[#12383B] dark:hover:text-[#FFFFFF]'
        }`}
        title="My Bookings"
      >
        <CalendarCheck className="w-5 h-5" />
        <span className="text-[11px] whitespace-nowrap">Bookings</span>
      </button>
    </nav>
  );
};
