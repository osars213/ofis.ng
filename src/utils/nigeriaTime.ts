/**
 * OFIS Nigeria Time & Clock Synchronization Utility
 *
 * Nigeria standard time is West Africa Time (WAT) = UTC+1 (all year, no DST).
 * IANA Timezone: Africa/Lagos
 */

export interface NigeriaNow {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number; // 0-23
  minute: number; // 0-59
  dateStr: string; // YYYY-MM-DD
  timeStr: string; // HH:mm (24h)
  time12Str: string; // e.g. 8:30 PM
  formattedDate: string; // e.g. Wed, Sep 30, 2026
  nextSlotTime: string; // HH:mm rounded to next available half hour / hour
}

/**
 * Returns current date, time, and parsed components for Africa/Lagos (WAT, UTC+1).
 */
export function getNigeriaNow(): NigeriaNow {
  const now = new Date();
  
  // Format parts according to Africa/Lagos
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const getPart = (type: string) => parts.find(p => p.type === type)?.value || '00';

  const year = parseInt(getPart('year'), 10);
  const month = parseInt(getPart('month'), 10);
  const day = parseInt(getPart('day'), 10);
  const hour = parseInt(getPart('hour'), 10);
  const minute = parseInt(getPart('minute'), 10);

  const monthPadded = String(month).padStart(2, '0');
  const dayPadded = String(day).padStart(2, '0');
  const hourPadded = String(hour).padStart(2, '0');
  const minPadded = String(minute).padStart(2, '0');

  const dateStr = `${year}-${monthPadded}-${dayPadded}`;
  const timeStr = `${hourPadded}:${minPadded}`;

  // Next slot: rounded up to next 30 or 60 min mark
  let nextHour = hour;
  let nextMin = 0;
  if (minute < 30) {
    nextMin = 30;
  } else {
    nextHour = (hour + 1) % 24;
    nextMin = 0;
  }
  const nextSlotTime = `${String(nextHour).padStart(2, '0')}:${String(nextMin).padStart(2, '0')}`;

  // 12-hour formatted time
  let h12 = hour % 12;
  if (h12 === 0) h12 = 12;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const time12Str = `${h12}:${minPadded} ${ampm}`;

  // Formatted date string
  const dateObj = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return {
    year,
    month,
    day,
    hour,
    minute,
    dateStr,
    timeStr,
    time12Str,
    formattedDate,
    nextSlotTime,
  };
}

/**
 * Returns today's date in Nigeria format 'YYYY-MM-DD'
 */
export function getNigeriaTodayString(): string {
  return getNigeriaNow().dateStr;
}

/**
 * Returns tomorrow's date in Nigeria format 'YYYY-MM-DD'
 */
export function getNigeriaTomorrowString(): string {
  const { year, month, day } = getNigeriaNow();
  const d = new Date(Date.UTC(year, month - 1, day + 1));
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dayStr = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${dayStr}`;
}

/**
 * Check if a date + time combination is in the past according to Lagos time.
 */
export function isSlotInPastInNigeria(dateStr: string, timeStr: string, graceMinutes = 10): boolean {
  const current = getNigeriaNow();
  if (dateStr < current.dateStr) return true;
  if (dateStr > current.dateStr) return false;

  // On the same day, compare time in minutes
  const [h, m] = (timeStr || '09:00').split(':').map(Number);
  const slotMinutes = (isNaN(h) ? 9 : h) * 60 + (isNaN(m) ? 0 : m);
  const currentMinutes = current.hour * 60 + current.minute;

  return slotMinutes < (currentMinutes - graceMinutes);
}

/**
 * Comprehensive time slots covering morning to late night operating hours (06:00 to 23:30)
 */
export const EXTENDED_TIME_SLOTS = [
  '06:00', '07:00', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
  '22:00', '22:30', '23:00'
];

/**
 * Filters time slots appropriate for a space given today's current Lagos time
 */
export function getAvailableTimeSlotsForDate(
  dateStr: string,
  openTime = '07:00',
  closeTime = '23:00'
): string[] {
  const isToday = dateStr === getNigeriaTodayString();
  const current = getNigeriaNow();
  const currentMinutes = current.hour * 60 + current.minute;

  const [openH, openM] = openTime.split(':').map(Number);
  const openMinutes = (openH || 7) * 60 + (openM || 0);

  const [closeH, closeM] = closeTime.split(':').map(Number);
  const closeMinutes = (closeH || 23) * 60 + (closeM || 0);

  return EXTENDED_TIME_SLOTS.filter((slot) => {
    const [h, m] = slot.split(':').map(Number);
    const slotMinutes = h * 60 + m;

    // Must be within open and close window (or up to close time)
    if (slotMinutes < openMinutes || slotMinutes > closeMinutes) {
      return false;
    }

    // If today, filter out past slots (allowing a 15-min grace window for instant check-in)
    if (isToday && slotMinutes < currentMinutes - 15) {
      return false;
    }

    return true;
  });
}
