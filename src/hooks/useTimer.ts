import React, { useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { WorkSession } from '../types';

interface TimerState {
  workTime: number;
  breakTime: number;
  status: WorkSession['status'];
}

export function useTimer() {
  const [timerState, setTimerState] = React.useState<TimerState>({
    workTime: 0,
    breakTime: 0,
    status: 'completed'
  });
  const timerRef = React.useRef<number | null>(null);
  const [user, setUser] = React.useState<any>(null);

  const startTimer = useCallback(() => {
    if (timerState.status !== 'active') {
      setTimerState(prev => ({ ...prev, status: 'active' }));
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = window.setInterval(() => {
        setTimerState(prev => {
          return {
            ...prev,
            workTime: prev.workTime + 1
          };
        });
      }, 1000);
    }
  }, [timerState.status]);

  const pauseTimer = useCallback(() => {
    if (timerState.status === 'active') {
      setTimerState(prev => ({ ...prev, status: 'paused' }));
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = window.setInterval(() => {
        setTimerState(prev => {
          return {
            ...prev,
            breakTime: prev.breakTime + 1
          };
        });
      }, 1000);
    }
  }, [timerState.status]);

  const endTimer = useCallback(() => {
    const newState = {
      workTime: 0,
      breakTime: 0,
      status: 'completed'
    };
    setTimerState(newState);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (timerState.status === 'active') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = window.setInterval(() => {
        setTimerState(prev => ({
          ...prev,
          workTime: prev.workTime + 1
        }));
      }, 1000);
    } else if (timerState.status === 'paused') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = window.setInterval(() => {
        setTimerState(prev => ({
          ...prev,
          breakTime: prev.breakTime + 1
        }));
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerState.status]);

  return {
    workTime: timerState.workTime,
    breakTime: timerState.breakTime,
    status: timerState.status,
    startTimer,
    pauseTimer,
    endTimer
  };
}