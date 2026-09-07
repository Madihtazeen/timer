import React from 'react';
import type { DayInfo } from '../../types';
import { WEEKDAYS_SHORT } from '../../utils/time';

interface CalendarGridProps {
  days: DayInfo[];
  onSelectDate: (date: Date) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ days, onSelectDate }) => {
  return (
    <div className="calendar-table-wrap" role="region" aria-label="Calendar Days">
      {/* 7 Weekday Columns */}
      <div className="calendar-weekdays" role="row">
        {WEEKDAYS_SHORT.map((wd) => (
          <div key={wd} className="weekday-col" role="columnheader">
            {wd}
          </div>
        ))}
      </div>

      {/* Grid of Days */}
      <div className="calendar-grid" role="grid">
        {days.map((dayItem) => {
          const classNames = [
            'day-cell',
            !dayItem.isCurrentMonth ? 'other-month' : '',
            dayItem.isToday ? 'is-today' : '',
            dayItem.isSelected ? 'is-selected' : '',
          ]
            .filter(Boolean)
            .join(' ');

          const ariaLabel = `${dayItem.date.toDateString()}${
            dayItem.isToday ? ', Today' : ''
          }${dayItem.hasEvents ? `, ${dayItem.eventCount} events` : ''}`;

          return (
            <button
              key={dayItem.dateStr}
              type="button"
              className={classNames}
              onClick={() => onSelectDate(dayItem.date)}
              aria-label={ariaLabel}
              aria-selected={dayItem.isSelected}
              role="gridcell"
            >
              <span className="day-number tabular-nums">{dayItem.dayNumber}</span>
              {dayItem.hasEvents && (
                <span
                  className="event-dot"
                  title={`${dayItem.eventCount} event(s)`}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
