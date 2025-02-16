import React from 'react';
import { Play, Pause, StopCircle } from 'lucide-react';

interface TimerControlsProps {
  status: 'active' | 'paused' | 'completed';
  isDisabled: boolean;
  onStart: () => void;
  onPause: () => void;
  onEnd: () => void;
}

export function TimerControls({ status, isDisabled, onStart, onPause, onEnd }: TimerControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
      <button
        disabled={isDisabled}
        onClick={status === 'active' ? onPause : onStart}
        className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
          isDisabled
            ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
            : status === 'active'
            ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30'
            : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
        }`}
      >
        {status === 'active' ? (
          <>
            <Pause size={20} />
            <span>Pause</span>
          </>
        ) : status === 'paused' ? (
          <>
            <Play size={20} />
            <span>Resume</span>
          </>
        ) : (
          <>
            <Play size={20} />
            <span>Start</span>
          </>
        )}
      </button>
      <button
        onClick={onEnd}
        disabled={status === 'completed' || isDisabled}
        className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
          status === 'completed' || isDisabled
            ? 'bg-gray-700 cursor-not-allowed text-gray-400'
            : 'bg-red-500/80 hover:bg-red-500 text-white shadow-lg shadow-red-500/30'
        }`}
      >
        <StopCircle size={20} />
        <span>End</span>
      </button>
    </div>
  );
}