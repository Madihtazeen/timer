import type { CalendarEvent, ClockFormat, ThemeMode } from '../types';

const STORAGE_KEYS = {
  THEME: 'timeflow_theme',
  CLOCK_FORMAT: 'timeflow_clock_format',
  EVENTS: 'timeflow_events',
  TIMER_PRESET: 'timeflow_timer_preset',
  SOUND_ENABLED: 'timeflow_sound_enabled',
} as const;

export function loadStoredTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch (e) {
    console.warn('Unable to read theme from localStorage', e);
  }
  return 'light'; // Default is always White + Lavender
}

export function saveStoredTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (e) {
    console.warn('Unable to save theme to localStorage', e);
  }
}

export function loadStoredClockFormat(): ClockFormat {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CLOCK_FORMAT);
    if (saved === '12h' || saved === '24h') return saved;
  } catch (e) {
    console.warn('Unable to read clock format from localStorage', e);
  }
  return '12h';
}

export function saveStoredClockFormat(format: ClockFormat): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CLOCK_FORMAT, format);
  } catch (e) {
    console.warn('Unable to save clock format to localStorage', e);
  }
}

export function loadStoredEvents(): Record<string, CalendarEvent[]> {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Unable to read events from localStorage', e);
  }
  return {};
}

export function saveStoredEvents(events: Record<string, CalendarEvent[]>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  } catch (e) {
    console.warn('Unable to save events to localStorage', e);
  }
}

export function loadStoredSoundEnabled(): boolean {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
    if (saved !== null) return saved === 'true';
  } catch (e) {
    console.warn('Unable to read sound preference', e);
  }
  return true;
}

export function saveStoredSoundEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, String(enabled));
  } catch (e) {
    console.warn('Unable to save sound preference', e);
  }
}
