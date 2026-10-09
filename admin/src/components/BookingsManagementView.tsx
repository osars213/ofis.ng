import React, { useEffect, useState } from 'react';
import { 
  CalendarCheck, 
  Search, 
  Filter, 
  RefreshCw, 
  AlertCircle, 
  XCircle, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  User, 
  CreditCard 
} from 'lucide-react';
import { BookingRow } from '../types';
import { AdminApiClient } from '../services/adminApiClient';

export const BookingsManagementView: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);

  // Cancellation modal state
  const [cancellingBooking, setCancellingBooking] = useState<BookingRow | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await AdminApiClient.getBookings({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: search.trim() || undefined,
      });
      setBookings(data.bookings);
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleConfirmCancel = async () => {
    if (!cancellingBooking) return;
    setIsCancelling(true);
    try {
      await AdminApiClient.cancelBooking(cancellingBooking.id, cancelReason || 'Cancelled by administrator');
      setBookings((prev) =>
        prev.map((b) =>
          b.id === cancellingBooking.id
            ? { ...b, status: 'cancelled', cancellation_reason: cancelReason }
            : b
        )
      );
      setCancellingBooking(null);
      setCancelReason('');
    } catch (err: any) {
      alert(`Failed to cancel booking: ${err.message}`);
    } finally {
      setIsCancelling(false);
    }
  };

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Platform Bookings Management</h1>
          <p className="text-xs text-[#8EACB0] mt-1">Review live member reservations, verify payment bindings, and handle administrative cancellations.</p>
        </div>
        <button
          onClick={fetchBookings}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#07383D] border border-[#166D74] hover:bg-[#0B4A50] text-xs font-semibold text-[#C2D7D9] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#14BEB8] ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Bookings
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
            placeholder="Search by booking ID, user email, space title, or payment reference..."
            className="w-full bg-[#052427] border border-[#166D74] focus:border-[#14BEB8] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-[#5D7A7D] outline-none"
          />
        </form>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#052427] border border-[#166D74] rounded-xl px-2.5 py-1.5 text-xs text-[#C2D7D9]">
            <Filter className="w-3.5 h-3.5 text-[#14BEB8]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-white outline-none cursor-pointer text-xs"
            >
              <option value="all" className="bg-[#07383D]">All Statuses</option>
              <option value="confirmed" className="bg-[#07383D]">Confirmed</option>
              <option value="pending" className="bg-[#07383D]">Pending Payment</option>
              <option value="cancelled" className="bg-[#07383D]">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-2xl bg-[#07383D] border border-[#166D74] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#052427] text-[#8EACB0] uppercase font-bold border-b border-[#166D74] tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Space</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#166D74]/40">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#8EACB0]">
                    <Loader2 className="w-6 h-6 animate-spin text-[#14BEB8] mx-auto mb-2" />
                    Loading bookings from Supabase...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#8EACB0]">
                    No bookings found matching your search.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-[#0B4A50]/40 transition-colors">
                    {/* Booking ID & Reference */}
                    <td className="p-4">
                      <div className="font-mono font-bold text-white text-xs">{booking.id}</div>
                      {booking.payment_reference && (
                        <div className="text-[10px] text-[#8EACB0] font-mono mt-0.5 truncate max-w-[140px]" title={booking.payment_reference}>
                          Ref: {booking.payment_reference}
                        </div>
                      )}
                    </td>

                    {/* Space */}
                    <td className="p-4">
                      <div className="font-bold text-white text-xs">{booking.space_title}</div>
                      <div className="text-[11px] text-[#8EACB0]">{booking.space_city}</div>
                    </td>

                    {/* Member */}
                    <td className="p-4">
                      <div className="font-semibold text-white text-xs">{booking.user_name || 'Member'}</div>
                      <div className="text-[11px] text-[#8EACB0]">{booking.user_email}</div>
                    </td>

                    {/* Date & Time */}
                    <td className="p-4">
                      <div className="text-white font-medium">{booking.date}</div>
                      <div className="text-[11px] text-[#8EACB0]">
                        {booking.start_time} ({booking.duration_hours}h)
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="p-4 font-bold text-white">
                      {formatNaira(booking.total_amount)}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      {booking.status === 'confirmed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          Confirmed
                        </span>
                      ) : booking.status === 'cancelled' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 font-semibold text-[11px]">
                          <XCircle className="w-3 h-3" />
                          Cancelled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold text-[11px]">
                          <Clock className="w-3 h-3" />
                          {booking.status}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => {
                            setCancellingBooking(booking);
                            setCancelReason('');
                          }}
                          className="px-2.5 py-1 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancel Booking Modal */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#07383D] border border-[#166D74] rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Cancel Booking {cancellingBooking.id}</h3>
            <p className="text-xs text-[#8EACB0] mb-4">
              Cancelling this confirmed reservation will release the reserved slots and create an immutable audit record.
            </p>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#C2D7D9]">
                Cancellation Reason
              </label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g., Host emergency, customer requested cancellation, or maintenance..."
                className="w-full bg-[#052427] border border-[#166D74] focus:border-[#14BEB8] rounded-xl p-3 text-xs text-white placeholder-[#5D7A7D] outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#166D74]/60">
              <button
                type="button"
                onClick={() => setCancellingBooking(null)}
                className="px-4 py-2 rounded-xl border border-[#166D74] text-xs font-semibold text-[#C2D7D9] hover:bg-[#0B4A50] transition-colors cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {isCancelling && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Cancellation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
