import React, { useState } from 'react';
import type { CalendarEvent } from '../../types';
import { MONTH_NAMES } from '../../utils/time';
import { Plus, Trash2, Calendar as CalendarIcon, Clock as TimeIcon, X } from 'lucide-react';

interface EventPanelProps {
  selectedDate: Date;
  events: CalendarEvent[];
  onAddEvent: (title: string, time?: string) => void;
  onDeleteEvent: (id: string) => void;
}

export const EventPanel: React.FC<EventPanelProps> = ({
  selectedDate,
  events,
  onAddEvent,
  onDeleteEvent,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');

  const formattedSelectedDate = `${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getDate()}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddEvent(title.trim(), time.trim() || undefined);
    setTitle('');
    setTime('');
    setIsAdding(false);
  };

  return (
    <div className="calendar-events-section" aria-label={`Events for ${formattedSelectedDate}`}>
      <div className="events-header">
        <div className="events-date-title">
          <CalendarIcon size={16} color="var(--primary)" aria-hidden="true" />
          <span>{formattedSelectedDate}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            ({events.length} {events.length === 1 ? 'event' : 'events'})
          </span>
        </div>

        {!isAdding ? (
          <button
            type="button"
            className="add-event-btn-trigger"
            onClick={() => setIsAdding(true)}
            aria-label={`Add note or event for ${formattedSelectedDate}`}
          >
            <Plus size={14} />
            <span>Add Event</span>
          </button>
        ) : (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setIsAdding(false)}
            aria-label="Cancel adding event"
            style={{ padding: '0.25rem 0.5rem' }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Add event inline form */}
      {isAdding && (
        <form className="event-form" onSubmit={handleSubmit}>
          <div className="event-input-row">
            <input
              type="text"
              className="event-text-input"
              placeholder="e.g. Meeting, Doctor appointment, Focus session"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
              aria-label="Event or note title"
            />
            <input
              type="time"
              className="event-time-input"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              aria-label="Optional event time"
            />
          </div>
          <div className="event-form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setIsAdding(false);
                setTitle('');
                setTime('');
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={!title.trim()}>
              Save Note
            </button>
          </div>
        </form>
      )}

      {/* Events List */}
      {events.length === 0 ? (
        <p className="no-events-text">No notes or events scheduled for this day.</p>
      ) : (
        <div className="event-list" role="list">
          {events.map((evt) => (
            <div key={evt.id} className="event-item" role="listitem">
              <div className="event-info">
                {evt.time && (
                  <span className="event-time-badge tabular-nums">
                    <TimeIcon size={11} style={{ marginRight: '3px', verticalAlign: '-1px' }} />
                    {evt.time}
                  </span>
                )}
                <span className="event-title-text" title={evt.title}>
                  {evt.title}
                </span>
              </div>
              <button
                type="button"
                className="delete-event-btn"
                onClick={() => onDeleteEvent(evt.id)}
                title="Delete event"
                aria-label={`Delete event: ${evt.title}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
