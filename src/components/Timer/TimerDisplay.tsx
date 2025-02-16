import React from 'react';
import { formatTime } from '../../utils/timeUtils';

interface TimerDisplayProps {
  workTime: number;
  breakTime: number;
  status: 'active' | 'paused' | 'completed';
}

export function TimerDisplay({ workTime, breakTime, status }: TimerDisplayProps) {
  return (
    <div className="glass-panel flex flex-col items-center space-y-6 p-8">
      <div className="text-4xl sm:text-5xl md:text-6xl font-bold gradient-text font-mono">
        {formatTime(workTime)}
      </div>
      {status === 'paused' && (
        <div className="flex flex-col items-center space-y-1">
          <span className="text-sm text-orange-300">Break Time</span>
          <span className="text-xl sm:text-2xl font-mono text-orange-400">
            {formatTime(breakTime)}
          </span>
        </div>
      )}
      <div className="text-xs sm:text-sm font-medium text-indigo-300">
        {status === 'active' && 'Working'}
        {status === 'paused' && <span className="text-orange-300">On Break</span>}
        {status === 'completed' && 'Session Complete'}
      </div>
    </div>
  );
}