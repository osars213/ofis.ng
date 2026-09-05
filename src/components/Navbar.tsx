import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, 
  MapPin,
  Bookmark, 
  CalendarCheck, 
  Sparkles, 
  PlusCircle, 
  Menu, 
  Bell, 
  Settings, 
  User, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  ChevronDown, 
  RefreshCw, 
  Building2, 
  Activity, 
  UserPlus,
  Palette,
  Smartphone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OFISWordmark } from './OFISWordmark';
import { NotificationCenterDropdown } from './NotificationCenterDropdown';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    currentView,
    setCurrentView,
    savedSpaceIds,
    unreadNotificationsCount,
    openAuthModal,
    setIsListSpaceModalOpen,
    setIsAiModalOpen,
    setIsDrawerOpen,
    setIsSettingsOpen,
    setIsDiagnosticsModalOpen,
    setIsAdminReviewModalOpen,
    setIsDownloadAppModalOpen,
    pendingSpacesCount,
    signOut,
    isGuest,
    switchUserRole,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationButtonRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#101827]/95 backdrop-blur-md border-b border-[#E5E7EB] dark:border-[#1E293B] transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[70px] flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center shrink-0">
          <div 
            className="flex items-center cursor-pointer transition-opacity hover:opacity-90 py-1" 
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.delete('app');
              window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
              window.dispatchEvent(new PopStateEvent('popstate'));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            title="OFIS Home"
          >
            <OFISWordmark size="md" />
          </div>
        </div>

        {/* Center: Desktop Navigation Links (Clean, Uncramped, Typography-Focused) */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-xs font-semibold">
          <button
            type="button"
            id="nav-home-btn"
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              currentView === 'home' 
                ? 'bg-[#D1FAE5] dark:bg-[#10B981]/15 text-[#047857] dark:text-[#10B981] font-bold shadow-2xs' 
                : 'text-[#4B5563] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#172033]'
            }`}
          >
            Home
          </button>

          <button
            type="button"
            id="nav-explore-btn"
            onClick={() => {
              setCurrentView('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              currentView === 'explore' || currentView === 'details'
                ? 'bg-[#D1FAE5] dark:bg-[#10B981]/15 text-[#047857] dark:text-[#10B981] font-bold shadow-2xs' 
                : 'text-[#4B5563] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#172033]'
            }`}
          >
            Explore
          </button>

          <button
            type="button"
            id="nav-around-me-btn"
            onClick={() => {
              setCurrentView('map');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              currentView === 'map' 
                ? 'bg-[#D1FAE5] dark:bg-[#10B981]/15 text-[#047857] dark:text-[#10B981] font-bold shadow-2xs' 
                : 'text-[#4B5563] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#172033]'
            }`}
          >
            Map
          </button>

          <button
            type="button"
            id="nav-bookings-btn"
            onClick={() => {
              setCurrentView('bookings');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              currentView === 'bookings' 
                ? 'bg-[#D1FAE5] dark:bg-[#10B981]/15 text-[#047857] dark:text-[#10B981] font-bold shadow-2xs' 
                : 'text-[#4B5563] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#172033]'
            }`}
          >
            Bookings
          </button>

          <button
            type="button"
            id="nav-saved-btn"
            onClick={() => {
              setCurrentView('saved');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
              currentView === 'saved' 
                ? 'bg-[#D1FAE5] dark:bg-[#10B981]/15 text-[#047857] dark:text-[#10B981] font-bold shadow-2xs' 
                : 'text-[#4B5563] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#172033]'
            }`}
          >
            <span>Saved</span>
            {savedSpaceIds.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#047857] dark:bg-[#10B981] text-white font-bold text-[10px] flex items-center justify-center">
                {savedSpaceIds.length}
              </span>
            )}
          </button>

          <button
            type="button"
            id="nav-contact-btn"
            onClick={() => {
              setCurrentView('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              currentView === 'contact' 
                ? 'bg-[#D1FAE5] dark:bg-[#10B981]/15 text-[#047857] dark:text-[#10B981] font-bold shadow-2xs' 
                : 'text-[#4B5563] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#172033]'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Right Side: List Space CTA, Notifications, Avatar, Mobile Menu */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">

          {/* List Space CTA (Responsive) */}
          <button
            type="button"
            id="navbar-list-space-btn"
            onClick={() => setIsListSpaceModalOpen(true)}
            className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#172033] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#1E293B] text-xs font-semibold text-[#111827] dark:text-[#F8FAFC] hover:border-[#10B981]/50 transition-all cursor-pointer shadow-2xs"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#047857] dark:text-[#10B981]" />
            <span>List Space</span>
          </button>

          {/* Header Notification Center Bell */}
          <div className="relative" ref={notificationButtonRef}>
            <button
              type="button"
              id="navbar-notifications-btn"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={`p-2 rounded-xl border transition-all cursor-pointer relative ${
                isNotificationsOpen 
                  ? 'bg-[#D1FAE5] dark:bg-[#10B981]/15 border-[#10B981] text-[#047857] dark:text-[#10B981]' 
                  : 'bg-[#F1F5F9] dark:bg-[#172033] hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B] border-[#E5E7EB] dark:border-[#1E293B] text-[#4B5563] hover:text-[#111827] dark:text-[#94A3B8] dark:hover:text-[#F8FAFC]'
              }`}
              title="Notifications & Space Availability Alerts"
              aria-label="View notifications and availability alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[1.125rem] h-4 px-1 rounded-full bg-[#047857] dark:bg-[#10B981] text-white text-[10px] font-black flex items-center justify-center shadow-lg animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Container */}
            <NotificationCenterDropdown
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
            />
          </div>

          {/* User Account / Sign In Dropdown */}
          <div className="relative" ref={userMenuRef}>
            {isGuest ? (
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  id="navbar-guest-direct-login-btn"
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  id="navbar-user-profile-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-1.5 rounded-xl bg-[#F1F5F9] dark:bg-[#1F2937] hover:bg-[#E2E8F0] dark:hover:bg-[#374151] border border-[#E5E7EB] dark:border-[#374151] text-xs transition-all cursor-pointer"
                  title="Account Options"
                  aria-label="Account Options"
                >
                  <ChevronDown className={`w-3.5 h-3.5 text-[#6B7280] dark:text-[#9CA3AF] transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                id="navbar-user-profile-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#F1F5F9] dark:bg-[#1F2937] hover:bg-[#E2E8F0] dark:hover:bg-[#374151] border border-[#E5E7EB] dark:border-[#374151] text-xs transition-all cursor-pointer group"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-[#16A34A]"
                />
                <span className="hidden sm:inline font-semibold text-[#111827] dark:text-[#F9FAFB] max-w-[90px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#6B7280] dark:text-[#9CA3AF] transition-transform ${isUserMenuOpen ? 'rotate-180 text-[#16A34A]' : ''}`} />
              </button>
            )}

            {/* Profile Dropdown Popover */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] shadow-xl p-2.5 space-y-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                
                {/* User Info Header */}
                <div className="p-2.5 rounded-xl bg-[#F1F5F9] dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#374151] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111827] dark:text-[#F9FAFB] truncate">{currentUser.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[#DCFCE7] dark:bg-[#16A34A]/15 text-[#16A34A]">
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] truncate">{currentUser.email}</p>
                </div>

                {/* Switch Role Trigger */}
                <button
                  type="button"
                  id="menu-switch-role-btn"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    switchUserRole(currentUser.role === 'user' ? 'host' : 'user');
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs text-[#4B5563] dark:text-[#D1D5DB] hover:text-[#111827] dark:hover:text-[#F9FAFB] hover:bg-[#F1F5F9] dark:hover:bg-[#374151] transition-colors text-left cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-[#16A34A]" />
                  <span>Switch to {currentUser.role === 'user' ? 'Host Mode' : 'Guest Mode'}</span>
                </button>

                {/* User Dashboard Link */}
                <button
                  type="button"
                  id="menu-user-dashboard-btn"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setCurrentView('user_dashboard');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs text-[#4B5563] dark:text-[#D1D5DB] hover:text-[#111827] dark:hover:text-[#F9FAFB] hover:bg-[#F1F5F9] dark:hover:bg-[#374151] transition-colors text-left cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#16A34A]" />
                  <span>My Account Dashboard</span>
                </button>

                {/* Host Dashboard Link (Host Only) */}
                {currentUser.role === 'host' && (
                  <button
                    type="button"
                    id="menu-host-dashboard-btn"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setCurrentView('host_dashboard');
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs text-[#4B5563] dark:text-[#D1D5DB] hover:text-[#111827] dark:hover:text-[#F9FAFB] hover:bg-[#F1F5F9] dark:hover:bg-[#374151] transition-colors text-left cursor-pointer"
                  >
                    <Building2 className="w-4 h-4 text-[#16A34A]" />
                    <span>Host Operations Portal</span>
                  </button>
                )}

                {/* Admin Verification Portal Link */}
                <button
                  type="button"
                  id="menu-admin-verification-btn"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsAdminReviewModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#4B5563] dark:text-[#D1D5DB] hover:text-[#111827] dark:hover:text-[#F9FAFB] hover:bg-[#F1F5F9] dark:hover:bg-[#374151] transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                    <span>Admin Review Portal</span>
                  </div>
                  {pendingSpacesCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#F59E0B] text-white">
                      {pendingSpacesCount}
                    </span>
                  )}
                </button>

                {/* My Bookings Shortcut */}
                <button
                  type="button"
                  id="menu-my-bookings-btn"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setCurrentView('bookings');
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs text-[#4B5563] dark:text-[#D1D5DB] hover:text-[#111827] dark:hover:text-[#F9FAFB] hover:bg-[#F1F5F9] dark:hover:bg-[#374151] transition-colors text-left cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4 text-[#16A34A]" />
                  <span>My Bookings & Passes</span>
                </button>

                {/* Saved Spaces Shortcut */}
                <button
                  type="button"
                  id="menu-saved-spaces-btn"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setCurrentView('saved');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#4B5563] dark:text-[#D1D5DB] hover:text-[#111827] dark:hover:text-[#F9FAFB] hover:bg-[#F1F5F9] dark:hover:bg-[#374151] transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <Bookmark className="w-4 h-4 text-[#16A34A]" />
                    <span>Saved Spaces</span>
                  </div>
                  {savedSpaceIds.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#16A34A] text-white">
                      {savedSpaceIds.length}
                    </span>
                  )}
                </button>

                {/* Host Diagnostics Trigger */}
                {currentUser.role === 'host' && (
                  <button
                    type="button"
                    id="menu-diagnostics-btn"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsDiagnosticsModalOpen(true);
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs text-[#4B5563] dark:text-[#D1D5DB] hover:text-[#111827] dark:hover:text-[#F9FAFB] hover:bg-[#F1F5F9] dark:hover:bg-[#374151] transition-colors text-left cursor-pointer"
                  >
                    <Activity className="w-4 h-4 text-[#16A34A]" />
                    <span>System Diagnostics</span>
                  </button>
                )}

                {/* Profile Edit Trigger */}
                <button
                  type="button"
                  id="menu-edit-profile-btn"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    openAuthModal('profile');
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs text-[#4B5563] dark:text-[#D1D5DB] hover:text-[#111827] dark:hover:text-[#F9FAFB] hover:bg-[#F1F5F9] dark:hover:bg-[#374151] transition-colors text-left cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#16A34A]" />
                  <span>Edit Profile & Account</span>
                </button>

                {/* Platform Settings Trigger */}
                <button
                  type="button"
                  id="menu-settings-btn"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsSettingsOpen(true);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs text-[#4B5563] dark:text-[#D1D5DB] hover:text-[#111827] dark:hover:text-[#F9FAFB] hover:bg-[#F1F5F9] dark:hover:bg-[#374151] transition-colors text-left cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-[#16A34A]" />
                  <span>Settings & Theme Preferences</span>
                </button>

                {/* Download Mobile App */}
                <button
                  type="button"
                  id="menu-download-app-btn"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsDownloadAppModalOpen(true);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#10B981] hover:bg-[#10B981]/10 transition-colors text-left cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-[#10B981]" />
                  <span>Download Mobile App</span>
                </button>

                {/* Auth Actions (Sign In / Sign Up vs Sign Out) */}
                <div className="pt-1 border-t border-[#E5E7EB] dark:border-[#374151] space-y-1">
                  {isGuest ? (
                    <>
                      <button
                        type="button"
                        id="menu-sign-up-btn"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          openAuthModal('signup');
                        }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#16A34A] hover:bg-[#DCFCE7] dark:hover:bg-[#16A34A]/10 transition-colors text-left cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Create Account (+₦25k)</span>
                      </button>
                      <button
                        type="button"
                        id="menu-sign-in-btn"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          openAuthModal('login');
                        }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#4B5563] dark:text-[#D1D5DB] hover:text-[#111827] dark:hover:text-[#F9FAFB] hover:bg-[#F1F5F9] dark:hover:bg-[#374151] transition-colors text-left cursor-pointer"
                      >
                        <LogIn className="w-4 h-4 text-[#6B7280] dark:text-[#9CA3AF]" />
                        <span>Sign In / Log In</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      id="menu-sign-out-btn"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#EF4444] hover:bg-[#FEE2E2] dark:hover:bg-[#EF4444]/10 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-[#EF4444]" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* Mobile/Tablet Menu Drawer Trigger */}
          <button
            type="button"
            id="navbar-menu-drawer-btn"
            onClick={() => setIsDrawerOpen(true)}
            className="p-2 rounded-xl bg-[#F1F5F9] dark:bg-[#172033] hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#1E293B] text-[#4B5563] hover:text-[#111827] dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] transition-all cursor-pointer shadow-2xs lg:hidden"
            aria-label="Open Navigation Menu"
            title="Navigation Menu"
          >
            <Menu className="w-4.5 h-4.5" />
          </button>

        </div>
      </div>
    </header>
  );
};


