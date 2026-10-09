import React, { useEffect, useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Loader2,
  Download,
  Activity
} from 'lucide-react';
import { PaymentRow } from '../types';
import { AdminApiClient } from '../services/adminApiClient';

export const PaymentsManagementView: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const [checkingPaymentId, setCheckingPaymentId] = useState<string | null>(null);
  const [statusCheckToast, setStatusCheckToast] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await AdminApiClient.getPayments({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: search.trim() || undefined,
      });
      setPayments(data.payments);
    } catch (err: any) {
      setError(err.message || 'Failed to load payments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPayments();
  };

  const handleCheckLiveStatus = async (payment: PaymentRow) => {
    setCheckingPaymentId(payment.id);
    try {
      const res = await AdminApiClient.checkPaymentStatus(payment.id);
      setStatusCheckToast(`Payment ${payment.reference}: ${res.notes || 'Status confirmed'}`);
      if (res.currentStatus !== payment.status) {
        setPayments((prev) =>
          prev.map((p) => (p.id === payment.id ? { ...p, status: res.currentStatus } : p))
        );
      }
      setTimeout(() => setStatusCheckToast(null), 5000);
    } catch (err: any) {
      alert(`Live status check failed: ${err.message}`);
    } finally {
      setCheckingPaymentId(null);
    }
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      await AdminApiClient.downloadPaymentsCsv();
    } catch (err: any) {
      alert(`Export failed: ${err.message}`);
    } finally {
      setIsExporting(false);
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
          <h1 className="text-xl font-bold text-white tracking-tight">Payments & Gateway Transactions</h1>
          <p className="text-xs text-[#8EACB0] mt-1">Immutable settlement records from SZNDPAY hosted checkout gateway.</p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#006B70]/30 border border-[#14BEB8]/40 hover:bg-[#006B70]/50 text-xs font-semibold text-[#14BEB8] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <button
            onClick={fetchPayments}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#07383D] border border-[#166D74] hover:bg-[#0B4A50] text-xs font-semibold text-[#C2D7D9] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#14BEB8] ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Payments
          </button>
        </div>
      </div>

      {statusCheckToast && (
        <div className="p-3.5 rounded-xl bg-[#14BEB8]/15 border border-[#14BEB8]/40 text-[#14BEB8] text-xs flex items-center gap-2 animate-fadeIn">
          <Activity className="w-4 h-4 shrink-0" />
          <span>{statusCheckToast}</span>
        </div>
      )}

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
            placeholder="Search by SZND payment reference or booking ID..."
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
              <option value="success" className="bg-[#07383D]">Successful Only</option>
              <option value="pending" className="bg-[#07383D]">Pending Only</option>
              <option value="failed" className="bg-[#07383D]">Failed / Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="rounded-2xl bg-[#07383D] border border-[#166D74] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#052427] text-[#8EACB0] uppercase font-bold border-b border-[#166D74] tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Payment Reference</th>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Amount (NGN)</th>
                <th className="p-4">Gateway Provider</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Settlement Status</th>
                <th className="p-4 text-right">Live Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#166D74]/40">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#8EACB0]">
                    <Loader2 className="w-6 h-6 animate-spin text-[#14BEB8] mx-auto mb-2" />
                    Loading payments from Supabase...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#8EACB0]">
                    No payments found matching your query.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => {
                  const isChecking = checkingPaymentId === payment.id;
                  return (
                    <tr key={payment.id} className="hover:bg-[#0B4A50]/40 transition-colors">
                      {/* Reference */}
                      <td className="p-4">
                        <div className="font-mono font-bold text-white text-xs">{payment.reference}</div>
                        <div className="text-[10px] text-[#5D7A7D] font-mono mt-0.5 truncate max-w-[160px]">
                          ID: {payment.id}
                        </div>
                      </td>

                      {/* Booking ID */}
                      <td className="p-4">
                        <span className="font-mono text-[#14BEB8] font-semibold">
                          {payment.booking_id}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="p-4 font-bold text-white text-sm">
                        {formatNaira(payment.amount)}
                      </td>

                      {/* Provider */}
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-[#052427] text-[#FFA987] border border-[#166D74] font-medium uppercase text-[10px]">
                          {payment.provider || 'SZND'}
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td className="p-4 text-[#8EACB0]">
                        {new Date(payment.created_at).toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {payment.status === 'success' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3 h-3" />
                            Successful
                          </span>
                        ) : payment.status === 'failed' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 font-semibold text-[11px]">
                            <XCircle className="w-3 h-3" />
                            Failed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold text-[11px]">
                            <Clock className="w-3 h-3" />
                            {payment.status}
                          </span>
                        )}
                      </td>

                      {/* Action: Check Live Gateway Status */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleCheckLiveStatus(payment)}
                          disabled={isChecking}
                          title="Query SZND gateway live to resolve stuck or pending payments"
                          className="px-2.5 py-1 rounded-lg border border-[#166D74] bg-[#052427] hover:bg-[#0B4A50] text-[#14BEB8] text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {isChecking ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Checking...</span>
                            </>
                          ) : (
                            <>
                              <Activity className="w-3 h-3" />
                              <span>Check status</span>
                            </>
                          )}
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
    </div>
  );
};

