import type { ClockFormat, DayInfo, CalendarEvent } from '../types';

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getDaysInMonth(year: number, month: number): number {
  const days = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[month];
}

export function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const WEEKDAYS_FULL = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function getMonthMatrix(
  year: number,
  month: number,
  selectedDate: Date,
  eventsByDate: Record<string, CalendarEvent[]>
): DayInfo[] {
  const today = new Date();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInCurrentMonth = getDaysInMonth(year, month);

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  const days: DayInfo[] = [];

  // Trailing days from previous month
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const date = new Date(prevYear, prevMonth, dayNum);
    const dateStr = formatDateKey(date);
    const eventCount = eventsByDate[dateStr]?.length || 0;
    days.push({
      date,
      dateStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: isSameDay(date, today),
      isSelected: isSameDay(date, selectedDate),
      hasEvents: eventCount > 0,
      eventCount,
    });
  }

  // Days in current month
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const date = new Date(year, month, d);
    const dateStr = formatDateKey(date);
    const eventCount = eventsByDate[dateStr]?.length || 0;
    days.push({
      date,
      dateStr,
      dayNumber: d,
      isCurrentMonth: true,
      isToday: isSameDay(date, today),
      isSelected: isSameDay(date, selectedDate),
      hasEvents: eventCount > 0,
      eventCount,
    });
  }

  // Remaining days from next month to complete 5 or 6 rows (multiple of 7)
  const totalSlots = days.length <= 35 ? 35 : 42;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  let nextDayNum = 1;

  while (days.length < totalSlots) {
    const date = new Date(nextYear, nextMonth, nextDayNum);
    const dateStr = formatDateKey(date);
    const eventCount = eventsByDate[dateStr]?.length || 0;
    days.push({
      date,
      dateStr,
      dayNumber: nextDayNum,
      isCurrentMonth: false,
      isToday: isSameDay(date, today),
      isSelected: isSameDay(date, selectedDate),
      hasEvents: eventCount > 0,
      eventCount,
    });
    nextDayNum++;
  }

  return days;
}

export function formatClockTime(date: Date, format: ClockFormat): {
  timeStr: string;
  ampm: string | null;
  hoursStr: string;
  minutesStr: string;
  secondsStr: string;
} {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  let ampm: string | null = null;

  if (format === '12h') {
    ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
  }

  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(minutes).padStart(2, '0');
  const secondsStr = String(seconds).padStart(2, '0');

  const timeStr = `${hoursStr}:${minutesStr}:${secondsStr}`;

  return { timeStr, ampm, hoursStr, minutesStr, secondsStr };
}

export function formatDateFull(date: Date): {
  weekday: string;
  monthName: string;
  day: number;
  year: number;
  formatted: string;
} {
  const weekday = WEEKDAYS_FULL[date.getDay()];
  const monthName = MONTH_NAMES[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return {
    weekday,
    monthName,
    day,
    year,
    formatted: `${weekday}, ${monthName} ${day}, ${year}`,
  };
}

export function formatStopwatchTime(totalMs: number): string {
  const totalSeconds = Math.floor(totalMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((totalMs % 1000) / 10);

  const minStr = String(minutes).padStart(2, '0');
  const secStr = String(seconds).padStart(2, '0');
  const csStr = String(centiseconds).padStart(2, '0');

  return `${minStr}:${secStr}.${csStr}`;
}

export function formatTimerSeconds(totalSeconds: number): {
  hours: number;
  minutes: number;
  seconds: number;
  hoursStr: string;
  minutesStr: string;
  secondsStr: string;
  formatted: string;
} {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(minutes).padStart(2, '0');
  const secondsStr = String(seconds).padStart(2, '0');

  const formatted =
    hours > 0
      ? `${hoursStr}:${minutesStr}:${secondsStr}`
      : `${minutesStr}:${secondsStr}`;

  return { hours, minutes, seconds, hoursStr, minutesStr, secondsStr, formatted };
}
