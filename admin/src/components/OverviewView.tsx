import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  CalendarCheck, 
  CreditCard, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  RefreshCw,
  FileText
} from 'lucide-react';
import { OverviewMetrics, AuditLogEntry, AdminTab } from '../types';
import { AdminApiClient } from '../services/adminApiClient';

export const OverviewView: React.FC<{ onNavigate: (tab: AdminTab) => void }> = ({ onNavigate }) => {
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [recentLogs, setRecentLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await AdminApiClient.getOverview();
      setMetrics(data.metrics);
      setRecentLogs(data.recentActivity);
    } catch (err: any) {
      setError(err.message || 'Failed to load platform overview');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading && !metrics) {
    return (
      <div className="flex items-center justify-center py-24">
        <RefreshCw className="w-6 h-6 animate-spin text-[#14BEB8]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Welcome / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Platform Control Center</h1>
          <p className="text-xs text-[#8EACB0] mt-1">Real-time status of physical workspace network, payments, and users.</p>
        </div>
        <button
          onClick={fetchOverview}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#07383D] border border-[#166D74] hover:bg-[#0B4A50] text-xs font-semibold text-[#C2D7D9] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#14BEB8] ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Metrics
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Spaces Card */}
        <div className="p-5 rounded-2xl bg-[#07383D] border border-[#166D74] shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#8EACB0] uppercase tracking-wider">Workspaces</span>
              <div className="w-8 h-8 rounded-lg bg-[#14BEB8]/15 text-[#14BEB8] flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">
              {metrics?.spaces.total || 0}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#166D74]/60 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-medium">
              {metrics?.spaces.active || 0} active
            </span>
            {metrics?.spaces.pendingVerification ? (
              <span className="text-amber-300 font-medium bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                {metrics.spaces.pendingVerification} pending
              </span>
            ) : (
              <span className="text-[#8EACB0]">All verified</span>
            )}
          </div>
        </div>

        {/* Bookings Card */}
        <div className="p-5 rounded-2xl bg-[#07383D] border border-[#166D74] shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#8EACB0] uppercase tracking-wider">Bookings</span>
              <div className="w-8 h-8 rounded-lg bg-[#FFA987]/15 text-[#FFA987] flex items-center justify-center">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">
              {metrics?.bookings.total || 0}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#166D74]/60 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-medium">
              {metrics?.bookings.confirmed || 0} confirmed
            </span>
            <button
              onClick={() => onNavigate('bookings')}
              className="text-[#14BEB8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* GMV / Payments Card */}
        <div className="p-5 rounded-2xl bg-[#07383D] border border-[#166D74] shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#8EACB0] uppercase tracking-wider">Total Volume (GMV)</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white truncate" title={formatNaira(metrics?.payments.totalGmvNGN || 0)}>
              {formatNaira(metrics?.payments.totalGmvNGN || 0)}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#166D74]/60 flex items-center justify-between text-xs">
            <span className="text-[#8EACB0]">
              {metrics?.payments.totalSuccessful || 0} paid via SZND
            </span>
            <button
              onClick={() => onNavigate('payments')}
              className="text-[#14BEB8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Details <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Users Card */}
        <div className="p-5 rounded-2xl bg-[#07383D] border border-[#166D74] shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#8EACB0] uppercase tracking-wider">Members & Hosts</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">
              {metrics?.users.total || 0}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#166D74]/60 flex items-center justify-between text-xs text-[#8EACB0]">
            <span>{metrics?.users.user || 0} users</span>
            <span>{metrics?.users.host || 0} hosts</span>
            <span className="text-[#FFA987] font-semibold">{metrics?.users.admin || 0} admins</span>
          </div>
        </div>
      </div>

      {/* Quick Access Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => onNavigate('spaces')}
          className="p-4 rounded-xl bg-[#07383D]/60 hover:bg-[#07383D] border border-[#166D74] hover:border-[#14BEB8]/40 transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#14BEB8]/15 text-[#14BEB8]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-[#14BEB8] transition-colors">Manage Spaces</h4>
              <p className="text-xs text-[#8EACB0]">Approve verification & toggle active status</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#8EACB0] group-hover:text-[#14BEB8] transition-colors" />
        </div>

        <div 
          onClick={() => onNavigate('users')}
          className="p-4 rounded-xl bg-[#07383D]/60 hover:bg-[#07383D] border border-[#166D74] hover:border-[#14BEB8]/40 transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/15 text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Manage User Roles</h4>
              <p className="text-xs text-[#8EACB0]">Promote or assign host and admin roles</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#8EACB0] group-hover:text-blue-400 transition-colors" />
        </div>

        <div 
          onClick={() => onNavigate('audit_log')}
          className="p-4 rounded-xl bg-[#07383D]/60 hover:bg-[#07383D] border border-[#166D74] hover:border-[#14BEB8]/40 transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#FFA987]/15 text-[#FFA987]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-[#FFA987] transition-colors">Inspect Audit Trail</h4>
              <p className="text-xs text-[#8EACB0]">Review immutable logs of all admin actions</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#8EACB0] group-hover:text-[#FFA987] transition-colors" />
        </div>
      </div>

      {/* Recent Activity Audit Trail */}
      <div className="rounded-2xl bg-[#07383D] border border-[#166D74] overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#166D74]/70 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#14BEB8]" />
              Recent Administrative Actions
            </h3>
            <p className="text-xs text-[#8EACB0] mt-0.5">Live stream from public.admin_audit_log table</p>
          </div>
          <button
            onClick={() => onNavigate('audit_log')}
            className="text-xs font-semibold text-[#14BEB8] hover:underline flex items-center gap-1 cursor-pointer"
          >
            Full Audit Log <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#166D74]/40">
          {recentLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8EACB0]">
              No administrative actions recorded yet. All future mutations will stream here automatically.
            </div>
          ) : (
            recentLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-[#0B4A50]/50 transition-colors flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#14BEB8] shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate">
                      <span className="text-[#FFA987]">{log.action}</span> on table <span className="text-[#14BEB8]">{log.table_name}</span> (ID: {log.record_id.slice(0, 16)})
                    </div>
                    <div className="text-[11px] text-[#8EACB0]">
                      by <span className="text-[#C2D7D9]">{log.admin_email}</span> &bull; {new Date(log.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#052427] text-[#8EACB0] border border-[#166D74]/60 shrink-0">
                  {log.ip_address || 'server'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
