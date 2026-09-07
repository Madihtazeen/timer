import { useState, useEffect } from 'react';
import type { ThemeMode, ClockFormat, CalendarEvent } from './types';
import {
  loadStoredTheme,
  saveStoredTheme,
  loadStoredClockFormat,
  saveStoredClockFormat,
  loadStoredEvents,
  saveStoredEvents,
  loadStoredSoundEnabled,
  saveStoredSoundEnabled,
} from './utils/storage';
import { Header } from './components/Header';
import { Clock } from './components/Clock';
import { Calendar } from './components/Calendar/Calendar';
import { Timer } from './components/Timer/Timer';
import { Stopwatch } from './components/Stopwatch/Stopwatch';
import { Footer } from './components/Footer';

export function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => loadStoredTheme());
  const [clockFormat, setClockFormat] = useState<ClockFormat>(() => loadStoredClockFormat());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => loadStoredSoundEnabled());
  const [events, setEvents] = useState<Record<string, CalendarEvent[]>>(() => loadStoredEvents());

  // Apply theme to document root whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveStoredTheme(theme);
  }, [theme]);

  // Sync clock format changes
  const handleChangeClockFormat = (format: ClockFormat) => {
    setClockFormat(format);
    saveStoredClockFormat(format);
  };

  // Sync sound toggle
  const handleToggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      saveStoredSoundEnabled(next);
      return next;
    });
  };

  // Toggle theme
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Event handlers
  const handleAddEvent = (dateStr: string, title: string, time?: string) => {
    const newEvent: CalendarEvent = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      dateStr,
      title,
      time,
      createdAt: Date.now(),
    };

    setEvents((prev) => {
      const existing = prev[dateStr] || [];
      const updated = {
        ...prev,
        [dateStr]: [...existing, newEvent],
      };
      saveStoredEvents(updated);
      return updated;
    });
  };

  const handleDeleteEvent = (dateStr: string, id: string) => {
    setEvents((prev) => {
      const existing = prev[dateStr] || [];
      const filtered = existing.filter((item) => item.id !== id);
      const updated = { ...prev };
      if (filtered.length > 0) {
        updated[dateStr] = filtered;
      } else {
        delete updated[dateStr];
      }
      saveStoredEvents(updated);
      return updated;
    });
  };

  return (
    <div className="app-wrapper">
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        clockFormat={clockFormat}
        onChangeClockFormat={handleChangeClockFormat}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      <main className="main-content" role="main">
        {/* Visual Hero: Live Clock */}
        <Clock clockFormat={clockFormat} />

        {/* Dashboard Grid: Calendar with Notes + Timer & Stopwatch */}
        <div className="dashboard-grid">
          <Calendar
            eventsByDate={events}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
          />

          <div className="utilities-column">
            <Timer soundEnabled={soundEnabled} />
            <Stopwatch />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
