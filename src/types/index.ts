export type ThemeMode = 'light' | 'dark';

export type ClockFormat = '12h' | '24h';

export interface CalendarEvent {
  id: string;
  dateStr: string; // YYYY-MM-DD
  title: string;
  time?: string;
  category?: 'focus' | 'personal' | 'work' | 'reminder';
  createdAt: number;
}

export interface LapRecord {
  lapIndex: number;
  lapTimeMs: number;
  totalTimeMs: number;
}

export interface DayInfo {
  date: Date;
  dateStr: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  hasEvents: boolean;
  eventCount: number;
}
