import React from 'react';
import { Calendar } from '../Calendar/Calendar';
import { ChevronLeft } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  workSessions: { date: string }[];
}

export function Sidebar({
  isOpen,
  onClose,
  selectedDate,
  onDateSelect,
  workSessions,
}: SidebarProps) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      <div
        className={`fixed inset-y-0 left-0 w-[320px] bg-[#0F0F1A] shadow-xl transform transition-transform z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="px-6 py-4 border-b border-white/5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-indigo-300">Calendar</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/5 transition-colors text-indigo-300"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={(date) => {
                onDateSelect(date);
                onClose();
              }}
              workSessions={workSessions}
            />
          </div>
        </div>
      </div>
    </>
  );
}