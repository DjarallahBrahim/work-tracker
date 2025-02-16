import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getDaysInMonth, startOfMonth, format, isToday, isSameDay, isFutureDate } from '../../utils/dateUtils';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  workSessions: { date: string }[];
}

export function Calendar({ selectedDate, onDateSelect, workSessions }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(startOfMonth(selectedDate));
  
  const days = getDaysInMonth(currentMonth);
  const firstDayOfMonth = currentMonth.getDay();
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="glass-panel p-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-white/5 rounded-full transition-colors text-indigo-300"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold text-indigo-300">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-white/5 rounded-full transition-colors text-indigo-300"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm text-indigo-400/60 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="p-2" />
        ))}
        
        {days.map((date) => {
          const hasSession = workSessions.some((session) =>
            isSameDay(new Date(session.date), date)
          );
          const isFuture = isFutureDate(date);
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => !isFuture && onDateSelect(date)}
              disabled={isFuture}
              className={`
                p-2 rounded-lg transition-colors relative text-center
                ${isToday(date) ? 'bg-indigo-500/20 text-indigo-300' : 'text-indigo-300'}
                ${isSameDay(date, selectedDate) ? 'bg-indigo-500/30 text-white' : 'hover:bg-white/5'}
                ${isFuture ? 'opacity-30 cursor-not-allowed hover:bg-transparent' : ''}
              `}
            >
              <span>{date.getDate()}</span>
              {hasSession && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}