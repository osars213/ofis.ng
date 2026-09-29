import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ArrowRight, 
  Ticket, 
  RotateCw, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  Clock, 
  CreditCard 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { getSupabaseClient } from '../services/supabaseClient';
import { Booking } from '../types';

export const PaymentResultView: React.FC = () => {
  const { 
    setCurrentView, 
    setActiveDigitalPassBooking, 
    setIsDigitalPassOpen, 
    refreshBookings,
    formatPrice 
  } = useApp();

  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [reference, setReference] = useState<string>('');

  const verifyPaymentSession = async () => {
    setStatus('verifying');
    setErrorMessage(null);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get('reference') || urlParams.get('ref') || urlParams.get('trxref') || '';
      const bookingId = urlParams.get('booking_id') || urlParams.get('bookingId') || '';
      const isSandbox = urlParams.get('sandbox') === 'true';

      setReference(ref);

      if (!bookingId || !ref) {
        throw new Error('Missing payment reference or booking identifier in verification callback.');
      }

      // Obtain Supabase Auth Token if available
      const client = getSupabaseClient();
      let token: string | undefined;
      if (client) {
        const sessionRes = await client.auth.getSession();
        token = sessionRes.data.session?.access_token;
      }

      // Call authoritative backend verification endpoint
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          bookingId,
          reference: ref,
          sandbox: isSandbox,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Payment verification could not be confirmed by SZND.');
      }

      setBooking(data.booking);
      setStatus('success');

      // Refresh global bookings state
      refreshBookings().catch(() => {});

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00C878', '#14B8A6', '#006B70', '#FFFFFF'],
        });
      } catch (e) {
        // Fallback if canvas is not initialized
      }
    } catch (err: any) {
      console.error('[PaymentResultView] Verification failed:', err);
      setErrorMessage(err.message || 'We could not verify your payment with SZND. Please try again.');
      setStatus('failed');
    }
  };

  useEffect(() => {
    verifyPaymentSession();
  }, []);

  const handleOpenDigitalPass = () => {
    if (booking) {
      setActiveDigitalPassBooking(booking);
      setIsDigitalPassOpen(true);
    }
    setCurrentView('bookings');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg bg-white dark:bg-[#07383D] rounded-3xl border border-[#E5E7EB] dark:border-[#166D74] shadow-2xl p-6 sm:p-8 text-center space-y-6">
        
        {/* State: Verifying */}
        {status === 'verifying' && (
          <div className="space-y-4 py-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#006B70]/10 dark:bg-[#006B70]/20 flex items-center justify-center text-[#006B70] dark:text-[#28D2CB]">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-[#111827] dark:text-[#F2F2F2]">
              Verifying SZND Payment...
            </h2>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] max-w-sm mx-auto">
              Please wait while our server securely verifies your transaction with the SZND hosted checkout gateway.
            </p>
            {reference && (
              <div className="pt-2">
                <span className="text-[11px] font-mono text-[#6B7280] dark:text-[#718079] bg-[#F8FAFC] dark:bg-[#0B4A50] px-3 py-1 rounded-full border border-[#E5E7EB] dark:border-[#166D74]">
                  Ref: {reference}
                </span>
              </div>
            )}
          </div>
        )}

        {/* State: Success */}
        {status === 'success' && (
          <div className="space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#14BEB8]/15 dark:bg-[#14BEB8]/20 flex items-center justify-center text-[#14BEB8]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#14BEB8]/15 text-[#14BEB8] border border-[#14BEB8]/30 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Payment Confirmed via SZND</span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#111827] dark:text-[#F2F2F2]">
                Booking Confirmed!
              </h2>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] mt-1">
                Your workspace reservation is confirmed and your Turnstile Digital Pass is ready.
              </p>
            </div>

            {/* Booking Summary Box */}
            {booking && (
              <div className="text-left p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B4A50] border border-[#E5E7EB] dark:border-[#166D74] space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB] dark:border-[#166D74]">
                  <span className="font-semibold text-[#111827] dark:text-[#F2F2F2] flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#006B70] dark:text-[#28D2CB]" />
                    {booking.spaceTitle || 'Workspace'}
                  </span>
                  <span className="font-mono font-bold text-[#006B70] dark:text-[#28D2CB]">
                    {formatPrice(booking.totalAmount)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[#6B7280] dark:text-[#94A3B8]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#006B70]" />
                    <span>{booking.date || 'Today'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#006B70]" />
                    <span>{booking.startTime || '09:00'} ({booking.durationHours}h)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#166D74] flex items-center justify-between text-[11px]">
                  <span className="text-[#6B7280] dark:text-[#718079]">Turnstile Code</span>
                  <span className="font-mono font-bold text-[#111827] dark:text-[#F2F2F2] bg-white dark:bg-[#07383D] px-2 py-0.5 rounded border border-[#E5E7EB] dark:border-[#166D74]">
                    {booking.digitalPassCode || `OFIS-${booking.id?.slice(-4)}`}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleOpenDigitalPass}
                className="w-full py-3.5 rounded-2xl bg-[#006B70] hover:bg-[#0EA8A2] text-white font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Ticket className="w-4 h-4" />
                <span>View Digital Turnstile Pass</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('explore')}
                className="w-full py-3 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B4A50] hover:bg-[#F1F5F9] dark:hover:bg-[#105A60] text-[#6B7280] dark:text-[#94A3B8] font-bold text-xs border border-[#E5E7EB] dark:border-[#166D74] transition-colors cursor-pointer"
              >
                Back to Workspace Directory
              </button>
            </div>
          </div>
        )}

        {/* State: Failed */}
        {status === 'failed' && (
          <div className="space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#EF4444]/15 dark:bg-[#EF4444]/20 flex items-center justify-center text-[#EF4444]">
              <XCircle className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-[#111827] dark:text-[#F2F2F2]">
                Payment Verification Issue
              </h2>
              <p className="text-xs text-[#EF4444] mt-1 font-medium">
                {errorMessage || 'We were unable to verify this transaction with SZND.'}
              </p>
            </div>

            {reference && (
              <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0B4A50] border border-[#E5E7EB] dark:border-[#166D74] text-left">
                <span className="text-[10px] text-[#6B7280] dark:text-[#718079] uppercase font-mono block">Payment Reference</span>
                <span className="font-mono text-xs font-bold text-[#111827] dark:text-[#F2F2F2] break-all">
                  {reference}
                </span>
              </div>
            )}

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={verifyPaymentSession}
                className="w-full py-3.5 rounded-2xl bg-[#006B70] hover:bg-[#0EA8A2] text-white font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <RotateCw className="w-4 h-4" />
                <span>Retry Verification</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('bookings')}
                className="w-full py-3 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B4A50] hover:bg-[#F1F5F9] dark:hover:bg-[#105A60] text-[#6B7280] dark:text-[#94A3B8] font-bold text-xs border border-[#E5E7EB] dark:border-[#166D74] transition-colors cursor-pointer"
              >
                Go to My Bookings
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
