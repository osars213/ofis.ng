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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#111827] dark:text-[#F8FAFC] transition-colors duration-150 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#10B981]"
            />
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold">{currentUser.name}</h1>
                {currentUser.isEmailVerified ? (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#D1FAE5] dark:bg-[#10B981]/15 text-[#10B981] text-[10px] font-mono font-bold">
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
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
                {currentUser.email} • {currentUser.company || 'Independent Professional'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-auto">
            {currentUser.role === 'host' ? (
              <button
                type="button"
                onClick={() => setCurrentView('host_dashboard')}
                className="px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center space-x-1.5"
              >
                <Building2 className="w-4 h-4" />
                <span>Host Portal</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => switchUserRole('host')}
                className="px-4 py-2.5 rounded-xl bg-[#F1F5F9] dark:bg-[#1E293B] hover:bg-[#E2E8F0] dark:hover:bg-[#374151] text-xs font-bold text-[#10B981] cursor-pointer flex items-center space-x-1.5"
              >
                <Building2 className="w-4 h-4" />
                <span>Switch to Host</span>
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Layout: Left Tabs Sidebar + Right Tab View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar (3 cols on lg) */}
          <aside className="lg:col-span-3 space-y-2 p-3 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] shadow-sm">
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
                  className={`w-full p-3 rounded-2xl text-xs font-bold flex items-center space-x-3 transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#10B981] text-white shadow-xs'
                      : 'text-[#6B7280] dark:text-[#94A3B8] hover:bg-[#F8FAFC] dark:hover:bg-[#101827] hover:text-[#111827] dark:hover:text-[#F8FAFC]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <div className="pt-3 border-t border-[#E5E7EB] dark:border-[#1E293B]">
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
                  <div className="p-6 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#6B7280] dark:text-[#94A3B8]">Active Passes</span>
                    <div className="text-2xl font-extrabold text-[#10B981] font-mono">{activeBookings.length}</div>
                    <p className="text-[11px] text-[#6B7280] dark:text-[#94A3B8]">Ready for turnstile entry</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#6B7280] dark:text-[#94A3B8]">Completed Visits</span>
                    <div className="text-2xl font-extrabold text-[#111827] dark:text-[#F8FAFC] font-mono">{completedBookings.length}</div>
                    <p className="text-[11px] text-[#6B7280] dark:text-[#94A3B8]">Focus hours logged</p>
                  </div>

                  <div className="p-6 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#6B7280] dark:text-[#94A3B8]">Saved Hubs</span>
                    <div className="text-2xl font-extrabold text-[#111827] dark:text-[#F8FAFC] font-mono">{savedSpaces.length}</div>
                    <p className="text-[11px] text-[#6B7280] dark:text-[#94A3B8]">Favorited workspaces</p>
                  </div>
                </div>

                {/* Active Passes Section */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold">Your Active Digital Passes</h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('bookings')}
                      className="text-xs font-bold text-[#10B981] hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  {activeBookings.length === 0 ? (
                    <div className="py-8 text-center space-y-3">
                      <QrCode className="w-10 h-10 text-[#94A3B8] mx-auto" />
                      <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">You have no active booking passes for today.</p>
                      <button
                        type="button"
                        onClick={() => setCurrentView('explore')}
                        className="px-4 py-2 rounded-xl bg-[#10B981] text-white text-xs font-bold shadow-xs cursor-pointer"
                      >
                        Explore Workspaces
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeBookings.map((b) => (
                        <div
                          key={b.id}
                          className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#101827] border border-[#E5E7EB] dark:border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[#D1FAE5] dark:bg-[#10B981]/20 text-[#10B981]">
                              {b.status.replace(/_/g, ' ')}
                            </span>
                            <h4 className="text-sm font-bold">{b.spaceTitle}</h4>
                            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{b.date} • {b.startTime} - {b.endTime || '18:00'}</span>
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleOpenDigitalPass(b)}
                              className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center space-x-1.5"
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
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold">Booking History & Passes ({userBookings.length})</h3>
                  <button
                    type="button"
                    onClick={() => setCurrentView('explore')}
                    className="px-3 py-1.5 rounded-xl bg-[#10B981] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    + Book New Space
                  </button>
                </div>

                {userBookings.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <Calendar className="w-10 h-10 text-[#94A3B8] mx-auto" />
                    <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">No bookings recorded yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userBookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#101827] border border-[#E5E7EB] dark:border-[#1E293B] flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              b.status === 'confirmed' || b.status === 'checked_in'
                                ? 'bg-[#D1FAE5] dark:bg-[#10B981]/20 text-[#10B981]'
                                : 'bg-[#E2E8F0] dark:bg-[#1E293B] text-[#6B7280] dark:text-[#94A3B8]'
                            }`}>
                              {b.status.replace(/_/g, ' ')}
                            </span>
                            <span className="text-xs font-mono text-[#6B7280] dark:text-[#94A3B8]">Ref: {b.id}</span>
                          </div>
                          
                          <h4 className="text-sm font-bold text-[#111827] dark:text-[#F8FAFC]">{b.spaceTitle}</h4>
                          <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
                            Date: {b.date} ({b.startTime} - {b.endTime || '18:00'}) • {b.guestCount} Guest{b.guestCount === 1 ? '' : 's'}
                          </p>
                          <p className="text-xs font-mono font-bold text-[#10B981]">
                            Total Paid: {formatPrice(b.totalAmount)}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenDigitalPass(b)}
                            className="px-3 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center space-x-1"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Digital Pass</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenBookingDetails(b)}
                            className="px-3 py-2 rounded-xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] text-xs font-semibold cursor-pointer"
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
                  <h3 className="text-base font-bold">Saved Workspaces ({savedSpaces.length})</h3>
                </div>

                {savedSpaces.length === 0 ? (
                  <div className="p-12 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] text-center space-y-3">
                    <Heart className="w-10 h-10 text-[#94A3B8] mx-auto" />
                    <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">You haven&apos;t saved any workspaces to your favorites yet.</p>
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
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] shadow-sm space-y-6">
                <div className="space-y-1">
                  <h3 className="text-base font-bold">Active Space Availability Alerts</h3>
                  <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
                    We monitor high-demand workspaces and alert you immediately via SMS and in-app notification when a desk opens up.
                  </p>
                </div>

                {availabilityAlerts.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <Bell className="w-10 h-10 text-[#94A3B8] mx-auto" />
                    <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">No active availability alerts registered.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {availabilityAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#101827] border border-[#E5E7EB] dark:border-[#1E293B] flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC]">{alert.spaceTitle}</h4>
                          <p className="text-[11px] text-[#6B7280] dark:text-[#94A3B8]">
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
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] shadow-sm space-y-6">
                <h3 className="text-base font-bold">Platform Preferences</h3>
                
                <div className="space-y-4 text-xs">
                  {/* Currency */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#101827]">
                    <div>
                      <h4 className="font-bold">Display Currency</h4>
                      <p className="text-[#6B7280] dark:text-[#94A3B8]">Select how workspace rates are shown</p>
                    </div>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] font-mono text-xs cursor-pointer"
                    >
                      {(Object.keys(CURRENCY_RATES) as SupportedCurrency[]).map((c) => (
                        <option key={c} value={c}>
                          {CURRENCY_RATES[c].symbol} {c} ({CURRENCY_RATES[c].name})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Theme */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#101827]">
                    <div>
                      <h4 className="font-bold">Appearance Theme</h4>
                      <p className="text-[#6B7280] dark:text-[#94A3B8]">Current: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="px-4 py-2 rounded-xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] font-bold cursor-pointer flex items-center space-x-2"
                    >
                      {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                      <span>Toggle Theme</span>
                    </button>
                  </div>

                  {/* Time format */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#101827]">
                    <div>
                      <h4 className="font-bold">Time Display Format</h4>
                      <p className="text-[#6B7280] dark:text-[#94A3B8]">12-hour (AM/PM) vs 24-hour military format</p>
                    </div>
                    <button
                      type="button"
                      onClick={toggleTimeFormat}
                      className="px-4 py-2 rounded-xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] font-mono font-bold cursor-pointer"
                    >
                      {timeFormat.toUpperCase()}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ACCOUNT PROFILE */}
            {activeTab === 'profile' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] shadow-sm space-y-6">
                <h3 className="text-base font-bold">Profile Details</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#101827] space-y-1">
                    <span className="text-[#6B7280] dark:text-[#94A3B8]">Full Name</span>
                    <p className="font-bold text-sm">{currentUser.name}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#101827] space-y-1">
                    <span className="text-[#6B7280] dark:text-[#94A3B8]">Email Address</span>
                    <p className="font-bold text-sm">{currentUser.email}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#101827] space-y-1">
                    <span className="text-[#6B7280] dark:text-[#94A3B8]">Phone Number</span>
                    <p className="font-bold text-sm">{currentUser.phone || '+234 800 000 0000'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#101827] space-y-1">
                    <span className="text-[#6B7280] dark:text-[#94A3B8]">Company / Organization</span>
                    <p className="font-bold text-sm">{currentUser.company || 'Not Specified'}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => openAuthModal('profile')}
                    className="px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Edit Profile Details
                  </button>
                </div>
              </div>
            )}

            {/* PAYMENT RECEIPTS */}
            {activeTab === 'payments' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] shadow-sm space-y-6">
                <h3 className="text-base font-bold">Transaction History & Tax Invoices</h3>
                
                {userBookings.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <Receipt className="w-10 h-10 text-[#94A3B8] mx-auto" />
                    <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">No payment records found.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userBookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#101827] border border-[#E5E7EB] dark:border-[#1E293B] flex items-center justify-between text-xs"
                      >
                        <div className="space-y-1">
                          <h4 className="font-bold">{b.spaceTitle}</h4>
                          <p className="text-[#6B7280] dark:text-[#94A3B8]">
                            {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : b.date} • Paystack / Card
                          </p>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span className="font-mono font-bold text-[#10B981]">
                            {formatPrice(b.totalAmount)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenBookingDetails(b)}
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] text-xs font-semibold cursor-pointer"
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
