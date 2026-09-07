import React, { useState, useEffect, useRef } from 'react';
import { Timer as StopwatchIcon, Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { formatStopwatchTime } from '../../utils/time';
import type { LapRecord } from '../../types';
import { LapList } from './LapList';

export const Stopwatch: React.FC = () => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<LapRecord[]>([]);

  // Using high-precision timestamp tracking
  const startTimeRef = useRef<number>(0);
  const previousElapsedRef = useRef<number>(0);
  const lastLapTotalTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const updateStopwatch = () => {
      const now = performance.now();
      const currentTotal = previousElapsedRef.current + (now - startTimeRef.current);
      setElapsedTime(currentTotal);
      animFrameRef.current = requestAnimationFrame(updateStopwatch);
    };

    if (isRunning) {
      startTimeRef.current = performance.now();
      animFrameRef.current = requestAnimationFrame(updateStopwatch);
    } else {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    }

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
    }
    const now = performance.now();
    const currentTotal = previousElapsedRef.current + (now - startTimeRef.current);
    previousElapsedRef.current = currentTotal;
    setElapsedTime(currentTotal);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setElapsedTime(0);
    previousElapsedRef.current = 0;
    lastLapTotalTimeRef.current = 0;
    setLaps([]);
  };

  const handleLap = () => {
    const currentTotal = isRunning
      ? previousElapsedRef.current + (performance.now() - startTimeRef.current)
      : elapsedTime;

    const lapDelta = currentTotal - lastLapTotalTimeRef.current;
    lastLapTotalTimeRef.current = currentTotal;

    const newLap: LapRecord = {
      lapIndex: laps.length + 1,
      lapTimeMs: lapDelta,
      totalTimeMs: currentTotal,
    };

    setLaps((prev) => [...prev, newLap]);
  };

  return (
    <section id="stopwatch-section" className="tool-card stopwatch-card" aria-label="High-precision Stopwatch">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon" aria-hidden="true">
            <StopwatchIcon size={18} />
          </div>
          <div>
            <h2 className="card-title">Stopwatch</h2>
            <p className="card-subtitle">Centisecond precision with lap recording</p>
          </div>
        </div>
      </div>

      <div className="stopwatch-container">
        {/* Digits Display */}
        <div className="stopwatch-digits-display tabular-nums" aria-live="polite">
          {formatStopwatchTime(elapsedTime)}
        </div>

        {/* Action Controls */}
        <div className="controls-row">
          {!isRunning ? (
            <button
              type="button"
              className="btn-action-main"
              onClick={handleStart}
              aria-label="Start stopwatch"
            >
              <Play size={18} fill="currentColor" />
              <span>Start</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn-action-main is-pause"
              onClick={handlePause}
              aria-label="Pause stopwatch"
            >
              <Pause size={18} fill="currentColor" />
              <span>Pause</span>
            </button>
          )}

          <button
            type="button"
            className="btn-action-subtle"
            onClick={handleLap}
            disabled={!isRunning && elapsedTime === 0}
            aria-label="Record lap time"
          >
            <Flag size={16} />
            <span>Lap</span>
          </button>

          <button
            type="button"
            className="btn-action-subtle"
            onClick={handleReset}
            disabled={elapsedTime === 0 && !isRunning}
            aria-label="Reset stopwatch"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>

        {/* Laps List */}
        <LapList laps={laps} />
      </div>
    </section>
  );
};
