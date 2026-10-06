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
  CreditCard,
  Copy,
  Check,
  MapPin,
  Sparkles,
  Share2
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
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const verifyPaymentSession = async () => {
    setStatus('verifying');
    setErrorMessage(null);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get('reference') || urlParams.get('ref') || urlParams.get('trxref') || urlParams.get('transaction_reference') || '';
      const bookingId = urlParams.get('booking_id') || urlParams.get('bookingId') || '';
      const isSandbox = urlParams.get('sandbox') === 'true';
      const urlStatus = (urlParams.get('status') || '').toLowerCase();
      const isCancelled = urlStatus === 'cancelled' || urlParams.get('cancelled') === 'true';

      setReference(ref);

      // Obtain Supabase Auth Token if available
      const client = getSupabaseClient();
      let token: string | undefined;
      if (client) {
        const sessionRes = await client.auth.getSession();
        token = sessionRes.data.session?.access_token;
      }

      if (isCancelled) {
        if (bookingId) {
          fetch(`/api/bookings/${bookingId}/cancel`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ reason: 'User cancelled payment at checkout' }),
          }).catch(() => {});
        }
        setErrorMessage('Payment was cancelled at checkout. No charges were made.');
        setStatus('failed');
        return;
      }

      if (!bookingId && !ref) {
        throw new Error('Missing payment reference or booking identifier in verification callback.');
      }

      // Call authoritative backend verification endpoint
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          bookingId: bookingId || undefined,
          reference: ref || undefined,
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

      // Instant UI refresh for calendars and listing cards
      window.dispatchEvent(
        new CustomEvent('ofis:booking_confirmed', {
          detail: {
            bookingId: data.booking?.id || bookingId,
            spaceId: data.booking?.spaceId || data.booking?.space_id,
          },
        })
      );

      // Trigger celebration confetti with signature OFIS peach & teal color spectrum
      try {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#FFA987', '#FFD0BD', '#006B70', '#14BEB8', '#00C878', '#FFFFFF'],
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

  const handleCopyPassCode = () => {
    const code = booking?.digitalPassCode || (booking?.id ? `OFIS-${booking.id.slice(-4)}` : '');
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 sm:py-16 bg-[#FFF9F4] dark:bg-[#07383D] transition-colors overflow-hidden">
      {/* Radiant OFIS Brand Ambient Peach & Teal Lighting */}
      <div 
        aria-hidden="true" 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-b from-[#FFA987]/20 via-[#FFD0BD]/15 to-transparent rounded-full blur-3xl pointer-events-none"
      />
      <div 
        aria-hidden="true" 
        className="absolute bottom-10 -right-20 w-80 h-80 bg-[#006B70]/15 dark:bg-[#14BEB8]/15 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative w-full max-w-lg bg-white/95 dark:bg-[#0B4A50]/95 backdrop-blur-md rounded-3xl border border-[#FFA987]/40 dark:border-[#FFA987]/30 shadow-2xl shadow-[#FFA987]/10 p-6 sm:p-8 text-center space-y-6">
        
        {/* State: Verifying */}
        {status === 'verifying' && (
          <div className="space-y-5 py-8">
            <div className="relative w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-[#FFA987]/20 via-[#FFD0BD]/25 to-[#006B70]/15 border border-[#FFA987]/40 flex items-center justify-center shadow-inner">
              <Loader2 className="w-10 h-10 text-[#006B70] dark:text-[#FFA987] animate-spin" />
            </div>
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFA987]/15 text-[#C85A32] dark:text-[#FFA987] border border-[#FFA987]/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Synchronizing Gateway</span>
              </span>
              <h2 className="text-2xl font-black text-[#12383B] dark:text-[#FFFFFF] tracking-tight">
                Verifying Payment...
              </h2>
              <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0] max-w-sm mx-auto leading-relaxed">
                Confirming your transaction with SZND hosted gateway and generating your encrypted turnstile pass credentials.
              </p>
            </div>

            {reference && (
              <div className="pt-2">
                <span className="text-[11px] font-mono text-[#5D7A7D] dark:text-[#B8D1D0] bg-[#FFF9F4] dark:bg-[#07383D] px-3.5 py-1.5 rounded-full border border-[#FFA987]/35 dark:border-[#FFA987]/25 shadow-2xs">
                  Ref: {reference}
                </span>
              </div>
            )}
          </div>
        )}

        {/* State: Success */}
        {status === 'success' && (
          <div className="space-y-6">
            {/* Luminous Signature OFIS Peach Badge */}
            <div className="relative">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-[#FFA987] via-[#FF9270] to-[#E05626] border-2 border-[#FFA987] flex items-center justify-center shadow-xl shadow-[#FFA987]/30 ring-4 ring-[#FFA987]/20">
                <CheckCircle2 className="w-11 h-11 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 sm:right-32 flex items-center justify-center w-6 h-6 rounded-full bg-[#12383B] text-[#FFA987] border border-[#FFA987] shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-[#FFF0E8] dark:bg-[#07383D] text-[#C85A32] dark:text-[#FFA987] border-2 border-[#FFA987]/60 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#C85A32] dark:text-[#FFA987]" />
                <span>Verified & Confirmed via SZND</span>
              </div>
              <h2 className="text-3xl font-black text-[#12383B] dark:text-[#FFFFFF] tracking-tight">
                Booking Confirmed!
              </h2>
              <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0] max-w-sm mx-auto leading-relaxed">
                Your reservation is secured in Lagos, Nigeria. Turnstile Pass and high-speed Wi-Fi access codes have been issued.
              </p>
            </div>

            {/* Elevated Ticket Pass Card with Signature Peach Accents */}
            {booking && (
              <div className="relative text-left rounded-3xl bg-gradient-to-b from-[#FFF9F4] via-[#FFF5EE] to-[#FFF0E8] dark:from-[#07383D] dark:via-[#094147] dark:to-[#0B4A50] border-2 border-[#FFA987]/60 dark:border-[#FFA987]/45 shadow-lg shadow-[#FFA987]/10 p-5 space-y-4">
                {/* Space Title & Paid Amount Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b-2 border-dashed border-[#FFA987]/35 dark:border-[#FFA987]/30">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#C85A32] dark:text-[#FFA987] flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-[#FFA987]" />
                      Reserved Workspace
                    </span>
                    <h3 className="font-extrabold text-base text-[#12383B] dark:text-[#FFFFFF] mt-0.5">
                      {booking.spaceTitle || 'OFIS Workspace'}
                    </h3>
                    {booking.spaceAddress && (
                      <p className="text-[11px] text-[#5D7A7D] dark:text-[#B8D1D0] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#FFA987] shrink-0" />
                        <span className="truncate max-w-[220px]">{booking.spaceAddress}</span>
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-semibold text-[#5D7A7D] dark:text-[#B8D1D0] block">Total Paid</span>
                    <span className="font-mono text-lg font-black text-[#C85A32] dark:text-[#FFA987]">
                      {formatPrice(booking.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Schedule Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-white/90 dark:bg-[#07383D]/90 border border-[#FFA987]/35 dark:border-[#FFA987]/25 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#5D7A7D] dark:text-[#B8D1D0] mb-0.5">
                      <Calendar className="w-3.5 h-3.5 text-[#FFA987]" />
                      <span>Date</span>
                    </div>
                    <span className="font-bold text-[#12383B] dark:text-[#FFFFFF]">
                      {booking.date || 'Today'}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/90 dark:bg-[#07383D]/90 border border-[#FFA987]/35 dark:border-[#FFA987]/25 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#5D7A7D] dark:text-[#B8D1D0] mb-0.5">
                      <Clock className="w-3.5 h-3.5 text-[#FFA987]" />
                      <span>Time & Duration</span>
                    </div>
                    <span className="font-bold text-[#12383B] dark:text-[#FFFFFF]">
                      {booking.startTime || '09:00'} ({booking.durationHours}h)
                    </span>
                  </div>
                </div>

                {/* Turnstile Access Code Peach Box with Copy Button */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#FFF0E8] via-[#FFE5D8] to-[#FFF0E8] dark:from-[#084248] dark:via-[#0E4F56] dark:to-[#084248] border-2 border-[#FFA987] shadow-sm flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#C85A32] dark:text-[#FFA987] block flex items-center gap-1">
                      <Ticket className="w-3.5 h-3.5 text-[#FFA987]" />
                      Turnstile Access Pass
                    </span>
                    <span className="font-mono text-base font-black tracking-wider text-[#12383B] dark:text-[#FFFFFF]">
                      {booking.digitalPassCode || `OFIS-${booking.id?.slice(-4)}`}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyPassCode}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#07383D] hover:bg-[#FFF2EB] dark:hover:bg-[#105A60] border-2 border-[#FFA987] text-xs font-black text-[#C85A32] dark:text-[#FFA987] transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#C85A32] dark:text-[#FFA987]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#FFA987]" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleOpenDigitalPass}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FFA987] via-[#FF8A65] to-[#E05328] hover:from-[#FF9E79] hover:to-[#C85A32] text-[#12383B] hover:text-white font-black text-sm shadow-xl shadow-[#FFA987]/30 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Ticket className="w-4 h-4 text-[#12383B]" />
                <span>Open Digital Turnstile Pass</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setCurrentView('bookings')}
                  className="w-full py-3 rounded-2xl bg-[#FFF9F4] dark:bg-[#07383D] hover:bg-[#FFF0E8] dark:hover:bg-[#105A60] text-[#12383B] dark:text-[#FFA987] font-bold text-xs border-2 border-[#FFA987]/50 dark:border-[#FFA987]/40 transition-colors cursor-pointer shadow-2xs"
                >
                  Go to My Bookings
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentView('explore')}
                  className="w-full py-3 rounded-2xl bg-white dark:bg-[#07383D] hover:bg-[#F8FAF9] dark:hover:bg-[#0B4A50] text-[#5D7A7D] dark:text-[#B8D1D0] font-bold text-xs border border-[#E2ECEB] dark:border-[#166D74] transition-colors cursor-pointer"
                >
                  Explore Directory
                </button>
              </div>
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
              <h2 className="text-2xl font-black text-[#12383B] dark:text-[#FFFFFF]">
                Payment Verification Issue
              </h2>
              <p className="text-xs text-[#EF4444] mt-1 font-medium">
                {errorMessage || 'We were unable to verify this transaction with SZND.'}
              </p>
            </div>

            {reference && (
              <div className="p-3 rounded-xl bg-[#FFF9F4] dark:bg-[#0B4A50] border border-[#FFA987]/35 dark:border-[#FFA987]/25 text-left">
                <span className="text-[10px] text-[#C85A32] dark:text-[#FFA987] uppercase font-mono block">Payment Reference</span>
                <span className="font-mono text-xs font-bold text-[#12383B] dark:text-[#FFFFFF] break-all">
                  {reference}
                </span>
              </div>
            )}

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={verifyPaymentSession}
                className="w-full py-3.5 rounded-2xl bg-[#006B70] hover:bg-[#087E85] text-white font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <RotateCw className="w-4 h-4" />
                <span>Retry Verification</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('bookings')}
                className="w-full py-3 rounded-2xl bg-[#FFF9F4] dark:bg-[#0B4A50] hover:bg-[#FFF2EB] dark:hover:bg-[#105A60] text-[#12383B] dark:text-[#FFA987] font-bold text-xs border border-[#FFA987]/40 dark:border-[#FFA987]/30 transition-colors cursor-pointer"
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
