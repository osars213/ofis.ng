import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  CalendarCheck, 
  CreditCard, 
  Users, 
  FileText, 
  LogOut, 
  ShieldCheck, 
  Clock, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { AdminTab } from '../types';
import { useAdminAuth } from '../context/AdminAuthContext';

interface AdminLayoutProps {
  currentTab: AdminTab;
  setCurrentTab: (tab: AdminTab) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentTab, setCurrentTab, children }) => {
  const { adminUser, signOut, remainingMinutes } = useAdminAuth();

  const menuItems: Array<{ id: AdminTab; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'spaces', label: 'Spaces', icon: <Building2 className="w-4 h-4" /> },
    { id: 'bookings', label: 'Bookings', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
    { id: 'audit_log', label: 'Audit Log', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#052427] text-[#F8FAFC] flex flex-col md:flex-row antialiased">
      {/* ========================================================================= */}
      {/* LEFT MENU SIDEBAR                                                         */}
      {/* ========================================================================= */}
      <aside className="w-full md:w-64 bg-[#07383D] border-r border-[#166D74] flex flex-col shrink-0">
        {/* Brand / Logo */}
        <div className="p-5 border-b border-[#166D74]/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B4A50] to-[#006B70] border border-[#14BEB8]/40 flex items-center justify-center text-[#14BEB8] shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-wide text-white flex items-center gap-1.5">
                OFIS <span className="text-[#FFA987] font-semibold text-xs px-1.5 py-0.5 rounded bg-[#FFA987]/15">ADMIN</span>
              </div>
              <div className="text-[10px] text-[#8EACB0] font-medium tracking-wider">
                OPERATIONS DASHBOARD
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold text-[#8EACB0] uppercase tracking-wider">
            Platform Operations
          </div>
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#14BEB8] text-[#052427] shadow-lg shadow-[#14BEB8]/20 font-bold'
                    : 'text-[#C2D7D9] hover:bg-[#0B4A50] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-[#052427]' : 'text-[#14BEB8]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#052427]" />}
              </button>
            );
          })}
        </nav>

        {/* Security & Inactivity Session Status */}
        <div className="p-4 border-t border-[#166D74]/70 bg-[#052427]/60 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-[#8EACB0]">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FFA987]" />
              Inactivity Timeout
            </span>
            <span className={`font-mono font-bold ${remainingMinutes <= 5 ? 'text-red-400' : 'text-[#14BEB8]'}`}>
              {remainingMinutes}m remaining
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#07383D] border border-[#166D74] flex items-center justify-between">
            <div className="truncate pr-2">
              <div className="text-[11px] font-bold text-white truncate">
                {adminUser?.email || 'admin@ofis.ng'}
              </div>
              <div className="text-[10px] text-[#14BEB8] flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#14BEB8] inline-block animate-pulse" />
                MFA Verified (AAL2)
              </div>
            </div>
            <button
              onClick={() => signOut('manual')}
              title="Sign Out"
              className="p-1.5 rounded-lg bg-[#052427] hover:bg-red-500/20 text-[#8EACB0] hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA                                                         */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#052427] overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-[#166D74] bg-[#07383D]/60 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-white capitalize">
              {currentTab.replace('_', ' ')}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-md bg-[#166D74]/50 text-[#8EACB0] border border-[#166D74]">
              Supabase Shared Database
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-2 text-[#8EACB0]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Production Backend Connected</span>
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
