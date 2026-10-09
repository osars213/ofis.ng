import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Power, 
  Zap, 
  Wifi, 
  Edit, 
  RefreshCw, 
  AlertCircle,
  Eye,
  SlidersHorizontal,
  Loader2
} from 'lucide-react';
import { SpaceRow } from '../types';
import { AdminApiClient } from '../services/adminApiClient';

export const SpacesManagementView: React.FC = () => {
  const [spaces, setSpaces] = useState<SpaceRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Edit Space Price Modal State
  const [editingSpace, setEditingSpace] = useState<SpaceRow | null>(null);
  const [editPricePerHour, setEditPricePerHour] = useState<number>(0);
  const [editPricePerDay, setEditPricePerDay] = useState<number>(0);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Suspend / Reject Space Modal State
  const [suspendingSpace, setSuspendingSpace] = useState<SpaceRow | null>(null);
  const [suspendActionType, setSuspendActionType] = useState<'suspend' | 'reject'>('suspend');
  const [suspendReason, setSuspendReason] = useState('');
  const [isSubmittingSuspend, setIsSubmittingSuspend] = useState(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const fetchSpaces = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await AdminApiClient.getSpaces({
        status: statusFilter === 'all' ? undefined : statusFilter,
        category: categoryFilter === 'all' ? undefined : categoryFilter,
        search: search.trim() || undefined,
      });
      setSpaces(data.spaces);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch spaces');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSpaces();
  };

  const handleToggleVerify = async (space: SpaceRow) => {
    setActionInProgress(space.id);
    try {
      const newStatus = !space.is_verified;
      await AdminApiClient.verifySpace(space.id, newStatus);
      setSpaces((prev) =>
        prev.map((s) => (s.id === space.id ? { ...s, is_verified: newStatus } : s))
      );
      if (newStatus) {
        setNotificationToast(`Space "${space.title}" approved & verified. Host notified.`);
        setTimeout(() => setNotificationToast(null), 4000);
      }
    } catch (err: any) {
      alert(`Verification update failed: ${err.message}`);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleToggleActive = async (space: SpaceRow) => {
    setActionInProgress(space.id);
    try {
      const newStatus = !space.is_active;
      await AdminApiClient.toggleSpaceActive(space.id, newStatus);
      setSpaces((prev) =>
        prev.map((s) => (s.id === space.id ? { ...s, is_active: newStatus } : s))
      );
    } catch (err: any) {
      alert(`Status update failed: ${err.message}`);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleConfirmSuspendOrReject = async () => {
    if (!suspendingSpace || !suspendReason.trim()) return;
    setIsSubmittingSuspend(true);
    try {
      if (suspendActionType === 'suspend') {
        await AdminApiClient.suspendSpace(suspendingSpace.id, suspendReason.trim());
        setSpaces((prev) =>
          prev.map((s) => (s.id === suspendingSpace.id ? { ...s, is_active: false, is_verified: false } : s))
        );
        setNotificationToast(`Space "${suspendingSpace.title}" suspended with notice dispatched to host.`);
      } else {
        await AdminApiClient.rejectSpace(suspendingSpace.id, suspendReason.trim());
        setSpaces((prev) =>
          prev.map((s) => (s.id === suspendingSpace.id ? { ...s, is_verified: false, is_active: false } : s))
        );
        setNotificationToast(`Space "${suspendingSpace.title}" rejected with explanation sent to host.`);
      }
      setTimeout(() => setNotificationToast(null), 4000);
      setSuspendingSpace(null);
      setSuspendReason('');
    } catch (err: any) {
      alert(`Operation failed: ${err.message}`);
    } finally {
      setIsSubmittingSuspend(false);
    }
  };

  const handleSavePriceEdit = async () => {
    if (!editingSpace) return;
    setIsSavingEdit(true);
    try {
      await AdminApiClient.updateSpace(editingSpace.id, {
        price_per_hour: editPricePerHour,
        price_per_day: editPricePerDay,
      });
      setSpaces((prev) =>
        prev.map((s) =>
          s.id === editingSpace.id
            ? { ...s, price_per_hour: editPricePerHour, price_per_day: editPricePerDay }
            : s
        )
      );
      setEditingSpace(null);
    } catch (err: any) {
      alert(`Failed to update space pricing: ${err.message}`);
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Spaces Network Management</h1>
          <p className="text-xs text-[#8EACB0] mt-1">Review, verify, toggle online status, and modify space rates across Nigeria.</p>
        </div>
        <button
          onClick={fetchSpaces}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#07383D] border border-[#166D74] hover:bg-[#0B4A50] text-xs font-semibold text-[#C2D7D9] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#14BEB8] ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Spaces
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
            placeholder="Search by space title, city, neighborhood..."
            className="w-full bg-[#052427] border border-[#166D74] focus:border-[#14BEB8] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-[#5D7A7D] outline-none"
          />
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#052427] border border-[#166D74] rounded-xl px-2.5 py-1.5 text-xs text-[#C2D7D9]">
            <Filter className="w-3.5 h-3.5 text-[#14BEB8]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-white outline-none cursor-pointer text-xs"
            >
              <option value="all" className="bg-[#07383D]">All Statuses</option>
              <option value="active" className="bg-[#07383D]">Active Only</option>
              <option value="inactive" className="bg-[#07383D]">Offline / Inactive</option>
              <option value="pending" className="bg-[#07383D]">Pending Verification</option>
              <option value="verified" className="bg-[#07383D]">Verified Only</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#052427] border border-[#166D74] rounded-xl px-2.5 py-1.5 text-xs text-[#C2D7D9]">
            <Building2 className="w-3.5 h-3.5 text-[#FFA987]" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-white outline-none cursor-pointer text-xs"
            >
              <option value="all" className="bg-[#07383D]">All Categories</option>
              <option value="coworking" className="bg-[#07383D]">Coworking</option>
              <option value="private_office" className="bg-[#07383D]">Private Office</option>
              <option value="meeting" className="bg-[#07383D]">Meeting Room</option>
              <option value="podcast" className="bg-[#07383D]">Podcast Studio</option>
              <option value="photography" className="bg-[#07383D]">Photography Studio</option>
              <option value="event" className="bg-[#07383D]">Event Space</option>
            </select>
          </div>
        </div>
      </div>

      {/* Spaces Data Table */}
      <div className="rounded-2xl bg-[#07383D] border border-[#166D74] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#052427] text-[#8EACB0] uppercase font-bold border-b border-[#166D74] tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Workspace & Location</th>
                <th className="p-4">Category</th>
                <th className="p-4">Pricing</th>
                <th className="p-4">Infrastructure</th>
                <th className="p-4">Verification</th>
                <th className="p-4">Online Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#166D74]/40">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#8EACB0]">
                    <Loader2 className="w-6 h-6 animate-spin text-[#14BEB8] mx-auto mb-2" />
                    Loading spaces from Supabase...
                  </td>
                </tr>
              ) : spaces.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#8EACB0]">
                    No workspaces found matching your search or filters.
                  </td>
                </tr>
              ) : (
                spaces.map((space) => {
                  const isBusy = actionInProgress === space.id;
                  return (
                    <tr key={space.id} className="hover:bg-[#0B4A50]/40 transition-colors">
                      {/* Title & Location */}
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{space.title}</div>
                        <div className="text-[11px] text-[#8EACB0] mt-0.5">
                          {space.neighborhood}, {space.city}
                        </div>
                        <div className="text-[10px] text-[#5D7A7D] font-mono mt-0.5">
                          ID: {space.id}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-[#052427] text-[#14BEB8] border border-[#166D74] font-medium capitalize">
                          {space.category.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Pricing */}
                      <td className="p-4">
                        <div className="font-semibold text-white">
                          ₦{space.price_per_hour?.toLocaleString()}/hr
                        </div>
                        {space.price_per_day && (
                          <div className="text-[11px] text-[#8EACB0]">
                            ₦{space.price_per_day?.toLocaleString()}/day
                          </div>
                        )}
                      </td>

                      {/* Power & WiFi */}
                      <td className="p-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                          <Zap className="w-3.5 h-3.5 shrink-0" />
                          <span>{space.power_uptime_guarantee_percent}% Uptime</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#14BEB8] text-[11px]">
                          <Wifi className="w-3.5 h-3.5 shrink-0" />
                          <span>{space.internet_speed_mbps} Mbps</span>
                        </div>
                      </td>

                      {/* Verification Status */}
                      <td className="p-4">
                        {space.is_verified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold text-[11px]">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold text-[11px]">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Pending Review
                          </span>
                        )}
                      </td>

                      {/* Active Status */}
                      <td className="p-4">
                        {space.is_active ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                            Online
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[#8EACB0] font-medium text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-zinc-500 inline-block" />
                            Offline
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right space-x-2">
                        {/* Verify / Unverify */}
                        <button
                          onClick={() => handleToggleVerify(space)}
                          disabled={isBusy}
                          title={space.is_verified ? 'Revoke Verification' : 'Approve Space'}
                          className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                            space.is_verified
                              ? 'border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                          }`}
                        >
                          {space.is_verified ? 'Unverify' : 'Approve'}
                        </button>

                        {/* Toggle Active */}
                        <button
                          onClick={() => handleToggleActive(space)}
                          disabled={isBusy}
                          title={space.is_active ? 'Take Offline' : 'Publish Online'}
                          className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                            space.is_active
                              ? 'border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20'
                              : 'border-[#14BEB8]/30 bg-[#14BEB8]/10 text-[#14BEB8] hover:bg-[#14BEB8]/20'
                          }`}
                        >
                          {space.is_active ? 'Deactivate' : 'Activate'}
                        </button>

                        {/* Suspend or Reject Space with Reason */}
                        <button
                          onClick={() => {
                            setSuspendingSpace(space);
                            setSuspendActionType(space.is_verified ? 'suspend' : 'reject');
                            setSuspendReason('');
                          }}
                          disabled={isBusy}
                          title={space.is_verified ? 'Suspend Space' : 'Reject Space'}
                          className="p-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          {space.is_verified ? 'Suspend' : 'Reject'}
                        </button>

                        {/* Edit Pricing */}
                        <button
                          onClick={() => {
                            setEditingSpace(space);
                            setEditPricePerHour(space.price_per_hour);
                            setEditPricePerDay(space.price_per_day || 0);
                          }}
                          title="Edit Rates"
                          className="p-1.5 rounded-lg border border-[#166D74] bg-[#052427] hover:bg-[#0B4A50] text-[#C2D7D9] transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suspend / Reject Space Modal */}
      {suspendingSpace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#07383D] border border-red-500/30 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              {suspendActionType === 'suspend' ? 'Suspend Space Listing' : 'Reject Space Verification'}
            </h3>
            <p className="text-xs text-[#8EACB0] mb-4">
              Workspace: <span className="text-white font-semibold">{suspendingSpace.title}</span>. The host ({suspendingSpace.host_email || 'host account'}) will be notified of this action.
            </p>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#C2D7D9]">
                Mandatory Reason / Remediation Instructions
              </label>
              <textarea
                rows={3}
                required
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="e.g., Photos do not match physical address, backup generator maintenance verification failed..."
                className="w-full bg-[#052427] border border-[#166D74] focus:border-red-400 rounded-xl p-3 text-xs text-white placeholder-[#5D7A7D] outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#166D74]/60">
              <button
                type="button"
                onClick={() => setSuspendingSpace(null)}
                className="px-4 py-2 rounded-xl border border-[#166D74] text-xs font-semibold text-[#C2D7D9] hover:bg-[#0B4A50] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingSuspend || !suspendReason.trim()}
                onClick={handleConfirmSuspendOrReject}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmittingSuspend && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm & Notify Host</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Pricing Modal */}
      {editingSpace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#07383D] border border-[#166D74] rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Edit Workspace Rates</h3>
            <p className="text-xs text-[#8EACB0] mb-4">
              Updating rates for <span className="text-white font-semibold">{editingSpace.title}</span>. Any modification will be logged in the audit trail.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#C2D7D9] mb-1">
                  Hourly Rate (NGN)
                </label>
                <input
                  type="number"
                  value={editPricePerHour}
                  onChange={(e) => setEditPricePerHour(Number(e.target.value))}
                  className="w-full bg-[#052427] border border-[#166D74] focus:border-[#14BEB8] rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C2D7D9] mb-1">
                  Daily Rate (NGN)
                </label>
                <input
                  type="number"
                  value={editPricePerDay}
                  onChange={(e) => setEditPricePerDay(Number(e.target.value))}
                  className="w-full bg-[#052427] border border-[#166D74] focus:border-[#14BEB8] rounded-xl px-3.5 py-2 text-sm text-white outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#166D74]/60">
              <button
                type="button"
                onClick={() => setEditingSpace(null)}
                className="px-4 py-2 rounded-xl border border-[#166D74] text-xs font-semibold text-[#C2D7D9] hover:bg-[#0B4A50] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSavingEdit}
                onClick={handleSavePriceEdit}
                className="px-4 py-2 rounded-xl bg-[#14BEB8] text-[#052427] text-xs font-bold hover:bg-[#10ABA5] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {isSavingEdit && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save & Audit Log</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
