import React, { useState, useEffect } from 'react';
import type { ClockFormat } from '../types';
import { formatClockTime, formatDateFull } from '../utils/time';
import { Globe } from 'lucide-react';

interface ClockProps {
  clockFormat: ClockFormat;
}

export const Clock: React.FC<ClockProps> = ({ clockFormat }) => {
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

  useEffect(() => {
    // Synchronize interval precisely to every second
    const updateTime = () => {
      setCurrentTime(new Date());
    };

    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const { timeStr, ampm } = formatClockTime(currentTime, clockFormat);
  const { weekday, monthName, day, year } = formatDateFull(currentTime);

  // Timezone string (e.g. "GMT+5:30" or localized abbreviation)
  const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <section id="hero-clock" className="hero-clock-section" aria-label="Current Live Time and Date">
      <div className="clock-status-tag">
        <span className="live-dot" aria-hidden="true"></span>
        <span>Live Local Time</span>
      </div>

      <div className="clock-digits-container" aria-live="polite">
        <span className="clock-digits tabular-nums">{timeStr}</span>
        {ampm && <span className="clock-ampm">{ampm}</span>}
      </div>

      <div className="clock-date-display">
        <h1 className="clock-weekday-date">
          {weekday}, {monthName} {day}
        </h1>
        <span className="clock-year">{year}</span>
      </div>

      <div className="clock-quick-actions">
        <div className="clock-timezone-info">
          <Globe size={14} aria-hidden="true" />
          <span>{timeZoneName}</span>
        </div>
      </div>
    </section>
  );
};
