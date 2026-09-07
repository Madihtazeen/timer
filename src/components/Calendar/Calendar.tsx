import React, { useState } from 'react';
import type { CalendarEvent } from '../../types';
import { MONTH_NAMES, getMonthMatrix, formatDateKey } from '../../utils/time';
import { CalendarGrid } from './CalendarGrid';
import { EventPanel } from './EventPanel';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  eventsByDate: Record<string, CalendarEvent[]>;
  onAddEvent: (dateStr: string, title: string, time?: string) => void;
  onDeleteEvent: (dateStr: string, id: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  eventsByDate,
  onAddEvent,
  onDeleteEvent,
}) => {
  const [viewDate, setViewDate] = useState<Date>(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const handlePrevMonth = () => {
    setViewDate((prev) => {
      const prevMonth = prev.getMonth() === 0 ? 11 : prev.getMonth() - 1;
      const prevYear = prev.getMonth() === 0 ? prev.getFullYear() - 1 : prev.getFullYear();
      return new Date(prevYear, prevMonth, 1);
    });
  };

  const handleNextMonth = () => {
    setViewDate((prev) => {
      const nextMonth = prev.getMonth() === 11 ? 0 : prev.getMonth() + 1;
      const nextYear = prev.getMonth() === 11 ? prev.getFullYear() + 1 : prev.getFullYear();
      return new Date(nextYear, nextMonth, 1);
    });
  };

  const handleGoToday = () => {
    const today = new Date();
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    // If the selected date is in a different month, navigate to that month
    if (date.getMonth() !== currentMonth || date.getFullYear() !== currentYear) {
      setViewDate(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  const daysMatrix = getMonthMatrix(currentYear, currentMonth, selectedDate, eventsByDate);
  const selectedDateKey = formatDateKey(selectedDate);
  const selectedDateEvents = eventsByDate[selectedDateKey] || [];

  return (
    <section id="calendar-section" className="tool-card calendar-card" aria-label="Monthly Calendar and Notes">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon" aria-hidden="true">
            <CalendarIcon size={18} />
          </div>
          <div>
            <h2 className="card-title">Calendar & Notes</h2>
            <p className="card-subtitle">Select any day to manage notes & events</p>
          </div>
        </div>

        <button type="button" className="btn-today" onClick={handleGoToday} aria-label="Jump to today's date">
          Today
        </button>
      </div>

      <div className="calendar-nav-bar">
        <div className="month-year-label">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </div>
        <div className="cal-nav-buttons">
          <button
            type="button"
            className="cal-nav-btn"
            onClick={handlePrevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="cal-nav-btn"
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <CalendarGrid days={daysMatrix} onSelectDate={handleSelectDate} />

      <EventPanel
        selectedDate={selectedDate}
        events={selectedDateEvents}
        onAddEvent={(title, time) => onAddEvent(selectedDateKey, title, time)}
        onDeleteEvent={(id) => onDeleteEvent(selectedDateKey, id)}
      />
    </section>
  );
};
