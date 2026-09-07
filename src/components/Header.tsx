import React from 'react';
import type { ClockFormat, ThemeMode } from '../types';
import { Moon, Sun, Clock, Bell, BellOff } from 'lucide-react';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  clockFormat: ClockFormat;
  onChangeClockFormat: (format: ClockFormat) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  clockFormat,
  onChangeClockFormat,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="header" role="banner">
      <a href="#hero-clock" className="brand" aria-label="TimeFlow Home">
        <div className="brand-icon-box" aria-hidden="true">
          <Clock size={20} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="brand-title">TimeFlow</span>
          <span className="brand-badge">Calm</span>
        </div>
      </a>

      <nav className="header-nav" aria-label="Primary Navigation">
        <a href="#hero-clock" className="nav-link">Clock</a>
        <a href="#calendar-section" className="nav-link">Calendar</a>
        <a href="#timer-section" className="nav-link">Timer</a>
        <a href="#stopwatch-section" className="nav-link">Stopwatch</a>
      </nav>

      <div className="header-actions">
        {/* 12h / 24h format pill toggle */}
        <div className="pill-toggle" role="radiogroup" aria-label="Clock Format">
          <button
            type="button"
            className={`pill-btn ${clockFormat === '12h' ? 'active' : ''}`}
            onClick={() => onChangeClockFormat('12h')}
            aria-checked={clockFormat === '12h'}
            role="radio"
          >
            12H
          </button>
          <button
            type="button"
            className={`pill-btn ${clockFormat === '24h' ? 'active' : ''}`}
            onClick={() => onChangeClockFormat('24h')}
            aria-checked={clockFormat === '24h'}
            role="radio"
          >
            24H
          </button>
        </div>

        {/* Audio Mute/Unmute Toggle */}
        <button
          type="button"
          className="icon-btn"
          onClick={onToggleSound}
          title={soundEnabled ? 'Chime sound is enabled' : 'Chime sound is muted'}
          aria-label={soundEnabled ? 'Disable chime sound' : 'Enable chime sound'}
        >
          {soundEnabled ? <Bell size={18} /> : <BellOff size={18} />}
        </button>

        {/* Dark / Light Mode Toggle */}
        <button
          type="button"
          className="icon-btn"
          onClick={onToggleTheme}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          aria-label={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  );
};
