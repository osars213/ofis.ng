import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  RefreshCw, 
  AlertCircle, 
  Clock, 
  ChevronDown, 
  ChevronRight, 
  ShieldCheck, 
  Loader2,
  Database,
  ArrowRight
} from 'lucide-react';
import { AuditLogEntry } from '../types';
import { AdminApiClient } from '../services/adminApiClient';

export const AuditLogView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tableFilter, setTableFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await AdminApiClient.getAuditLogs({
        tableName: tableFilter === 'all' ? undefined : tableFilter,
        action: actionFilter === 'all' ? undefined : actionFilter,
        search: search.trim() || undefined,
      });
      setLogs(data.auditLogs);
    } catch (err: any) {
      setError(err.message || 'Failed to load audit logs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [tableFilter, actionFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAuditLogs();
  };

  const toggleExpand = (id: string) => {
    setExpandedLogId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#14BEB8]" />
            Administrative Audit Trail
          </h1>
          <p className="text-xs text-[#8EACB0] mt-1">
            Immutable log of all administrative actions, record alterations, old vs. new values, and timestamps.
          </p>
        </div>
        <button
          onClick={fetchAuditLogs}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#07383D] border border-[#166D74] hover:bg-[#0B4A50] text-xs font-semibold text-[#C2D7D9] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#14BEB8] ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Audit Log
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-2xl bg-[#07383D] border border-[#166D74] flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-[#8EACB0] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by administrator email, record ID, or action..."
            className="w-full bg-[#052427] border border-[#166D74] focus:border-[#14BEB8] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-[#5D7A7D] outline-none"
          />
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#052427] border border-[#166D74] rounded-xl px-2.5 py-1.5 text-xs text-[#C2D7D9]">
            <Database className="w-3.5 h-3.5 text-[#14BEB8]" />
            <select
              value={tableFilter}
              onChange={(e) => setTableFilter(e.target.value)}
              className="bg-transparent text-white outline-none cursor-pointer text-xs"
            >
              <option value="all" className="bg-[#07383D]">All Tables</option>
              <option value="spaces" className="bg-[#07383D]">spaces</option>
              <option value="bookings" className="bg-[#07383D]">bookings</option>
              <option value="profiles" className="bg-[#07383D]">profiles</option>
              <option value="payments" className="bg-[#07383D]">payments</option>
              <option value="auth.users" className="bg-[#07383D]">auth.users</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#052427] border border-[#166D74] rounded-xl px-2.5 py-1.5 text-xs text-[#C2D7D9]">
            <Filter className="w-3.5 h-3.5 text-[#FFA987]" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-transparent text-white outline-none cursor-pointer text-xs"
            >
              <option value="all" className="bg-[#07383D]">All Actions</option>
              <option value="ADMIN_SIGN_IN" className="bg-[#07383D]">ADMIN_SIGN_IN</option>
              <option value="APPROVE_SPACE_VERIFICATION" className="bg-[#07383D]">APPROVE_SPACE_VERIFICATION</option>
              <option value="REVOKE_SPACE_VERIFICATION" className="bg-[#07383D]">REVOKE_SPACE_VERIFICATION</option>
              <option value="ACTIVATE_SPACE" className="bg-[#07383D]">ACTIVATE_SPACE</option>
              <option value="DEACTIVATE_SPACE" className="bg-[#07383D]">DEACTIVATE_SPACE</option>
              <option value="UPDATE_SPACE_DETAILS" className="bg-[#07383D]">UPDATE_SPACE_DETAILS</option>
              <option value="ADMIN_CANCEL_BOOKING" className="bg-[#07383D]">ADMIN_CANCEL_BOOKING</option>
              <option value="UPDATE_USER_ROLE" className="bg-[#07383D]">UPDATE_USER_ROLE</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl bg-[#07383D] border border-[#166D74] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#052427] text-[#8EACB0] uppercase font-bold border-b border-[#166D74] tracking-wider text-[10px]">
              <tr>
                <th className="p-4 w-10"></th>
                <th className="p-4">Action</th>
                <th className="p-4">Target Record</th>
                <th className="p-4">Admin Actor</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#166D74]/40">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[#8EACB0]">
                    <Loader2 className="w-6 h-6 animate-spin text-[#14BEB8] mx-auto mb-2" />
                    Loading audit trail from public.admin_audit_log...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[#8EACB0]">
                    No audit records found matching your query.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const isExpanded = expandedLogId === log.id;
                  return (
                    <React.Fragment key={log.id}>
                      <tr 
                        onClick={() => toggleExpand(log.id)}
                        className={`hover:bg-[#0B4A50]/40 transition-colors cursor-pointer ${
                          isExpanded ? 'bg-[#0B4A50]/60' : ''
                        }`}
                      >
                        <td className="p-4 text-[#8EACB0]">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-[#14BEB8]" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-[#8EACB0]" />
                          )}
                        </td>

                        {/* Action Badge */}
                        <td className="p-4">
                          <span className="font-mono font-bold text-[#FFA987] bg-[#FFA987]/10 px-2 py-0.5 rounded border border-[#FFA987]/30 text-[11px]">
                            {log.action}
                          </span>
                        </td>

                        {/* Target Table & ID */}
                        <td className="p-4">
                          <div className="font-mono font-semibold text-white">
                            {log.table_name}
                          </div>
                          <div className="text-[10px] text-[#8EACB0] font-mono truncate max-w-[160px]" title={log.record_id}>
                            ID: {log.record_id}
                          </div>
                        </td>

                        {/* Admin Actor */}
                        <td className="p-4">
                          <div className="font-semibold text-white">{log.admin_email}</div>
                          {log.admin_id && (
                            <div className="text-[10px] text-[#5D7A7D] font-mono">
                              UID: {log.admin_id.slice(0, 8)}...
                            </div>
                          )}
                        </td>

                        {/* Timestamp */}
                        <td className="p-4 text-[#8EACB0]">
                          <div>{new Date(log.created_at).toLocaleDateString()}</div>
                          <div className="text-[10px] text-[#5D7A7D]">
                            {new Date(log.created_at).toLocaleTimeString()}
                          </div>
                        </td>

                        {/* IP Address */}
                        <td className="p-4 text-right font-mono text-[#8EACB0]">
                          {log.ip_address || '—'}
                        </td>
                      </tr>

                      {/* Expanded JSON Diff View */}
                      {isExpanded && (
                        <tr className="bg-[#052427]/80">
                          <td colSpan={6} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Old Values */}
                              <div className="p-4 rounded-xl bg-[#07383D] border border-[#166D74]/70">
                                <div className="text-xs font-bold text-red-300 mb-2 flex items-center gap-1.5">
                                  <span>Previous State (Old Values)</span>
                                </div>
                                <pre className="font-mono text-[11px] text-[#C2D7D9] bg-[#052427] p-3 rounded-lg overflow-x-auto max-h-60">
                                  {JSON.stringify(log.old_values || {}, null, 2)}
                                </pre>
                              </div>

                              {/* New Values */}
                              <div className="p-4 rounded-xl bg-[#07383D] border border-[#166D74]/70">
                                <div className="text-xs font-bold text-emerald-300 mb-2 flex items-center gap-1.5">
                                  <span>Modified State (New Values)</span>
                                </div>
                                <pre className="font-mono text-[11px] text-[#C2D7D9] bg-[#052427] p-3 rounded-lg overflow-x-auto max-h-60">
                                  {JSON.stringify(log.new_values || {}, null, 2)}
                                </pre>
                              </div>
                            </div>

                            <div className="mt-3 text-[11px] text-[#5D7A7D] flex items-center gap-4">
                              <span>User Agent: {log.user_agent || 'Unknown'}</span>
                              <span>Audit ID: {log.id}</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
