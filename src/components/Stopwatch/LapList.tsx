import React from 'react';
import type { LapRecord } from '../../types';
import { formatStopwatchTime } from '../../utils/time';
import { Flag } from 'lucide-react';

interface LapListProps {
  laps: LapRecord[];
}

export const LapList: React.FC<LapListProps> = ({ laps }) => {
  if (laps.length === 0) return null;

  return (
    <div className="laps-container" aria-label="Recorded Laps">
      <div className="laps-header">
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Flag size={12} aria-hidden="true" />
          <span>Lap</span>
        </span>
        <span>Lap Time</span>
        <span>Overall</span>
      </div>

      <div className="laps-list" role="list">
        {/* Render newest lap first */}
        {[...laps].reverse().map((lap) => (
          <div key={lap.lapIndex} className="lap-item" role="listitem">
            <span className="lap-number">Lap {lap.lapIndex}</span>
            <span className="lap-time tabular-nums">{formatStopwatchTime(lap.lapTimeMs)}</span>
            <span className="lap-split tabular-nums">{formatStopwatchTime(lap.totalTimeMs)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
