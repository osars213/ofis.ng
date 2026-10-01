import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  Heart, 
  Bell, 
  CreditCard, 
  Settings, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  ExternalLink, 
  ChevronRight, 
  Trash2, 
  RefreshCw, 
  Zap, 
  Wifi, 
  Receipt,
  Mail,
  Building2,
  ArrowRight,
  LogOut,
  Moon,
  Sun,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WorkspaceCard } from '../WorkspaceCard';
import { SupportedCurrency, CURRENCY_RATES } from '../../services/currencyService';
import { Booking, Space } from '../../types';

export const UserDashboardView: React.FC = () => {
  const {
    currentUser,
    bookings,
    allSpaces,
    savedSpaceIds,
    notifications,
    deleteNotification,
    clearAllNotifications,
    availabilityAlerts,
    cancelAvailabilityAlert,
    setCurrentView,
    setSelectedSpaceId,
    openAuthModal,
    openEmailVerificationModal,
    switchUserRole,
    signOut,
    currency,
    setCurrency,
    theme,
    toggleTheme,
    timeFormat,
    toggleTimeFormat,
    formatPrice,
    setIsDigitalPassOpen,
    setActiveDigitalPassBooking,
    setIsBookingDetailsOpen,
    setActiveBookingDetails
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'saved' | 'alerts' | 'payments' | 'profile' | 'settings'>('overview');

  // Filter user bookings
  const userBookings = bookings.filter(b => b.userId === currentUser.id || currentUser.id === 'user-001' || currentUser.id === 'guest-user');
  const activeBookings = userBookings.filter(b => b.status === 'confirmed' || b.status === 'checked_in');
  const completedBookings = userBookings.filter(b => b.status === 'completed');
  
  // Saved spaces
  const savedSpaces = allSpaces.filter(s => savedSpaceIds.includes(s.id));

  const handleOpenDigitalPass = (booking: Booking) => {
    setActiveDigitalPassBooking(booking);
    setIsDigitalPassOpen(true);
  };

  const handleOpenBookingDetails = (booking: Booking) => {
    setActiveBookingDetails(booking);
    setIsBookingDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F4] dark:bg-[#07383D] text-[#12383B] dark:text-[#FFFFFF] transition-colors duration-150 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#006B70]"
            />
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#12383B] dark:text-[#FFFFFF]">{currentUser.name}</h1>
                {currentUser.isEmailVerified ? (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#006B70]/15 dark:bg-[#006B70]/20 text-[#006B70] dark:text-[#28D2CB] text-[10px] font-mono font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => openEmailVerificationModal('general')}
                    className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 text-[10px] font-mono font-bold cursor-pointer"
                  >
                    <AlertCircle className="w-3 h-3" />
                    <span>Verify Email</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0]">
                {currentUser.email} • {currentUser.company || 'Independent Professional'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-auto">
            {currentUser.role === 'host' ? (
              <button
                type="button"
                onClick={() => setCurrentView('host_dashboard')}
                className="px-4 py-2.5 rounded-xl bg-[#006B70] hover:bg-[#0EA8A2] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center space-x-1.5"
              >
                <Building2 className="w-4 h-4" />
                <span>Host Portal</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => switchUserRole('host')}
                className="px-4 py-2.5 rounded-xl bg-[#F1F6F5] dark:bg-[#07383D] hover:bg-[#E2ECEB] dark:hover:bg-[#105A60] text-xs font-bold text-[#006B70] dark:text-[#28D2CB] border border-[#E2ECEB] dark:border-[#166D74] cursor-pointer flex items-center space-x-1.5"
              >
                <Building2 className="w-4 h-4" />
                <span>Switch to Host</span>
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Layout: Left Tabs Sidebar (horizontal on mobile/tab) + Right Tab View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Navigation Tabs (Horizontal on mobile/tab, 3 cols sidebar on lg) */}
          <aside className="lg:col-span-3 flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1.5 lg:gap-2 p-2 sm:p-3 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] shadow-sm scrollbar-none snap-x touch-pan-x">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'bookings', label: `My Bookings (${userBookings.length})`, icon: Calendar },
              { id: 'saved', label: `Saved Spaces (${savedSpaces.length})`, icon: Heart },
              { id: 'alerts', label: `Availability Alerts (${availabilityAlerts.length})`, icon: Bell },
              { id: 'payments', label: 'Payment Receipts', icon: Receipt },
              { id: 'profile', label: 'Account Profile', icon: ShieldCheck },
              { id: 'settings', label: 'Preferences', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`snap-start w-auto lg:w-full shrink-0 px-3.5 py-2.5 lg:p-3 rounded-2xl text-xs font-bold flex items-center space-x-2.5 transition-all cursor-pointer whitespace-nowrap lg:whitespace-normal text-left ${
                    isActive
                      ? 'bg-[#006B70] text-white shadow-xs'
                      : 'text-[#5D7A7D] dark:text-[#B8D1D0] hover:bg-[#F1F6F5] dark:hover:bg-[#07383D] hover:text-[#12383B] dark:hover:text-[#FFFFFF]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <div className="hidden lg:block pt-3 border-t border-[#E2ECEB] dark:border-[#166D74]">
              <button
                type="button"
                onClick={signOut}
                className="w-full p-3 rounded-2xl text-xs font-bold text-[#EF4444] hover:bg-red-500/10 flex items-center space-x-3 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          {/* Main Content Pane (9 cols on lg) */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-6 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#5D7A7D] dark:text-[#B8D1D0]">Active Passes</span>
                    <div className="text-2xl font-extrabold text-[#006B70] dark:text-[#28D2CB] font-mono">{activeBookings.length}</div>
                    <p className="text-[11px] text-[#5D7A7D] dark:text-[#B8D1D0]">Ready for turnstile entry</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#5D7A7D] dark:text-[#B8D1D0]">Completed Visits</span>
                    <div className="text-2xl font-extrabold text-[#12383B] dark:text-[#FFFFFF] font-mono">{completedBookings.length}</div>
                    <p className="text-[11px] text-[#5D7A7D] dark:text-[#B8D1D0]">Focus hours logged</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#5D7A7D] dark:text-[#B8D1D0]">Saved Hubs</span>
                    <div className="text-2xl font-extrabold text-[#12383B] dark:text-[#FFFFFF] font-mono">{savedSpaces.length}</div>
                    <p className="text-[11px] text-[#5D7A7D] dark:text-[#B8D1D0]">Favorited workspaces</p>
                  </div>
                </div>

                {/* Active Passes Section */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#12383B] dark:text-[#FFFFFF]">Your Active Digital Passes</h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('bookings')}
                      className="text-xs font-bold text-[#006B70] dark:text-[#28D2CB] hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  {activeBookings.length === 0 ? (
                    <div className="py-8 text-center space-y-3">
                      <QrCode className="w-10 h-10 text-[#006B70] dark:text-[#28D2CB] mx-auto" />
                      <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0]">You have no active booking passes for today.</p>
                      <button
                        type="button"
                        onClick={() => setCurrentView('explore')}
                        className="px-4 py-2 rounded-xl bg-[#006B70] text-white text-xs font-bold shadow-xs cursor-pointer"
                      >
                        Explore Workspaces
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeBookings.map((b) => (
                        <div
                          key={b.id}
                          className="p-4 rounded-2xl bg-[#F1F6F5] dark:bg-[#07383D] border border-[#E2ECEB] dark:border-[#166D74] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[#006B70]/15 dark:bg-[#006B70]/20 text-[#006B70] dark:text-[#28D2CB]">
                              {b.status.replace(/_/g, ' ')}
                            </span>
                            <h4 className="text-sm font-bold text-[#12383B] dark:text-[#FFFFFF]">{b.spaceTitle}</h4>
                            <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0] flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-[#006B70] dark:text-[#28D2CB]" />
                              <span>{b.date} • {b.startTime} - {b.endTime || '18:00'}</span>
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleOpenDigitalPass(b)}
                              className="px-4 py-2 rounded-xl bg-[#006B70] hover:bg-[#0EA8A2] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center space-x-1.5"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>View QR Pass</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#12383B] dark:text-[#FFFFFF]">Booking History & Passes ({userBookings.length})</h3>
                  <button
                    type="button"
                    onClick={() => setCurrentView('explore')}
                    className="px-3 py-1.5 rounded-xl bg-[#006B70] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    + Book New Space
                  </button>
                </div>

                {userBookings.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <Calendar className="w-10 h-10 text-[#006B70] dark:text-[#28D2CB] mx-auto" />
                    <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0]">No bookings recorded yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userBookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-5 rounded-2xl bg-[#F1F6F5] dark:bg-[#07383D] border border-[#E2ECEB] dark:border-[#166D74] flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              b.status === 'confirmed' || b.status === 'checked_in'
                                ? 'bg-[#006B70]/15 dark:bg-[#006B70]/20 text-[#006B70] dark:text-[#28D2CB]'
                                : 'bg-[#E2ECEB] dark:bg-[#105A60] text-[#5D7A7D] dark:text-[#B8D1D0]'
                            }`}>
                              {b.status.replace(/_/g, ' ')}
                            </span>
                            <span className="text-xs font-mono text-[#5D7A7D] dark:text-[#B8D1D0]">Ref: {b.id}</span>
                          </div>
                          
                          <h4 className="text-sm font-bold text-[#12383B] dark:text-[#FFFFFF]">{b.spaceTitle}</h4>
                          <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0]">
                            Date: {b.date} ({b.startTime} - {b.endTime || '18:00'}) • {b.guestCount} Guest{b.guestCount === 1 ? '' : 's'}
                          </p>
                          <p className="text-xs font-mono font-bold text-[#006B70] dark:text-[#28D2CB]">
                            Total Paid: {formatPrice(b.totalAmount)}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenDigitalPass(b)}
                            className="px-3 py-2 rounded-xl bg-[#006B70] hover:bg-[#0EA8A2] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center space-x-1"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Digital Pass</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenBookingDetails(b)}
                            className="px-3 py-2 rounded-xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] text-[#12383B] dark:text-[#FFFFFF] text-xs font-semibold cursor-pointer"
                          >
                            View Receipt
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SAVED SPACES TAB */}
            {activeTab === 'saved' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#12383B] dark:text-[#FFFFFF]">Saved Workspaces ({savedSpaces.length})</h3>
                </div>

                {savedSpaces.length === 0 ? (
                  <div className="p-12 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] text-center space-y-3">
                    <Heart className="w-10 h-10 text-[#006B70] dark:text-[#28D2CB] mx-auto" />
                    <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0]">You haven&apos;t saved any workspaces to your favorites yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {savedSpaces.map((space) => (
                      <WorkspaceCard
                        key={space.id}
                        space={space}
                        layout="grid"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* AVAILABILITY ALERTS TAB */}
            {activeTab === 'alerts' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] shadow-sm space-y-6">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#12383B] dark:text-[#FFFFFF]">Active Space Availability Alerts</h3>
                  <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0]">
                    We monitor high-demand workspaces and alert you immediately via SMS and in-app notification when a desk opens up.
                  </p>
                </div>

                {availabilityAlerts.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <Bell className="w-10 h-10 text-[#006B70] dark:text-[#28D2CB] mx-auto" />
                    <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0]">No active availability alerts registered.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {availabilityAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="p-4 rounded-2xl bg-[#F1F6F5] dark:bg-[#07383D] border border-[#E2ECEB] dark:border-[#166D74] flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-[#12383B] dark:text-[#FFFFFF]">{alert.spaceTitle}</h4>
                          <p className="text-[11px] text-[#5D7A7D] dark:text-[#B8D1D0]">
                            Monitoring start date: {alert.preferredStartDate || 'Immediate next opening'} • Contact: {alert.contactEmail || alert.contactPhone}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => cancelAvailabilityAlert(alert.id)}
                          className="text-xs font-bold text-[#EF4444] hover:underline cursor-pointer"
                        >
                          Cancel Alert
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PREFERENCES & SETTINGS */}
            {activeTab === 'settings' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] shadow-sm space-y-6">
                <h3 className="text-base font-bold text-[#12383B] dark:text-[#FFFFFF]">Platform Preferences</h3>
                
                <div className="space-y-4 text-xs">
                  {/* Currency */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F1F6F5] dark:bg-[#07383D] border border-[#E2ECEB] dark:border-[#166D74]">
                    <div>
                      <h4 className="font-bold text-[#12383B] dark:text-[#FFFFFF]">Display Currency</h4>
                      <p className="text-[#5D7A7D] dark:text-[#B8D1D0]">Select how workspace rates are shown</p>
                    </div>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] text-[#12383B] dark:text-[#FFFFFF] font-mono text-xs cursor-pointer"
                    >
                      {(Object.keys(CURRENCY_RATES) as SupportedCurrency[]).map((c) => (
                        <option key={c} value={c}>
                          {CURRENCY_RATES[c].symbol} {c} ({CURRENCY_RATES[c].name})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Theme */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F1F6F5] dark:bg-[#07383D] border border-[#E2ECEB] dark:border-[#166D74]">
                    <div>
                      <h4 className="font-bold text-[#12383B] dark:text-[#FFFFFF]">Appearance Theme</h4>
                      <p className="text-[#5D7A7D] dark:text-[#B8D1D0]">Current: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="px-4 py-2 rounded-xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] text-[#12383B] dark:text-[#FFFFFF] font-bold cursor-pointer flex items-center space-x-2"
                    >
                      {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#006B70]" />}
                      <span>Toggle Theme</span>
                    </button>
                  </div>

                  {/* Time format */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F1F6F5] dark:bg-[#07383D] border border-[#E2ECEB] dark:border-[#166D74]">
                    <div>
                      <h4 className="font-bold text-[#12383B] dark:text-[#FFFFFF]">Time Display Format</h4>
                      <p className="text-[#5D7A7D] dark:text-[#B8D1D0]">12-hour (AM/PM) vs 24-hour military format</p>
                    </div>
                    <button
                      type="button"
                      onClick={toggleTimeFormat}
                      className="px-4 py-2 rounded-xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] text-[#12383B] dark:text-[#FFFFFF] font-mono font-bold cursor-pointer"
                    >
                      {timeFormat.toUpperCase()}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ACCOUNT PROFILE */}
            {activeTab === 'profile' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] shadow-sm space-y-6">
                <h3 className="text-base font-bold text-[#12383B] dark:text-[#FFFFFF]">Profile Details</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#F1F6F5] dark:bg-[#07383D] border border-[#E2ECEB] dark:border-[#166D74] space-y-1">
                    <span className="text-[#5D7A7D] dark:text-[#B8D1D0]">Full Name</span>
                    <p className="font-bold text-sm text-[#12383B] dark:text-[#FFFFFF]">{currentUser.name}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F1F6F5] dark:bg-[#07383D] border border-[#E2ECEB] dark:border-[#166D74] space-y-1">
                    <span className="text-[#5D7A7D] dark:text-[#B8D1D0]">Email Address</span>
                    <p className="font-bold text-sm text-[#12383B] dark:text-[#FFFFFF]">{currentUser.email}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F1F6F5] dark:bg-[#07383D] border border-[#E2ECEB] dark:border-[#166D74] space-y-1">
                    <span className="text-[#5D7A7D] dark:text-[#B8D1D0]">Phone Number</span>
                    <p className="font-bold text-sm text-[#12383B] dark:text-[#FFFFFF]">{currentUser.phone || '+234 800 000 0000'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F1F6F5] dark:bg-[#07383D] border border-[#E2ECEB] dark:border-[#166D74] space-y-1">
                    <span className="text-[#5D7A7D] dark:text-[#B8D1D0]">Company / Organization</span>
                    <p className="font-bold text-sm text-[#12383B] dark:text-[#FFFFFF]">{currentUser.company || 'Not Specified'}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => openAuthModal('profile')}
                    className="px-4 py-2.5 rounded-xl bg-[#006B70] hover:bg-[#0EA8A2] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Edit Profile Details
                  </button>
                </div>
              </div>
            )}

            {/* PAYMENT RECEIPTS */}
            {activeTab === 'payments' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] shadow-sm space-y-6">
                <h3 className="text-base font-bold text-[#12383B] dark:text-[#FFFFFF]">Transaction History & Tax Invoices</h3>
                
                {userBookings.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <Receipt className="w-10 h-10 text-[#006B70] dark:text-[#28D2CB] mx-auto" />
                    <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0]">No payment records found.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userBookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-4 rounded-2xl bg-[#F1F6F5] dark:bg-[#07383D] border border-[#E2ECEB] dark:border-[#166D74] flex items-center justify-between text-xs"
                      >
                        <div className="space-y-1">
                          <h4 className="font-bold text-[#12383B] dark:text-[#FFFFFF]">{b.spaceTitle}</h4>
                          <p className="text-[#5D7A7D] dark:text-[#B8D1D0]">
                            {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : b.date} • Paystack / Card
                          </p>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span className="font-mono font-bold text-[#006B70] dark:text-[#28D2CB]">
                            {formatPrice(b.totalAmount)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenBookingDetails(b)}
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] text-[#12383B] dark:text-[#FFFFFF] text-xs font-semibold cursor-pointer"
                          >
                            Invoice
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </main>

        </div>

      </div>

    </div>
  );
};
