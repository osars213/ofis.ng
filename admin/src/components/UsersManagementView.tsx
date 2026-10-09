import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  RefreshCw, 
  AlertCircle, 
  ShieldCheck, 
  UserCheck, 
  Building2, 
  Loader2, 
  ArrowUpDown,
  Lock
} from 'lucide-react';
import { UserRow } from '../types';
import { AdminApiClient } from '../services/adminApiClient';
import { useAdminAuth } from '../context/AdminAuthContext';

export const UsersManagementView: React.FC = () => {
  const { adminUser } = useAdminAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);

  // Role modification state
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [targetRole, setTargetRole] = useState<'user' | 'host' | 'admin'>('user');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // User suspension state
  const [suspendingUser, setSuspendingUser] = useState<UserRow | null>(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [isSubmittingSuspend, setIsSubmittingSuspend] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await AdminApiClient.getUsers({
        role: roleFilter === 'all' ? undefined : roleFilter,
        search: search.trim() || undefined,
      });
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleRoleChangeConfirm = async () => {
    if (!editingUser) return;
    setIsUpdatingRole(true);
    try {
      await AdminApiClient.updateUserRole(editingUser.id, targetRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, role: targetRole } : u))
      );
      setEditingUser(null);
    } catch (err: any) {
      alert(`Role update rejected: ${err.message}`);
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const handleConfirmUserSuspend = async (isSuspending: boolean) => {
    if (!suspendingUser) return;
    setIsSubmittingSuspend(true);
    try {
      await AdminApiClient.suspendUser(suspendingUser.id, isSuspending, suspendReason);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === suspendingUser.id
            ? { ...u, company: isSuspending ? '[SUSPENDED]' : '' }
            : u
        )
      );
      setSuspendingUser(null);
      setSuspendReason('');
    } catch (err: any) {
      alert(`User suspension failed: ${err.message}`);
    } finally {
      setIsSubmittingSuspend(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">User & Role Governance</h1>
          <p className="text-xs text-[#8EACB0] mt-1">
            Authoritative RBAC management. Profile roles can only be changed by database administrators.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#07383D] border border-[#166D74] hover:bg-[#0B4A50] text-xs font-semibold text-[#C2D7D9] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#14BEB8] ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Users
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
            placeholder="Search by user name or email address..."
            className="w-full bg-[#052427] border border-[#166D74] focus:border-[#14BEB8] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-[#5D7A7D] outline-none"
          />
        </form>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#052427] border border-[#166D74] rounded-xl px-2.5 py-1.5 text-xs text-[#C2D7D9]">
            <Filter className="w-3.5 h-3.5 text-[#14BEB8]" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-white outline-none cursor-pointer text-xs"
            >
              <option value="all" className="bg-[#07383D]">All Roles</option>
              <option value="user" className="bg-[#07383D]">Members (User)</option>
              <option value="host" className="bg-[#07383D]">Space Hosts</option>
              <option value="admin" className="bg-[#07383D]">Administrators</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-[#07383D] border border-[#166D74] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#052427] text-[#8EACB0] uppercase font-bold border-b border-[#166D74] tracking-wider text-[10px]">
              <tr>
                <th className="p-4">User Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone / Company</th>
                <th className="p-4">Current Role</th>
                <th className="p-4">Member Since</th>
                <th className="p-4 text-right">RBAC Governance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#166D74]/40">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[#8EACB0]">
                    <Loader2 className="w-6 h-6 animate-spin text-[#14BEB8] mx-auto mb-2" />
                    Loading profiles from Supabase...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[#8EACB0]">
                    No users found matching your query.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isCurrentAdmin = user.id === adminUser?.id;
                  return (
                    <tr key={user.id} className="hover:bg-[#0B4A50]/40 transition-colors">
                      {/* Name */}
                      <td className="p-4">
                        <div className="font-bold text-white text-xs">{user.name || 'Member'}</div>
                        <div className="text-[10px] text-[#5D7A7D] font-mono mt-0.5">
                          ID: {user.id.slice(0, 16)}...
                        </div>
                      </td>

                      {/* Email */}
                      <td className="p-4 font-medium text-[#C2D7D9]">
                        {user.email}
                      </td>

                      {/* Phone / Company */}
                      <td className="p-4 text-[#8EACB0]">
                        {user.company ? (
                          <div>{user.company}</div>
                        ) : (
                          <div>{user.phone || '—'}</div>
                        )}
                      </td>

                      {/* Role Badge */}
                      <td className="p-4">
                        {user.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFA987]/15 border border-[#FFA987]/30 text-[#FFA987] font-bold text-[11px]">
                            <ShieldCheck className="w-3 h-3" />
                            Admin
                          </span>
                        ) : user.role === 'host' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#14BEB8]/15 border border-[#14BEB8]/30 text-[#14BEB8] font-bold text-[11px]">
                            <Building2 className="w-3 h-3" />
                            Host
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-semibold text-[11px]">
                            <UserCheck className="w-3 h-3" />
                            User
                          </span>
                        )}
                      </td>

                      {/* Date Joined */}
                      <td className="p-4 text-[#8EACB0]">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right space-x-2">
                        {isCurrentAdmin ? (
                          <span className="text-[10px] text-[#5D7A7D] flex items-center justify-end gap-1">
                            <Lock className="w-3 h-3" />
                            Current Session
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingUser(user);
                                setTargetRole(user.role);
                              }}
                              className="px-2.5 py-1 rounded-lg border border-[#166D74] bg-[#052427] hover:bg-[#0B4A50] text-[#14BEB8] text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <ArrowUpDown className="w-3 h-3" />
                              Role
                            </button>

                            <button
                              onClick={() => {
                                setSuspendingUser(user);
                                setSuspendReason('');
                              }}
                              className="px-2.5 py-1 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              {user.company?.includes('[SUSPENDED]') ? 'Unsuspend' : 'Suspend'}
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suspend User Modal */}
      {suspendingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#07383D] border border-red-500/30 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              {suspendingUser.company?.includes('[SUSPENDED]') ? 'Unsuspend User Account' : 'Suspend User Account'}
            </h3>
            <p className="text-xs text-[#8EACB0] mb-4">
              Member: <span className="text-white font-semibold">{suspendingUser.name}</span> ({suspendingUser.email}).
            </p>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#C2D7D9]">
                Action Justification / Audit Reason
              </label>
              <textarea
                rows={3}
                required
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="e.g., Repeated booking no-shows, policy violation, or fraud prevention..."
                className="w-full bg-[#052427] border border-[#166D74] focus:border-red-400 rounded-xl p-3 text-xs text-white placeholder-[#5D7A7D] outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#166D74]/60">
              <button
                type="button"
                onClick={() => setSuspendingUser(null)}
                className="px-4 py-2 rounded-xl border border-[#166D74] text-xs font-semibold text-[#C2D7D9] hover:bg-[#0B4A50] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingSuspend}
                onClick={() => handleConfirmUserSuspend(!suspendingUser.company?.includes('[SUSPENDED]'))}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {isSubmittingSuspend && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{suspendingUser.company?.includes('[SUSPENDED]') ? 'Confirm Unsuspend' : 'Confirm Suspension'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#07383D] border border-[#166D74] rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              Modify User Role: {editingUser.name}
            </h3>
            <p className="text-xs text-[#8EACB0] mb-4">
              Updating account permissions for <span className="text-white font-medium">{editingUser.email}</span>. Only database administrators can change role attributes.
            </p>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#C2D7D9]">
                Select New System Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['user', 'host', 'admin'] as const).map((r) => {
                  const isSelected = targetRole === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setTargetRole(r)}
                      className={`p-3 rounded-xl border text-center font-bold text-xs capitalize transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#14BEB8] bg-[#14BEB8] text-[#052427] shadow-lg'
                          : 'border-[#166D74] bg-[#052427] text-[#C2D7D9] hover:bg-[#0B4A50]'
                      }`}
                    >
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-[#052427] border border-[#166D74]/70 text-[11px] text-[#8EACB0]">
              <span className="font-semibold text-white">Security Rule:</span> Every role modification is immediately recorded in <span className="text-[#FFA987] font-mono">public.admin_audit_log</span> with the caller's admin ID, timestamp, and IP address.
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#166D74]/60">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-xl border border-[#166D74] text-xs font-semibold text-[#C2D7D9] hover:bg-[#0B4A50] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpdatingRole || targetRole === editingUser.role}
                onClick={handleRoleChangeConfirm}
                className="px-4 py-2 rounded-xl bg-[#14BEB8] text-[#052427] text-xs font-bold hover:bg-[#10ABA5] transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isUpdatingRole && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Apply Role Change</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
