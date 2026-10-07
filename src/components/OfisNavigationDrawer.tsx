import React from 'react';
import { 
  X, 
  Info, 
  HelpCircle, 
  Mail, 
  ShieldCheck, 
  Building2, 
  ChevronRight,
  Settings,
  Compass,
  MapPin,
  CalendarCheck,
  Bookmark,
  User,
  LogIn,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OFISWordmark } from './OFISWordmark';

export const OfisNavigationDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    setIsSettingsOpen,
    setCurrentView,
    theme,
    isGuest,
    currentUser,
    openAuthModal,
    signOut,
    savedSpaceIds
  } = useApp();

  if (!isDrawerOpen) return null;

  const handleNavigate = (view: any) => {
    setIsDrawerOpen(false);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSettings = () => {
    setIsDrawerOpen(false);
    setIsSettingsOpen(true);
  };

  const handleSignIn = () => {
    setIsDrawerOpen(false);
    openAuthModal('login');
  };

  const handleSignOut = () => {
    setIsDrawerOpen(false);
    signOut();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer on the LEFT side */}
      <aside 
        aria-label="Site navigation menu"
        className="fixed inset-y-0 left-0 max-w-sm w-full bg-white dark:bg-[#07383D] border-r border-[#E2ECEB] dark:border-[#166D74] shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-250 ease-out transition-colors"
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2ECEB] dark:border-[#166D74] flex items-center justify-between bg-[#FFF9F4] dark:bg-[#07383D]/90">
          <div 
            className="cursor-pointer transition-transform hover:opacity-95 py-0.5"
            onClick={() => handleNavigate('explore')}
            title="OFIS Workspaces"
          >
            <OFISWordmark size="lg" className="scale-110 origin-left" />
          </div>
          <button
            type="button"
            id="drawer-close-btn"
            onClick={() => setIsDrawerOpen(false)}
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl text-[#5D7A7D] dark:text-[#B8D1D0] hover:text-[#12383B] dark:hover:text-[#FFFFFF] hover:bg-[#E2ECEB] dark:hover:bg-[#105A60] transition-colors cursor-pointer flex items-center justify-center"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1 text-sm">
          
          {/* Primary Paths: Workspaces & Bookings */}
          <div className="space-y-1">
            <p className="text-[11px] font-mono font-bold uppercase text-[#5D7A7D] dark:text-[#B8D1D0] tracking-wider px-2 pb-1">
              Workspaces & Bookings
            </p>

            <button
              type="button"
              id="drawer-explore-spaces-btn"
              onClick={() => handleNavigate('explore')}
              className="w-full min-h-[44px] flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F1F6F5] dark:hover:bg-[#0B4A50] text-xs font-semibold text-[#12383B] dark:text-[#FFFFFF] transition-colors cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <Compass className="w-4 h-4 text-[#14BEB8] dark:text-[#28D2CB] group-hover:scale-110 transition-transform" />
                <span className="font-bold">Explore Workspaces</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#5D7A7D] dark:text-[#B8D1D0]" />
            </button>

            <button
              type="button"
              id="drawer-interactive-map-btn"
              onClick={() => handleNavigate('map')}
              className="w-full min-h-[44px] flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F1F6F5] dark:hover:bg-[#0B4A50] text-xs font-semibold text-[#12383B] dark:text-[#FFFFFF] transition-colors cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-[#14BEB8] dark:text-[#28D2CB] group-hover:scale-110 transition-transform" />
                <span className="font-bold">Interactive Map</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#5D7A7D] dark:text-[#B8D1D0]" />
            </button>

            <button
              type="button"
              id="drawer-my-bookings-btn"
              onClick={() => handleNavigate('bookings')}
              className="w-full min-h-[44px] flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F1F6F5] dark:hover:bg-[#0B4A50] text-xs font-semibold text-[#12383B] dark:text-[#FFFFFF] transition-colors cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <CalendarCheck className="w-4 h-4 text-[#14BEB8] dark:text-[#28D2CB] group-hover:scale-110 transition-transform" />
                <span className="font-bold">My Bookings & Passes</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#5D7A7D] dark:text-[#B8D1D0]" />
            </button>
          </div>

          {/* Primary Path: Host Platform */}
          <div className="space-y-1">
            <p className="text-[11px] font-mono font-bold uppercase text-[#5D7A7D] dark:text-[#B8D1D0] tracking-wider px-2 pb-1">
              For Space Hosts
            </p>

            <button
              type="button"
              id="drawer-host-platform-btn"
              onClick={() => handleNavigate('become_host')}
              className="w-full min-h-[44px] flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-[#14BEB8]/15 via-[#14BEB8]/10 to-transparent dark:from-[#0B4A50] dark:to-[#07383D] border border-[#14BEB8]/30 hover:border-[#14BEB8] text-xs font-bold text-[#006B70] dark:text-[#28D2CB] transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-1.5 rounded-xl bg-[#14BEB8]/20 dark:bg-[#14BEB8]/30 text-[#006B70] dark:text-[#28D2CB]">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-extrabold text-[#12383B] dark:text-white">Host Platform</div>
                  <div className="text-[10px] text-[#5D7A7D] dark:text-[#B8D1D0] font-normal">
                    List space & host verified hubs
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#14BEB8] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Primary Path: User Account & Saved */}
          <div className="space-y-1">
            <p className="text-[11px] font-mono font-bold uppercase text-[#5D7A7D] dark:text-[#B8D1D0] tracking-wider px-2 pb-1">
              Account
            </p>

            {!isGuest ? (
              <>
                <button
                  type="button"
                  id="drawer-wallet-dashboard-btn"
                  onClick={() => handleNavigate('user_dashboard')}
                  className="w-full min-h-[44px] flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F1F6F5] dark:hover:bg-[#0B4A50] text-xs font-semibold text-[#12383B] dark:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-[#14BEB8] dark:text-[#28D2CB]" />
                    <span className="font-bold">My Account ({currentUser.name.split(' ')[0]})</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#5D7A7D] dark:text-[#B8D1D0]" />
                </button>

                <button
                  type="button"
                  id="drawer-saved-spaces-btn"
                  onClick={() => handleNavigate('saved')}
                  className="w-full min-h-[44px] flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F1F6F5] dark:hover:bg-[#0B4A50] text-xs font-semibold text-[#12383B] dark:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <Bookmark className="w-4 h-4 text-[#14BEB8] dark:text-[#28D2CB]" />
                    <span>Saved Workspaces</span>
                  </div>
                  {savedSpaceIds.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FFA987] text-[#07383D] font-black text-[10px]">
                      {savedSpaceIds.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  id="drawer-signout-btn"
                  onClick={handleSignOut}
                  className="w-full min-h-[44px] flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-semibold text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </div>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  id="drawer-signin-btn"
                  onClick={handleSignIn}
                  className="w-full min-h-[44px] flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-[#006B70]/15 to-[#FFA987]/15 border border-[#14BEB8]/30 hover:border-[#14BEB8] text-xs font-bold text-[#006B70] dark:text-[#28D2CB] transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <LogIn className="w-4 h-4 text-[#FFA987]" />
                    <span>Sign In / Create Account</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#5D7A7D] dark:text-[#B8D1D0]" />
                </button>

                <button
                  type="button"
                  id="drawer-saved-spaces-guest-btn"
                  onClick={() => handleNavigate('saved')}
                  className="w-full min-h-[44px] flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F1F6F5] dark:hover:bg-[#0B4A50] text-xs font-semibold text-[#12383B] dark:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <Bookmark className="w-4 h-4 text-[#14BEB8] dark:text-[#28D2CB]" />
                    <span>Saved Workspaces</span>
                  </div>
                  {savedSpaceIds.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FFA987] text-[#07383D] font-black text-[10px]">
                      {savedSpaceIds.length}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Group 4: Support & Legal */}
          <div className="space-y-1">
            <p className="text-[11px] font-mono font-bold uppercase text-[#5D7A7D] dark:text-[#B8D1D0] tracking-wider px-2 pb-1">
              Support & Legal
            </p>

            <button
              type="button"
              id="drawer-about-btn"
              onClick={() => handleNavigate('about')}
              className="w-full min-h-[44px] flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F1F6F5] dark:hover:bg-[#0B4A50] text-xs font-semibold text-[#12383B] dark:text-[#FFFFFF] transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <Info className="w-4 h-4 text-[#14BEB8] dark:text-[#28D2CB]" />
                <span>About OFIS</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#5D7A7D] dark:text-[#B8D1D0]" />
            </button>

            <button
              type="button"
              id="drawer-faq-btn"
              onClick={() => handleNavigate('faq')}
              className="w-full min-h-[44px] flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F1F6F5] dark:hover:bg-[#0B4A50] text-xs font-semibold text-[#12383B] dark:text-[#FFFFFF] transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-4 h-4 text-[#14BEB8] dark:text-[#28D2CB]" />
                <span>Help & FAQ</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#5D7A7D] dark:text-[#B8D1D0]" />
            </button>

            <button
              type="button"
              id="drawer-contact-support-btn"
              onClick={() => handleNavigate('contact')}
              className="w-full min-h-[44px] flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F1F6F5] dark:hover:bg-[#0B4A50] text-xs font-semibold text-[#12383B] dark:text-[#FFFFFF] transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#14BEB8] dark:text-[#28D2CB]" />
                <span>Contact Us</span>
              </div>
              <span className="text-[11px] text-[#006B70] dark:text-[#28D2CB] font-mono">hello@ofis.ng</span>
            </button>

            <button
              type="button"
              id="drawer-settings-btn"
              onClick={handleOpenSettings}
              className="w-full min-h-[44px] flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F1F6F5] dark:hover:bg-[#0B4A50] text-xs font-semibold text-[#12383B] dark:text-[#FFFFFF] transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <Settings className="w-4 h-4 text-[#14BEB8] dark:text-[#28D2CB]" />
                <span>Appearance & Currency</span>
              </div>
              <span className="text-[10px] text-[#5D7A7D] dark:text-[#B8D1D0] capitalize">
                {theme}
              </span>
            </button>

            <button
              type="button"
              id="drawer-privacy-policy-btn"
              onClick={() => handleNavigate('privacy')}
              className="w-full min-h-[44px] flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F1F6F5] dark:hover:bg-[#0B4A50] text-xs font-semibold text-[#5D7A7D] dark:text-[#B8D1D0] transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-4 h-4 text-[#5D7A7D] dark:text-[#B8D1D0]" />
                <span>Privacy Policy & Terms</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#5D7A7D] dark:text-[#B8D1D0]" />
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#E2ECEB] dark:border-[#166D74] bg-[#FFF9F4] dark:bg-[#07383D]">
          <div className="text-[11px] text-[#5D7A7D] dark:text-[#B8D1D0] font-mono flex items-center justify-between">
            <span>Powered by OFIS</span>
            <span className="text-[#006B70] dark:text-[#14BEB8] font-bold">● Nigeria</span>
          </div>
        </div>

      </aside>
    </div>
  );
};
