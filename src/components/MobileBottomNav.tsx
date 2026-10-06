import React from 'react';
import { 
  Compass, 
  MapPin, 
  CalendarCheck, 
  Building2,
  Wallet,
  Activity,
  Home,
  User,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    setIsDiagnosticsModalOpen,
    setIsHostPayoutModalOpen,
    setIsAiModalOpen,
    currentUser,
    switchUserRole,
    isGuest,
    openAuthModal
  } = useApp();

  if (currentView === 'details' || currentView === 'payment_result') {
    return null;
  }

  if (currentUser.role === 'host') {
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-[calc(64px+env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,0px)] bg-white/95 dark:bg-[#07383D]/95 backdrop-blur-xl border-t border-[#E2ECEB] dark:border-[#166D74] px-2 flex items-center justify-around transition-colors shadow-lg">
        <div className="h-[2px] w-full absolute top-0 left-0 bg-gradient-to-r from-[#006B70] via-[#FFA987] to-[#006B70]" />
        
        <button
          type="button"
          onClick={() => setCurrentView('host_dashboard')}
          className="flex flex-col items-center justify-center space-y-1 p-1 rounded-xl text-[#006B70] dark:text-[#28D2CB] cursor-pointer transition-transform active:scale-95"
        >
          <Building2 className="w-5 h-5 text-[#FFA987]" />
          <span className="text-[11px] font-semibold whitespace-nowrap">Hubs</span>
        </button>

        <button
          type="button"
          onClick={() => setIsHostPayoutModalOpen(true)}
          className="flex flex-col items-center justify-center space-y-1 p-1 rounded-xl text-[#5D7A7D] dark:text-[#B8D1D0] hover:text-[#FFA987] cursor-pointer transition-transform active:scale-95"
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[11px] font-medium whitespace-nowrap">Payouts</span>
        </button>

        {/* Ofis Assistant for Hosts */}
        <button
          type="button"
          onClick={() => setIsAiModalOpen(true)}
          className="flex flex-col items-center justify-center space-y-1 p-1 rounded-xl text-[#5D7A7D] dark:text-[#B8D1D0] hover:text-[#C85A32] dark:hover:text-[#FFA987] transition-all cursor-pointer active:scale-95 group"
          title="Ofis Assistant"
        >
          <MessageSquare className="w-5 h-5 text-[#C85A32] dark:text-[#FFA987]" />
          <span className="text-[10px] font-bold text-[#C85A32] dark:text-[#FFA987] whitespace-nowrap">Assistant</span>
        </button>

        <button
          type="button"
          onClick={() => setIsDiagnosticsModalOpen(true)}
          className="flex flex-col items-center justify-center space-y-1 p-1 text-[#006B70] dark:text-[#28D2CB] cursor-pointer transition-transform active:scale-95"
        >
          <div className="w-7 h-7 rounded-full bg-[#FFA987]/20 border border-[#FFA987]/50 flex items-center justify-center -mt-1 shadow-sm">
            <Activity className="w-4 h-4 text-[#FFA987]" />
          </div>
          <span className="text-[11px] font-semibold whitespace-nowrap">Health</span>
        </button>

        <button
          type="button"
          onClick={() => switchUserRole('user')}
          className="flex flex-col items-center justify-center space-y-1 p-1 rounded-xl text-[#5D7A7D] dark:text-[#B8D1D0] hover:text-[#FFA987] cursor-pointer transition-transform active:scale-95"
        >
          <Compass className="w-5 h-5" />
          <span className="text-[11px] font-medium whitespace-nowrap">Explore</span>
        </button>
      </div>
    );
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-[calc(64px+env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,0px)] bg-white/95 dark:bg-[#07383D]/95 backdrop-blur-xl border-t border-[#E2ECEB] dark:border-[#166D74] px-2 flex items-center justify-around transition-colors shadow-lg">
      <div className="h-[2px] w-full absolute top-0 left-0 bg-gradient-to-r from-[#006B70] via-[#FFA987] to-[#006B70]" />
      
      {/* 1. Home */}
      <button
        type="button"
        onClick={() => {
          setCurrentView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center space-y-1 px-2 py-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
          currentView === 'home'
            ? 'text-[#C85A32] dark:text-[#FFA987] font-bold bg-[#FFA987]/15 shadow-2xs' 
            : 'text-[#5D7A7D] dark:text-[#B8D1D0] hover:text-[#12383B] dark:hover:text-[#FFFFFF]'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[11px] whitespace-nowrap">Home</span>
      </button>

      {/* 2. Explore */}
      <button
        type="button"
        onClick={() => {
          setCurrentView('explore');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center space-y-1 px-2 py-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
          currentView === 'explore'
            ? 'text-[#C85A32] dark:text-[#FFA987] font-bold bg-[#FFA987]/15 shadow-2xs' 
            : 'text-[#5D7A7D] dark:text-[#B8D1D0] hover:text-[#12383B] dark:hover:text-[#FFFFFF]'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[11px] whitespace-nowrap">Explore</span>
      </button>

      {/* 3. Map / Around Me */}
      <button
        type="button"
        onClick={() => {
          setCurrentView('map');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center space-y-1 px-2 py-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
          currentView === 'map' 
            ? 'text-[#C85A32] dark:text-[#FFA987] font-bold bg-[#FFA987]/15 shadow-2xs' 
            : 'text-[#5D7A7D] dark:text-[#B8D1D0] hover:text-[#12383B] dark:hover:text-[#FFFFFF]'
        }`}
        title="Around Me"
      >
        <MapPin className="w-5 h-5" />
        <span className="text-[11px] whitespace-nowrap">Map</span>
      </button>

      {/* 4. Ofis Assistant */}
      <button
        type="button"
        onClick={() => setIsAiModalOpen(true)}
        className="flex flex-col items-center justify-center space-y-1 p-1 rounded-xl text-[#5D7A7D] dark:text-[#B8D1D0] hover:text-[#C85A32] dark:hover:text-[#FFA987] transition-all cursor-pointer active:scale-95 group"
        title="Ofis Assistant"
      >
        <MessageSquare className="w-5 h-5 text-[#C85A32] dark:text-[#FFA987]" />
        <span className="text-[10px] font-bold text-[#C85A32] dark:text-[#FFA987] whitespace-nowrap">Assistant</span>
      </button>

      {/* 5. Bookings / Account Tab (Clean single account trigger on phone) */}
      {!isGuest ? (
        <button
          type="button"
          onClick={() => {
            setCurrentView('bookings');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center space-y-1 px-2 py-1 rounded-xl transition-all cursor-pointer active:scale-95 ${
            currentView === 'bookings' 
              ? 'text-[#C85A32] dark:text-[#FFA987] font-bold bg-[#FFA987]/15 shadow-2xs' 
              : 'text-[#5D7A7D] dark:text-[#B8D1D0] hover:text-[#12383B] dark:hover:text-[#FFFFFF]'
          }`}
        >
          <CalendarCheck className="w-5 h-5" />
          <span className="text-[11px] whitespace-nowrap">Bookings</span>
        </button>
      ) : (
        <button
          type="button"
          id="mobile-nav-signin-btn"
          onClick={() => openAuthModal('login')}
          className="flex flex-col items-center justify-center space-y-1 px-2 py-1 rounded-xl transition-all cursor-pointer active:scale-95 text-[#5D7A7D] dark:text-[#B8D1D0] hover:text-[#C85A32] dark:hover:text-[#FFA987]"
          title="Sign In"
        >
          <User className="w-5 h-5" />
          <span className="text-[11px] whitespace-nowrap font-medium">Sign In</span>
        </button>
      )}
    </div>
  );
};


