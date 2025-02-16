import React from 'react';
import { Clock, Coffee, Combine, Save } from 'lucide-react';
import { formatTime } from '../../utils/timeUtils';
import type { WorkSession } from '../../types';
import { supabase } from '../../lib/supabase';

interface HistoricalData {
  total_work_time: number;
  total_break_time: number;
}

interface DayStatsProps {
  sessions: WorkSession[];
  date: Date;
  onMergeSessions: () => void;
}

export function DayStats({ sessions, date, onMergeSessions }: DayStatsProps) {
  const [historicalData, setHistoricalData] = React.useState<HistoricalData | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Helper to check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Helper to get display data based on whether it's today or a past date
  const getDisplayData = () => {
    if (isToday(date)) {
      return {
        workTime: totalWorkTime,
        breakTime: totalBreakTime
      };
    }
    return historicalData ? {
      workTime: historicalData.total_work_time,
      breakTime: historicalData.total_break_time
    } : {
      workTime: 0,
      breakTime: 0
    };
  };

  React.useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setIsLoading(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Ensure we're using the correct date by handling timezone offset
        const localDate = new Date(date);
        const formattedDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000)
          .toISOString()
          .split('T')[0];
        
        // Using filter() method with more explicit error handling
        const { data, error } = await supabase
          .from('daily_results')
          .select('total_work_time, total_break_time')
          .filter('user_id', 'eq', user.id)
          .filter('date', 'eq', formattedDate)
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error fetching historical data:', error);
          setHistoricalData(null);
          return;
        }

        setHistoricalData(data);

    } catch (error) {
      console.error('Error:', error);
      setHistoricalData(null);
    } finally {
      setIsLoading(false);
    }
  };

    // Only fetch if it's not today
    if (!isToday(date)) {
      fetchHistoricalData();
    }
  }, [date]); // Now depends on date changes

  const totalWorkTime = sessions.reduce((acc, session) => acc + session.totalWorkTime, 0);
  const totalBreakTime = sessions.reduce((acc, session) => acc + session.totalBreakTime, 0);

  const [isSaving, setIsSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  const handleSaveDay = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);
      
      // Get the exact date from the sessions
      const sessionDate = sessions[0]?.date;
      if (!sessionDate) {
        throw new Error('No sessions to save');
      }
      
      // Format the date correctly for saving
      const localDate = new Date(sessionDate);
      const formattedDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];

      // Don't allow saving future dates
      if (date > new Date()) {
        throw new Error('Cannot save future dates');
      }
      
      const { data, error: userError } = await supabase.auth.getUser();
      
      if (userError || !data.user) {
        throw new Error('Please sign in to save your progress');
      }
      
      const { error } = await supabase
        .from('daily_results')
        .upsert(
          {
            user_id: data.user.id,
            date: formattedDate,
            total_work_time: totalWorkTime,
            total_break_time: totalBreakTime
          },
          {
            onConflict: 'user_id,date',
            ignoreDuplicates: false
          }
        );

      if (error) throw error;
      
      // Show success message
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-green-500/90 text-white px-4 py-2 rounded-lg shadow-lg';
      notification.textContent = 'Day saved successfully!';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      
    } catch (error) {
      console.error('Error saving day:', error);
      
      // Show error message in UI
      const notification = document.createElement('div');
      notification.className = 'fixed bottom-4 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg';
      notification.textContent = error instanceof Error ? error.message : 'Failed to save day';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
      setSaveError(error instanceof Error ? error.message : 'Failed to save day');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold gradient-text">
          {date.toLocaleDateString('en-US', { 
            weekday: window.innerWidth < 640 ? 'short' : 'long',
            month: window.innerWidth < 640 ? 'short' : 'long',
            day: 'numeric'
          })}
        </h2>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={handleSaveDay}
            disabled={isSaving || totalWorkTime === 0 || date > new Date()}
            className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isSaving || totalWorkTime === 0 || date > new Date()
                ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                : 'bg-green-500/20 hover:bg-green-500/30 text-green-300'
            }`}
          >
            <Save size={16} className={isSaving ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save Day'}</span>
          </button>
          {saveError && (
            <div className="text-red-400 text-sm">{saveError}</div>
          )}
          {sessions.length > 1 && (
          <button
            onClick={onMergeSessions}
            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 transition-colors"
          >
            <Combine size={16} />
            <span className="hidden sm:inline">Merge</span>
          </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-3 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
          <Clock className="text-indigo-400" />
          <div className="flex-1">
            <div className="text-sm text-indigo-300">Total Work Time</div>
            <div className={`text-lg font-semibold text-indigo-400 ${isLoading ? 'opacity-50' : ''}`}>
              {formatTime(getDisplayData().workTime)}
            </div>
          </div>
          {isLoading && (
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        
        <div className="flex items-center space-x-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <Coffee className="text-purple-400" />
          <div className="flex-1">
            <div className="text-sm text-purple-300">Total Break Time</div>
            <div className={`text-lg font-semibold text-purple-400 ${isLoading ? 'opacity-50' : ''}`}>
              {formatTime(getDisplayData().breakTime)}
            </div>
          </div>
          {isLoading && (
            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-indigo-300">Sessions</h3>
        {isToday(date) ? sessions.map((session) => (
          <div
            key={session.id}
            className="p-4 border border-white/10 rounded-lg space-y-2 bg-white/5"
          >
            <div className="flex justify-between text-sm">
              <span>{new Date(session.startTime).toLocaleTimeString(undefined, { 
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
              })}</span>
              <span>{session.endTime ? new Date(session.endTime).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
              }) : 'Ongoing'}</span>
            </div>
            <div className="flex justify-between text-sm text-indigo-300">
              <span>Work: {formatTime(session.totalWorkTime)}</span>
              <span>Break: {formatTime(session.totalBreakTime)}</span>
            </div>
          </div>
        )) : (
          <div className="p-4 border border-white/10 rounded-lg text-center text-indigo-300/60">
            {isLoading ? (
              'Loading sessions...'
            ) : historicalData ? (
              'Historical data loaded'
            ) : (
              'No sessions recorded for this date'
            )}
          </div>
        )}
      </div>
    </div>
  );
}