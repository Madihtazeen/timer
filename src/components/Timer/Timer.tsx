import React, { useState, useEffect, useRef } from 'react';
import { Hourglass, Play, Pause, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';
import { formatTimerSeconds } from '../../utils/time';
import { playTimerCompletionChime } from '../../utils/sound';

interface TimerProps {
  soundEnabled: boolean;
}

const PRESETS = [
  { label: '5 min', seconds: 5 * 60 },
  { label: '15 min', seconds: 15 * 60 },
  { label: '25 min (Focus)', seconds: 25 * 60 },
  { label: '45 min', seconds: 45 * 60 },
  { label: '60 min', seconds: 60 * 60 },
];

export const Timer: React.FC<TimerProps> = ({ soundEnabled }) => {
  // Initial default is 25 minutes = 1500 seconds
  const [initialSeconds, setInitialSeconds] = useState<number>(25 * 60);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Custom inputs for H / M / S
  const [inputHours, setInputHours] = useState<string>('0');
  const [inputMinutes, setInputMinutes] = useState<string>('25');
  const [inputSeconds, setInputSeconds] = useState<string>('0');

  const intervalRef = useRef<number | null>(null);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Timer tick effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            setIsCompleted(true);
            if (soundEnabled) {
              playTimerCompletionChime();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, soundEnabled]);

  const handleStart = () => {
    if (remainingSeconds <= 0) {
      // If was completed, reset back to initialSeconds and run
      setRemainingSeconds(initialSeconds);
      setIsCompleted(false);
    }
    setIsCompleted(false);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setRemainingSeconds(initialSeconds);
  };

  const handleSelectPreset = (seconds: number) => {
    setIsRunning(false);
    setIsCompleted(false);
    setInitialSeconds(seconds);
    setRemainingSeconds(seconds);

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    setInputHours(String(h));
    setInputMinutes(String(m));
    setInputSeconds(String(s));
  };

  const handleApplyCustomTime = (e: React.FormEvent) => {
    e.preventDefault();
    const h = Math.max(0, parseInt(inputHours, 10) || 0);
    const m = Math.max(0, Math.min(59, parseInt(inputMinutes, 10) || 0));
    const s = Math.max(0, Math.min(59, parseInt(inputSeconds, 10) || 0));

    const total = h * 3600 + m * 60 + s;
    if (total > 0) {
      setIsRunning(false);
      setIsCompleted(false);
      setInitialSeconds(total);
      setRemainingSeconds(total);
    }
  };

  const formattedTime = formatTimerSeconds(remainingSeconds);

  return (
    <section id="timer-section" className="tool-card timer-card" aria-label="Countdown Timer">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon" aria-hidden="true">
            <Hourglass size={18} />
          </div>
          <div>
            <h2 className="card-title">Countdown Timer</h2>
            <p className="card-subtitle">Stay focused with customizable countdown intervals</p>
          </div>
        </div>
      </div>

      <div className="timer-container">
        {/* Preset chips */}
        <div className="timer-presets-list" role="group" aria-label="Timer Quick Presets">
          {PRESETS.map((preset) => {
            const isActive = initialSeconds === preset.seconds && !isRunning && !isCompleted;
            return (
              <button
                key={preset.label}
                type="button"
                className={`preset-chip ${isActive ? 'active' : ''}`}
                onClick={() => handleSelectPreset(preset.seconds)}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Big digits display */}
        <div
          className={`timer-digits-display tabular-nums ${isRunning ? 'is-running' : ''}`}
          aria-live="polite"
        >
          {formattedTime.formatted}
        </div>

        {/* Completion Banner */}
        {isCompleted && (
          <div className="timer-alert-banner" role="alert">
            <Sparkles size={18} />
            <span>Time's up! Great session.</span>
            <CheckCircle2 size={18} />
          </div>
        )}

        {/* Action Controls */}
        <div className="controls-row">
          {!isRunning ? (
            <button
              type="button"
              className="btn-action-main"
              onClick={handleStart}
              aria-label={remainingSeconds === 0 ? 'Start timer again' : 'Start timer'}
            >
              <Play size={18} fill="currentColor" />
              <span>Start</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn-action-main is-pause"
              onClick={handlePause}
              aria-label="Pause timer"
            >
              <Pause size={18} fill="currentColor" />
              <span>Pause</span>
            </button>
          )}

          <button
            type="button"
            className="btn-action-subtle"
            onClick={handleReset}
            aria-label="Reset timer"
            disabled={remainingSeconds === initialSeconds && !isRunning && !isCompleted}
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>

        {/* Custom Input */}
        <form className="custom-timer-form" onSubmit={handleApplyCustomTime} style={{ marginTop: '1.5rem' }}>
          <div className="timer-input-box">
            <input
              type="number"
              min="0"
              max="99"
              className="timer-num-input"
              value={inputHours}
              onChange={(e) => setInputHours(e.target.value)}
              aria-label="Hours"
            />
            <span className="timer-num-label">Hours</span>
          </div>
          <span className="timer-colon">:</span>
          <div className="timer-input-box">
            <input
              type="number"
              min="0"
              max="59"
              className="timer-num-input"
              value={inputMinutes}
              onChange={(e) => setInputMinutes(e.target.value)}
              aria-label="Minutes"
            />
            <span className="timer-num-label">Mins</span>
          </div>
          <span className="timer-colon">:</span>
          <div className="timer-input-box">
            <input
              type="number"
              min="0"
              max="59"
              className="timer-num-input"
              value={inputSeconds}
              onChange={(e) => setInputSeconds(e.target.value)}
              aria-label="Seconds"
            />
            <span className="timer-num-label">Secs</span>
          </div>
          <button
            type="submit"
            className="btn-secondary"
            style={{ marginLeft: '0.4rem', height: '36px', alignSelf: 'flex-start' }}
          >
            Set
          </button>
        </form>
      </div>
    </section>
  );
};
