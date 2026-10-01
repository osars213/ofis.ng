import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Sparkles,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Ban
} from 'lucide-react';
import { Space } from '../../types';
import { calculateBookingPrice } from '../../utils/pricing';
import { getSupabaseClient } from '../../services/supabaseClient';

interface WorkspaceAvailabilityCalendarProps {
  space: Space;
  formatPrice: (amountNgn?: number | null) => string;
  formatTime: (timeStr?: string | null) => string;
  onSelectSlot: (slot: { date: string; startTime: string; durationHours: number }) => void;
  selectedSeatId?: string | null;
}

interface BookedInterval {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  selectedSeatId?: string | null;
  guestCount?: number;
}

function calculateEndTimeString(startTime: string, durationHours: number): string {
  const [h, m] = (startTime || '09:00').split(':').map(Number);
  const totalMinutes = (isNaN(h) ? 9 : h) * 60 + (isNaN(m) ? 0 : m) + (durationHours * 60);
  const endH = Math.min(23, Math.floor(totalMinutes / 60));
  const endM = totalMinutes % 60;
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
}

function intervalsOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  return startA < endB && startB < endA;
}

export const WorkspaceAvailabilityCalendar: React.FC<WorkspaceAvailabilityCalendarProps> = ({
  space,
  formatPrice,
  formatTime,
  onSelectSlot,
  selectedSeatId = null,
}) => {
  const today = new Date();
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    today.toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>('09:00');
  const [durationHours, setDurationHours] = useState<number>(2);
  const [bookedSlots, setBookedSlots] = useState<BookedInterval[]>([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState<boolean>(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const monthPadded = String(month + 1).padStart(2, '0');
  const monthFilter = `${year}-${monthPadded}`;

  // Fetch Authoritative Real Booking Data from Server / Supabase
  const fetchAvailability = useCallback(async () => {
    setIsLoadingAvailability(true);
    try {
      // 1. Try server availability endpoint first
      const res = await fetch(`/api/spaces/${space.id}/availability?month=${monthFilter}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.bookedSlots)) {
          setBookedSlots(data.bookedSlots);
          setLastRefreshedAt(new Date());
          setIsLoadingAvailability(false);
          return;
        }
      }

      // 2. Direct Supabase client query fallback
      const client = getSupabaseClient();
      if (client) {
        const { data, error } = await client
          .from('bookings')
          .select('id, date, start_time, end_time, duration_hours, selected_seat_id, guest_count, status, payment_status')
          .eq('space_id', space.id)
          .in('status', ['confirmed', 'ready_for_checkin', 'checked_in', 'in_progress', 'active'])
          .eq('payment_status', 'paid')
          .like('date', `${monthFilter}%`);

        if (!error && data) {
          const parsed: BookedInterval[] = data.map((b: any) => ({
            id: b.id,
            date: b.date,
            startTime: b.start_time,
            endTime: b.end_time || calculateEndTimeString(b.start_time, b.duration_hours || 1),
            durationHours: b.duration_hours || 1,
            selectedSeatId: b.selected_seat_id || null,
            guestCount: b.guest_count || 1,
          }));
          setBookedSlots(parsed);
          setLastRefreshedAt(new Date());
        }
      }
    } catch (err) {
      console.warn('Could not fetch real-time space availability:', err);
    } finally {
      setIsLoadingAvailability(false);
    }
  }, [space.id, monthFilter]);

  // Real-time Supabase Subscription & Resilient Auto-Sync
  useEffect(() => {
    fetchAvailability();

    const client = getSupabaseClient();
    let channel: any = null;
    if (client) {
      channel = client
        .channel(`public:bookings:${space.id}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'bookings', filter: `space_id=eq.${space.id}` },
          () => {
            fetchAvailability();
          }
        )
        .subscribe();
    }

    // Resilient fallback: periodic re-check every 15 seconds to catch updates if WebSockets pause
    const pollInterval = setInterval(() => {
      fetchAvailability();
    }, 15000);

    // Instant local event listener when a booking confirms in this browser session
    const handleBookingConfirmed = (e: any) => {
      if (!e?.detail?.spaceId || e.detail.spaceId === space.id) {
        fetchAvailability();
      }
    };
    window.addEventListener('ofis:booking_confirmed', handleBookingConfirmed);

    return () => {
      if (client && channel) {
        client.removeChannel(channel);
      }
      clearInterval(pollInterval);
      window.removeEventListener('ofis:booking_confirmed', handleBookingConfirmed);
    };
  }, [space.id, fetchAvailability]);

  // Check if a space type is inherently exclusive (only 1 simultaneous booking allowed per time)
  const isExclusive = useMemo(() => {
    const exclusiveCategories = ['private_office', 'meeting', 'podcast', 'photography', 'event'];
    return exclusiveCategories.includes(space.category || '') || (space.capacity && space.capacity === 1);
  }, [space.category, space.capacity]);

  // Calculate days for the displayed month using REAL bookings
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Array<{
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isPast: boolean;
      isToday: boolean;
      status: 'available' | 'limited' | 'blocked';
      bookedCount: number;
    }> = [];

    // Blank cells before month start
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({
        dateStr: `prev-${i}`,
        dayNumber: 0,
        isCurrentMonth: false,
        isPast: true,
        isToday: false,
        status: 'blocked',
        bookedCount: 0,
      });
    }

    const todayStr = today.toISOString().split('T')[0];
    const blockedDates = space.blockedDates || [];

    // Compute operating hours span
    const openHour = parseInt(space.operatingHours.open.split(':')[0], 10) || 8;
    const closeHour = parseInt(space.operatingHours.close.split(':')[0], 10) || 20;
    const totalOperatingHours = Math.max(1, closeHour - openHour);

    for (let d = 1; d <= daysInMonth; d++) {
      const dayPadded = String(d).padStart(2, '0');
      const dateStr = `${year}-${monthPadded}-${dayPadded}`;
      const isPast = dateStr < todayStr;
      const isToday = dateStr === todayStr;

      // Filter real bookings for this specific date
      const dateBookings = bookedSlots.filter((b) => {
        if (b.date !== dateStr) return false;
        if (selectedSeatId && b.selectedSeatId && b.selectedSeatId !== selectedSeatId) {
          return false;
        }
        return true;
      });

      let status: 'available' | 'limited' | 'blocked' = 'available';

      if (isPast || blockedDates.includes(dateStr)) {
        status = 'blocked';
      } else if (dateBookings.length > 0) {
        if (isExclusive) {
          // Check how many hours are covered
          const totalBookedHours = dateBookings.reduce((sum, b) => sum + (b.durationHours || 1), 0);
          if (totalBookedHours >= totalOperatingHours) {
            status = 'blocked';
          } else {
            status = 'limited';
          }
        } else {
          // Multi-seat space: check capacity
          const spaceCapacity = space.capacity || 50;
          const totalGuests = dateBookings.reduce((sum, b) => sum + (b.guestCount || 1), 0);
          if (totalGuests >= spaceCapacity) {
            status = 'blocked';
          } else {
            status = 'limited';
          }
        }
      }

      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: true,
        isPast,
        isToday,
        status,
        bookedCount: dateBookings.length,
      });
    }

    return days;
  }, [year, month, monthPadded, today, space.blockedDates, space.operatingHours, space.capacity, bookedSlots, selectedSeatId, isExclusive]);

  // Hourly time slots for workspace operating hours
  const baseTimeSlots = useMemo(() => {
    const openHour = parseInt(space.operatingHours.open.split(':')[0], 10) || 8;
    const closeHour = parseInt(space.operatingHours.close.split(':')[0], 10) || 20;
    
    const slots: string[] = [];
    for (let h = openHour; h < closeHour; h++) {
      slots.push(`${String(h).padStart(2, '0')}:00`);
    }
    return slots;
  }, [space.operatingHours]);

  // Determine which time slots are occupied on the currently selected date
  const slotOccupancyMap = useMemo(() => {
    const occupancy: Record<string, { isBooked: boolean; conflictingBooking?: BookedInterval }> = {};
    const targetBookings = bookedSlots.filter((b) => b.date === selectedDateStr);

    baseTimeSlots.forEach((slotTime) => {
      const slotEndTime = calculateEndTimeString(slotTime, 1);
      
      const conflict = targetBookings.find((b) => {
        if (selectedSeatId && b.selectedSeatId && b.selectedSeatId !== selectedSeatId) {
          return false;
        }
        return intervalsOverlap(slotTime, slotEndTime, b.startTime, b.endTime);
      });

      occupancy[slotTime] = {
        isBooked: Boolean(conflict),
        conflictingBooking: conflict,
      };
    });

    return occupancy;
  }, [baseTimeSlots, bookedSlots, selectedDateStr, selectedSeatId]);

  // Auto-switch selected time if currently selected slot is booked
  useEffect(() => {
    if (slotOccupancyMap[selectedTime]?.isBooked) {
      const firstAvailable = baseTimeSlots.find((t) => !slotOccupancyMap[t]?.isBooked);
      if (firstAvailable) {
        setSelectedTime(firstAvailable);
      }
    }
  }, [selectedDateStr, slotOccupancyMap, selectedTime, baseTimeSlots]);

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  const safeMonthDate = currentMonthDate instanceof Date && !isNaN(currentMonthDate.getTime()) ? currentMonthDate : new Date();
  const monthName = safeMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Pricing calculation
  const isWeekend = useMemo(() => {
    if (!selectedDateStr) return false;
    const day = new Date(selectedDateStr).getDay();
    return day === 0 || day === 6;
  }, [selectedDateStr]);

  const bookingPricing = useMemo(() => {
    return calculateBookingPrice(space, {
      durationHours: durationHours,
      quantity: durationHours,
      guests: 1,
      isWeekend: isWeekend,
      selectedPeriod: durationHours === 8 && space.pricePerDay ? 'day' : undefined,
    });
  }, [space, durationHours, isWeekend]);

  const estimatedCost = bookingPricing.totalAmount;

  const handleConfirm = () => {
    onSelectSlot({
      date: selectedDateStr,
      startTime: selectedTime,
      durationHours,
    });
  };

  // Check if current chosen combination is booked
  const selectedProposedEnd = calculateEndTimeString(selectedTime, durationHours);
  const isCurrentSelectionConflicted = useMemo(() => {
    const dateBookings = bookedSlots.filter((b) => b.date === selectedDateStr);
    return dateBookings.some((b) => {
      if (selectedSeatId && b.selectedSeatId && b.selectedSeatId !== selectedSeatId) {
        return false;
      }
      return intervalsOverlap(selectedTime, selectedProposedEnd, b.startTime, b.endTime);
    });
  }, [bookedSlots, selectedDateStr, selectedSeatId, selectedTime, selectedProposedEnd]);

  return (
    <div className="space-y-4 p-6 rounded-3xl bg-[#07383D]/20 border border-[#0B4A50]/40 backdrop-blur-sm">
      
      {/* Header with Live indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-[#F2F2F2]">Real-Time Availability Calendar</h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#14BEB8]/10 text-[#14BEB8] border border-[#14BEB8]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#14BEB8] animate-pulse mr-1.5" />
              Live DB Sync
            </span>
          </div>
          <p className="text-xs text-[#9EABA3] mt-0.5">
            Confirmed reservations update instantly across all members
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[11px] text-[#718079]">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#14BEB8]" />
            <span className="text-[#9EABA3]">Available</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FFA987]" />
            <span className="text-[#9EABA3]">Limited</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#34423E]" />
            <span className="text-[#718079]">Booked</span>
          </div>
          <button
            type="button"
            onClick={() => fetchAvailability()}
            disabled={isLoadingAvailability}
            className="p-1 rounded-lg hover:bg-[#0B4A50]/40 text-[#9EABA3] hover:text-[#14BEB8] transition-colors cursor-pointer"
            title="Refresh availability"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAvailability ? 'animate-spin text-[#14BEB8]' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        
        {/* Calendar Grid (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Month Navigation */}
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-bold text-[#F2F2F2] font-mono tracking-tight">{monthName}</span>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-[#0B4A50]/30 hover:bg-[#0B4A50]/60 text-[#9EABA3] hover:text-[#F2F2F2] transition-colors cursor-pointer border border-[#0B4A50]/40"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-[#0B4A50]/30 hover:bg-[#0B4A50]/60 text-[#9EABA3] hover:text-[#F2F2F2] transition-colors cursor-pointer border border-[#0B4A50]/40"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day of Week Labels */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono font-bold text-[#718079] pb-1">
            <span>SU</span>
            <span>MO</span>
            <span>TU</span>
            <span>WE</span>
            <span>TH</span>
            <span>FR</span>
            <span>SA</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((d, idx) => {
              if (!d.isCurrentMonth) {
                return <div key={`empty-${idx}`} className="h-10 rounded-xl bg-transparent" />;
              }

              const isSelected = selectedDateStr === d.dateStr;
              const isBlocked = d.status === 'blocked';

              return (
                <button
                  key={d.dateStr}
                  type="button"
                  disabled={isBlocked}
                  onClick={() => setSelectedDateStr(d.dateStr)}
                  className={`h-10 sm:h-11 rounded-xl flex flex-col items-center justify-center relative transition-all text-xs font-mono font-bold cursor-pointer ${
                    isSelected
                      ? 'bg-[#14BEB8] text-[#07383D] shadow-lg ring-2 ring-[#14BEB8]/40 scale-105 z-10'
                      : isBlocked
                      ? 'bg-[#0B4A50]/10 text-[#425048] border border-transparent cursor-not-allowed opacity-50'
                      : 'bg-[#0B4A50]/20 text-[#F2F2F2] hover:bg-[#0B4A50]/40 hover:border-[#14BEB8]/50 border border-[#0B4A50]/40'
                  }`}
                >
                  <span>{d.dayNumber}</span>
                  
                  {/* Real Status Indicator Dot */}
                  {!isSelected && !isBlocked && (
                    <span
                      className={`w-1 h-1 rounded-full mt-0.5 ${
                        d.status === 'limited' ? 'bg-[#FFA987]' : 'bg-[#14BEB8]'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Slot & Duration Configuration (5 Cols) */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-[#07383D]/30 border border-[#0B4A50]/40 flex flex-col justify-between space-y-4">
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#F2F2F2] flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#14BEB8]" />
                  <span>Choose Arrival Time</span>
                </label>
                <span className="text-[10px] text-[#9EABA3] font-mono">{selectedDateStr}</span>
              </div>
              
              {/* Hourly arrival slots showing real occupancy */}
              <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {baseTimeSlots.map((time) => {
                  const isBooked = slotOccupancyMap[time]?.isBooked;
                  const isSelected = selectedTime === time;

                  return (
                    <button
                      key={time}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center space-x-1 ${
                        isBooked
                          ? 'bg-[#141816]/60 text-[#55635C] border border-[#232D28] cursor-not-allowed line-through opacity-60'
                          : isSelected
                          ? 'bg-[#14BEB8] text-[#07383D] shadow-md font-extrabold ring-1 ring-[#14BEB8]'
                          : 'bg-[#0B4A50]/20 text-[#9EABA3] hover:text-[#F2F2F2] hover:bg-[#0B4A50]/40 border border-[#0B4A50]/40 cursor-pointer'
                      }`}
                      title={isBooked ? 'This slot has already been reserved and paid for' : `Select ${time}`}
                    >
                      {isBooked ? (
                        <>
                          <Ban className="w-2.5 h-2.5 text-[#FFA987] mr-1" />
                          <span>{formatTime(time)}</span>
                        </>
                      ) : (
                        <span>{formatTime(time)}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Duration Selector */}
            <div>
              <label className="text-xs font-bold text-[#F2F2F2] mb-2 block">
                Session Duration
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[1, 2, 4, 8].map((hrs) => (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setDurationHours(hrs)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      durationHours === hrs
                        ? 'bg-[#14BEB8] text-[#07383D] shadow-md ring-1 ring-[#14BEB8]'
                        : 'bg-[#0B4A50]/20 text-[#9EABA3] hover:text-[#F2F2F2] hover:bg-[#0B4A50]/40 border border-[#0B4A50]/40'
                    }`}
                  >
                    {hrs === 8 ? 'Full Day' : `${hrs} hrs`}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Preview & Collision Notice */}
            <div className="p-3 rounded-xl bg-[#0B4A50]/20 border border-[#0B4A50]/40 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[#718079]">Estimated Amount</div>
                <div className="text-sm font-bold text-[#14BEB8] font-mono">
                  {formatPrice(estimatedCost)}
                </div>
              </div>
              <div className="text-right text-[10px] text-[#9EABA3]">
                {selectedDateStr} • {formatTime(selectedTime)} – {formatTime(selectedProposedEnd)}
              </div>
            </div>

            {isCurrentSelectionConflicted && (
              <div className="p-2.5 rounded-xl bg-[#FFA987]/10 border border-[#FFA987]/30 flex items-center space-x-2 text-xs text-[#FFA987]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Selected window overlaps an existing reservation. Please pick an open slot.</span>
              </div>
            )}
          </div>

          {/* Book Slot CTA */}
          <button
            type="button"
            disabled={isCurrentSelectionConflicted}
            onClick={handleConfirm}
            className={`w-full py-3 rounded-xl font-extrabold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 ${
              isCurrentSelectionConflicted
                ? 'bg-[#0B4A50]/30 text-[#55635C] cursor-not-allowed border border-[#0B4A50]/40'
                : 'bg-[#14BEB8] hover:bg-[#28D2CB] text-[#07383D] active:scale-95 cursor-pointer shadow-[#14BEB8]/10'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {isCurrentSelectionConflicted
                ? 'Time Slot Unavailable'
                : `Reserve Slot (${selectedDateStr} @ ${formatTime(selectedTime)})`}
            </span>
          </button>

        </div>

      </div>

    </div>
  );
};
