import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Wallet, 
  Bell, 
  Layers,
  AlertTriangle,
  Mail,
  Lock,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { getSpacePricing, calculateBookingPrice, formatSpaceRate, formatPriceNGN } from '../utils/pricing';
import { getSupabaseClient } from '../services/supabaseClient';
import { 
  getNigeriaNow, 
  getNigeriaTodayString, 
  getNigeriaTomorrowString, 
  getAvailableTimeSlotsForDate,
  EXTENDED_TIME_SLOTS 
} from '../utils/nigeriaTime';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    checkoutSpace,
    currentUser,
    createBooking,
    setActiveDigitalPassBooking,
    setIsDigitalPassOpen,
    checkoutPrefillSlot,
    formatPrice,
    formatTime,
    openEmailVerificationModal,
    verifyUserEmail,
    triggerAppAction,
  } = useApp();

  const isEmailVerified = currentUser?.isEmailVerified ?? false;
  
  // Real-time Nigeria WAT (UTC+1, Lagos)
  const [nigeriaNow, setNigeriaNow] = useState(() => getNigeriaNow());
  
  // Update live clock every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNigeriaNow(getNigeriaNow());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const todayStr = nigeriaNow.dateStr;
  const tomorrowStr = useMemo(() => getNigeriaTomorrowString(), []);

  const [quantity, setQuantity] = useState(2); // hours, days, months, or sessions
  const [date, setDate] = useState(todayStr);
  const [startTime, setStartTime] = useState(nigeriaNow.nextSlotTime || '09:00');
  const [guests, setGuests] = useState(1);
  const [remindMe, setRemindMe] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'sznd' | 'wallet'>('sznd');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Synchronize slot options based on space operating hours and Nigeria current time
  const timeOptions = useMemo(() => {
    const open = checkoutSpace?.operatingHours?.open || '07:00';
    const close = checkoutSpace?.operatingHours?.close || '23:00';
    const slots = getAvailableTimeSlotsForDate(date, open, close);
    if (slots.length === 0) {
      // If late at night and today slots have passed, provide all slots for booking
      return EXTENDED_TIME_SLOTS.filter(s => s >= open && s <= close);
    }
    return slots;
  }, [date, checkoutSpace]);

  // Adjust start time if current selection is not available in timeOptions
  useEffect(() => {
    if (timeOptions.length > 0 && !timeOptions.includes(startTime)) {
      setStartTime(timeOptions[0]);
    }
  }, [timeOptions, startTime]);

  // Listen to external pre-fill (e.g. from calendar or sticky bar)
  useEffect(() => {
    if (isCheckoutOpen && checkoutPrefillSlot) {
      if (checkoutPrefillSlot.date) {
        setDate(checkoutPrefillSlot.date);
      }
      if (checkoutPrefillSlot.startTime) {
        setStartTime(checkoutPrefillSlot.startTime);
      }
    }
  }, [isCheckoutOpen, checkoutPrefillSlot]);

  // Adjust default quantity based on pricing period
  useEffect(() => {
    if (checkoutSpace) {
      const pricing = getSpacePricing(checkoutSpace);
      if (pricing.period === 'hour') {
        setQuantity(2);
      } else if (pricing.period === 'day') {
        setQuantity(1);
      } else if (pricing.period === 'month') {
        setQuantity(1);
      } else if (pricing.period === 'session') {
        setQuantity(1);
      }
    }
  }, [checkoutSpace]);

  if (!isCheckoutOpen || !checkoutSpace) return null;

  const pricing = getSpacePricing(checkoutSpace);
  const maxCapacity = checkoutSpace.capacity || 20;

  const breakdown = calculateBookingPrice(checkoutSpace, {
    quantity,
    guests,
    durationHours: pricing.period === 'hour' ? quantity : (pricing.sessionDurationHours ? pricing.sessionDurationHours * quantity : quantity * 8),
  });

  const handleConfirmPay = async () => {
    // 🔒 Gating Check: User must verify email before payment
    if (!currentUser.isEmailVerified) {
      openEmailVerificationModal('payment');
      return;
    }

    setCheckoutError(null);
    setIsProcessing(true);
    triggerAppAction(3000);

    const durationHoursCalculated = pricing.period === 'hour' 
      ? quantity 
      : (pricing.sessionDurationHours ? pricing.sessionDurationHours * quantity : quantity * 8);

    // 1. Wallet Payment Channel
    if (paymentMethod === 'wallet') {
      if ((currentUser.walletBalanceNgn ?? 0) < breakdown.totalAmount) {
        setCheckoutError(`Insufficient wallet balance. You need ₦${breakdown.totalAmount.toLocaleString()} but currently have ₦${(currentUser.walletBalanceNgn ?? 0).toLocaleString()}.`);
        setIsProcessing(false);
        return;
      }

      const newBooking = createBooking({
        spaceId: checkoutSpace.id,
        spaceTitle: checkoutSpace.title,
        spaceImage: checkoutSpace.featuredImage,
        spaceAddress: checkoutSpace.address,
        spaceCity: checkoutSpace.city,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        userPhone: currentUser.phone,
        date,
        startTime,
        durationHours: durationHoursCalculated,
        guestCount: pricing.basis === 'person' ? guests : 1,
        totalAmount: breakdown.totalAmount,
        currency: 'NGN',
        status: 'confirmed',
        hasReminder: remindMe,
        pricingBasis: pricing.basis,
        pricingPeriod: pricing.period,
        pricingModel: pricing,
        priceBreakdown: breakdown,
        paymentMethod: 'wallet',
        paymentReference: `OFIS-WALLET-${Date.now().toString(36).toUpperCase()}`,
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00C878', '#FFFFFF', '#07383D'],
        });
      } catch (e) {
        // Safe fallback if confetti canvas not ready
      }

      setIsProcessing(false);
      setIsCheckoutOpen(false);
      setActiveDigitalPassBooking(newBooking);
      setIsDigitalPassOpen(true);
      return;
    }

    // 2. SZND Hosted Checkout Gateway Flow
    try {
      // Create pending reservation in local and Supabase storage
      const newBooking = createBooking({
        spaceId: checkoutSpace.id,
        spaceTitle: checkoutSpace.title,
        spaceImage: checkoutSpace.featuredImage,
        spaceAddress: checkoutSpace.address,
        spaceCity: checkoutSpace.city,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        userPhone: currentUser.phone,
        date,
        startTime,
        durationHours: durationHoursCalculated,
        guestCount: pricing.basis === 'person' ? guests : 1,
        totalAmount: breakdown.totalAmount,
        currency: 'NGN',
        status: 'pending',
        hasReminder: remindMe,
        pricingBasis: pricing.basis,
        pricingPeriod: pricing.period,
        pricingModel: pricing,
        priceBreakdown: breakdown,
        paymentMethod: 'sznd',
        paymentReference: `pending_${Date.now()}`,
      });

      // Fetch Supabase session token if user is authenticated
      const client = getSupabaseClient();
      let token: string | undefined;
      if (client) {
        const sessionRes = await client.auth.getSession();
        token = sessionRes.data.session?.access_token;
      }

      const callbackUrl = `${window.location.origin}/payment/result?booking_id=${encodeURIComponent(newBooking.id)}`;

      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          bookingId: newBooking.id,
          spaceId: checkoutSpace.id,
          email: currentUser.email,
          callbackUrl,
          paymentMethod: 'sznd',
          date,
          startTime,
          durationHours: durationHoursCalculated,
          guests: pricing.basis === 'person' ? guests : 1,
          quantity,
          userName: currentUser.name,
          userPhone: currentUser.phone,
        }),
      });

      const initData = await res.json();
      if (!res.ok || !initData.success || !initData.checkout_link) {
        if (res.status === 409 || initData.conflict) {
          throw new Error(initData.error || 'The selected workspace or seat was just booked by another member. Please choose another time or seat.');
        }
        throw new Error(initData.error || 'Failed to initialize SZND checkout');
      }

      // Close modal and redirect user to SZND hosted checkout
      setIsCheckoutOpen(false);
      setIsProcessing(false);

      window.location.href = initData.checkout_link;
    } catch (err: any) {
      console.error('[Checkout SZND Error]:', err);
      setCheckoutError(err.message || 'Payment initialization with SZND failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 dark:bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      {/* Screen-Fitted Balanced Dialog: 2-Column on Desktop for 100% viewport presence with zero scrolling */}
      <div className="relative w-full max-w-lg md:max-w-3xl lg:max-w-4xl bg-white dark:bg-[#07383D] rounded-3xl border border-[#E5E7EB] dark:border-[#166D74] shadow-2xl p-4 sm:p-5 md:p-6 transition-all flex flex-col justify-between max-h-[96vh]">
        
        {/* Header with Live Nigeria Time Sync Badge */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#166D74] pb-3 mb-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <h3 className="text-base sm:text-lg font-bold text-[#111827] dark:text-[#F2F2F2]">
              Instant Pass Reservation
            </h3>
            
            <span className="text-[10px] font-mono font-bold bg-[#006B70]/15 dark:bg-[#006B70]/20 text-[#006B70] dark:text-[#28D2CB] px-2 py-0.5 rounded-full border border-[#006B70]/30 uppercase">
              {pricing.basis === 'person' ? 'Per Person' : 'Whole Space'} • {pricing.period}
            </span>

            {/* Nigeria Clock Synchronization Indicator */}
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
              <Clock className="w-3 h-3 text-emerald-500" />
              <span>Lagos WAT: {nigeriaNow.time12Str}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-xl text-[#6B7280] dark:text-[#718079] hover:text-[#111827] dark:hover:text-[#F2F2F2] hover:bg-[#F1F5F9] dark:hover:bg-[#105A60] transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Column Responsive Body: Left (Space & Parameters), Right (Payment, Breakdown & CTA) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 md:gap-5 items-start overflow-y-auto pr-0.5 scrollbar-none">
          
          {/* ========================================================
              LEFT COLUMN: Space Summary, Date, Time & Attendees
             ======================================================== */}
          <div className="space-y-3">
            
            {/* Space Summary Compact Card */}
            <div className="flex items-center space-x-3 p-2.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B4A50] border border-[#E5E7EB] dark:border-[#166D74]">
              <img
                src={checkoutSpace.featuredImage}
                alt={checkoutSpace.title}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-[#111827] dark:text-[#F2F2F2] truncate">{checkoutSpace.title}</h4>
                <p className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] truncate">{checkoutSpace.neighborhood}, {checkoutSpace.city}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono font-bold text-[#006B70] dark:text-[#28D2CB]">
                    {formatSpaceRate(checkoutSpace)}
                  </span>
                  {pricing.sessionDurationHours && (
                    <span className="text-[10px] text-[#6B7280] dark:text-[#718079] bg-white dark:bg-[#07383D] px-1.5 py-0.5 rounded border border-[#E5E7EB] dark:border-[#166D74]">
                      {pricing.sessionDurationHours}h block
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Reservation Date Picker */}
            <div className="space-y-1">
              <label className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] font-semibold flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#006B70] dark:text-[#28D2CB]" />
                  <span>Reservation Date</span>
                </span>
                <span className="text-[10px] font-mono text-[#006B70] dark:text-[#28D2CB]">{date === todayStr ? 'Today' : date === tomorrowStr ? 'Tomorrow' : date}</span>
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="date"
                  value={date}
                  min={todayStr}
                  onChange={(e) => setDate(e.target.value)}
                  className="flex-1 p-2 rounded-xl bg-white dark:bg-[#105A60] border border-[#E5E7EB] dark:border-[#166D74] text-xs text-[#111827] dark:text-[#F2F2F2] focus:outline-none focus:border-[#006B70] font-mono cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setDate(todayStr)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    date === todayStr
                      ? 'bg-[#006B70] text-white shadow-2xs'
                      : 'bg-[#F8FAFC] dark:bg-[#0B4A50] text-[#6B7280] dark:text-[#94A3B8] border border-[#E5E7EB] dark:border-[#166D74] hover:text-[#111827] dark:hover:text-[#F2F2F2]'
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setDate(tomorrowStr)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    date === tomorrowStr
                      ? 'bg-[#006B70] text-white shadow-2xs'
                      : 'bg-[#F8FAFC] dark:bg-[#0B4A50] text-[#6B7280] dark:text-[#94A3B8] border border-[#E5E7EB] dark:border-[#166D74] hover:text-[#111827] dark:hover:text-[#F2F2F2]'
                  }`}
                >
                  Tomorrow
                </button>
              </div>
            </div>

            {/* Duration & Start Time (2-Column Grid) */}
            <div className="grid grid-cols-2 gap-2.5">
              
              {/* Duration Quantity */}
              <div className="space-y-1">
                <label className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] font-semibold flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#006B70] dark:text-[#28D2CB]" />
                  <span>
                    {pricing.period === 'hour' && 'Duration (Hours)'}
                    {pricing.period === 'day' && 'Duration (Days)'}
                    {pricing.period === 'month' && 'Duration (Months)'}
                    {pricing.period === 'session' && 'Session Qty'}
                  </span>
                </label>

                {pricing.period === 'hour' && (
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-white dark:bg-[#105A60] border border-[#E5E7EB] dark:border-[#166D74] text-xs text-[#111827] dark:text-[#F2F2F2] focus:outline-none focus:border-[#006B70] cursor-pointer font-mono"
                  >
                    <option value={1}>1 Hour</option>
                    <option value={2}>2 Hours</option>
                    <option value={3}>3 Hours</option>
                    <option value={4}>4 Hours (Half-Day)</option>
                    <option value={8}>8 Hours (Full-Day)</option>
                    <option value={12}>12 Hours (Sprint)</option>
                  </select>
                )}

                {pricing.period === 'day' && (
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-white dark:bg-[#105A60] border border-[#E5E7EB] dark:border-[#166D74] text-xs text-[#111827] dark:text-[#F2F2F2] focus:outline-none focus:border-[#006B70] cursor-pointer font-mono"
                  >
                    <option value={1}>1 Day Pass</option>
                    <option value={2}>2 Days</option>
                    <option value={3}>3 Days</option>
                    <option value={5}>5 Days (Work Week)</option>
                    <option value={7}>7 Days (Full Week)</option>
                    <option value={14}>14 Days (Bi-weekly)</option>
                  </select>
                )}

                {pricing.period === 'month' && (
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-white dark:bg-[#105A60] border border-[#E5E7EB] dark:border-[#166D74] text-xs text-[#111827] dark:text-[#F2F2F2] focus:outline-none focus:border-[#006B70] cursor-pointer font-mono"
                  >
                    <option value={1}>1 Month (Flexible)</option>
                    <option value={3}>3 Months (Quarterly)</option>
                    <option value={6}>6 Months (Semi-annual)</option>
                    <option value={12}>12 Months (Annual)</option>
                  </select>
                )}

                {pricing.period === 'session' && (
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-white dark:bg-[#105A60] border border-[#E5E7EB] dark:border-[#166D74] text-xs text-[#111827] dark:text-[#F2F2F2] focus:outline-none focus:border-[#006B70] cursor-pointer font-mono"
                  >
                    <option value={1}>1 Session {pricing.sessionDurationHours ? `(${pricing.sessionDurationHours} hrs)` : ''}</option>
                    <option value={2}>2 Sessions</option>
                    <option value={3}>3 Sessions</option>
                    <option value={4}>4 Sessions</option>
                  </select>
                )}
              </div>

              {/* Start Time (Synced with Nigeria WAT operating window) */}
              <div className="space-y-1">
                <label className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] font-semibold flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#006B70] dark:text-[#28D2CB]" />
                  <span>Start Time</span>
                </label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white dark:bg-[#105A60] border border-[#E5E7EB] dark:border-[#166D74] text-xs text-[#111827] dark:text-[#F2F2F2] focus:outline-none focus:border-[#006B70] cursor-pointer font-mono"
                >
                  {timeOptions.map((t) => (
                    <option key={t} value={t}>
                      {formatTime(t)}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Attendees / Guest Count */}
            {pricing.basis === 'person' ? (
              <div className="space-y-1">
                <label className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] font-semibold flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Users className="w-3.5 h-3.5 text-[#006B70] dark:text-[#28D2CB]" />
                    <span>Number of People / Seats</span>
                  </span>
                  <span className="text-[10px] text-[#6B7280] dark:text-[#718079]">Max: {maxCapacity} seats</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-10 h-8 rounded-xl bg-[#F8FAFC] dark:bg-[#0B4A50] border border-[#E5E7EB] dark:border-[#166D74] text-sm font-bold text-[#111827] dark:text-[#F2F2F2] hover:bg-[#F1F5F9] dark:hover:bg-[#105A60] cursor-pointer flex items-center justify-center shadow-2xs"
                  >
                    -
                  </button>
                  <div className="flex-1 py-1.5 rounded-xl bg-white dark:bg-[#0B4A50] border border-[#E5E7EB] dark:border-[#166D74] text-center font-mono text-xs font-bold text-[#006B70] dark:text-[#28D2CB]">
                    {guests} {guests === 1 ? 'Person' : 'People'}
                  </div>
                  <button
                    type="button"
                    onClick={() => setGuests(Math.min(maxCapacity, guests + 1))}
                    className="w-10 h-8 rounded-xl bg-[#F8FAFC] dark:bg-[#0B4A50] border border-[#E5E7EB] dark:border-[#166D74] text-sm font-bold text-[#111827] dark:text-[#F2F2F2] hover:bg-[#F1F5F9] dark:hover:bg-[#105A60] cursor-pointer flex items-center justify-center shadow-2xs"
                  >
                    +
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0B4A50] border border-[#E5E7EB] dark:border-[#166D74] flex items-center justify-between text-xs text-[#6B7280] dark:text-[#718079]">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#006B70] dark:text-[#28D2CB]" />
                  <span>Entire Space Buyout</span>
                </span>
                <span className="text-[11px] text-[#4B5563] dark:text-[#94A3B8] font-mono">
                  Up to {maxCapacity} Attendees Included
                </span>
              </div>
            )}

          </div>

          {/* ========================================================
              RIGHT COLUMN: Payment Method, Reminders, Breakdown & CTA
             ======================================================== */}
          <div className="space-y-3 flex flex-col justify-between">
            
            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] font-semibold uppercase tracking-wider font-mono">
                Payment Method
              </label>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('sznd')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'sznd'
                      ? 'bg-[#006B70]/15 dark:bg-[#006B70]/20 border-[#006B70] text-[#111827] dark:text-[#F2F2F2] shadow-2xs'
                      : 'bg-[#F8FAFC] dark:bg-[#0B4A50] border-[#E5E7EB] dark:border-[#166D74] text-[#6B7280] dark:text-[#94A3B8]'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#006B70] dark:text-[#28D2CB]" />
                    <span>SZND Hosted</span>
                  </div>
                  <p className="text-[10px] text-[#6B7280] dark:text-[#718079] mt-0.5">Cards, Transfer, USSD</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'wallet'
                      ? 'bg-[#006B70]/15 dark:bg-[#006B70]/20 border-[#006B70] text-[#111827] dark:text-[#F2F2F2] shadow-2xs'
                      : 'bg-[#F8FAFC] dark:bg-[#0B4A50] border-[#E5E7EB] dark:border-[#166D74] text-[#6B7280] dark:text-[#94A3B8]'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-[#006B70] dark:text-[#28D2CB]" />
                    <span>OFIS Wallet</span>
                  </div>
                  <p className="text-[10px] text-[#6B7280] dark:text-[#718079] mt-0.5 font-mono">
                    ₦{(currentUser?.walletBalanceNgn ?? 0).toLocaleString()} Avail.
                  </p>
                </button>
              </div>
            </div>

            {/* Remind Me Toggle (Compact Row) */}
            <div 
              id="checkout-remind-toggle"
              onClick={() => setRemindMe(!remindMe)}
              className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0B4A50] border border-[#E5E7EB] dark:border-[#166D74] hover:border-[#006B70]/30 transition-all cursor-pointer select-none"
            >
              <div className="flex items-center space-x-2">
                <Bell className={`w-3.5 h-3.5 ${remindMe ? 'text-[#006B70] dark:text-[#28D2CB]' : 'text-[#6B7280]'}`} />
                <span className="text-xs font-semibold text-[#111827] dark:text-[#F2F2F2]">
                  Entrance Pass SMS &amp; Email Reminder (30m prior)
                </span>
              </div>

              <div className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 ${
                remindMe ? 'bg-[#006B70]' : 'bg-[#E5E7EB] dark:bg-[#166D74]'
              }`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  remindMe ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </div>
            </div>

            {/* Cost Breakdown Card */}
            <div className="p-3 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B4A50] border border-[#E5E7EB] dark:border-[#166D74] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6B7280] dark:text-[#94A3B8]">
                <span>Base Rate ({breakdown.rateDescription})</span>
                <span className="text-[#111827] dark:text-[#F2F2F2] font-mono font-medium">{formatPrice(breakdown.subtotal)}</span>
              </div>
              {breakdown.discount > 0 && (
                <div className="flex justify-between text-[#006B70] dark:text-[#28D2CB]">
                  <span>Duration Discount</span>
                  <span className="font-mono">-{formatPrice(breakdown.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#6B7280] dark:text-[#94A3B8]">
                <span>Power &amp; High-Speed Internet Access</span>
                <span className="text-[#006B70] dark:text-[#28D2CB] font-medium">Included Free</span>
              </div>
              <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#166D74] flex justify-between font-bold text-sm text-[#111827] dark:text-[#F2F2F2]">
                <span>Total Pass Cost</span>
                <span className="text-base text-[#006B70] dark:text-[#28D2CB] font-mono">{formatPrice(breakdown.totalAmount)}</span>
              </div>
            </div>

            {/* Error Banner */}
            {checkoutError && (
              <div className="p-2.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444] font-medium flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{checkoutError}</span>
                </div>
              </div>
            )}

            {/* Email Verification Gate Banner */}
            {!isEmailVerified && (
              <div className="p-2.5 rounded-xl bg-[#FEF3C7] dark:bg-[#FFB800]/10 border border-[#F59E0B]/30 space-y-1.5">
                <div className="flex items-center justify-between text-[#D97706] dark:text-[#FFB800] text-xs font-bold">
                  <div className="flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Email Verification Required</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => verifyUserEmail()}
                    className="underline text-[11px] cursor-pointer"
                  >
                    1-Tap Verify
                  </button>
                </div>
                <p className="text-[10px] text-[#6B7280] dark:text-[#94A3B8]">
                  Required before booking to deliver turnstile digital QR pass.
                </p>
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleConfirmPay}
              className={`w-full py-3 px-4 rounded-2xl font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-98 flex items-center justify-center space-x-2 cursor-pointer ${
                !isEmailVerified
                  ? 'bg-[#F59E0B] hover:bg-[#D97706] text-white'
                  : 'bg-[#006B70] hover:bg-[#0EA8A2] text-white'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{paymentMethod === 'sznd' ? 'Connecting to SZND Gateway...' : 'Securing Pass...'}</span>
                </>
              ) : !isEmailVerified ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Verify Email to Book ({formatPrice(breakdown.totalAmount)})</span>
                </>
              ) : (
                <>
                  <span>
                    {paymentMethod === 'sznd' 
                      ? `Proceed to SZND Hosted Checkout (${formatPrice(breakdown.totalAmount)})` 
                      : `Pay with OFIS Wallet (${formatPrice(breakdown.totalAmount)})`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
