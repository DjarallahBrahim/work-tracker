export interface WorkSession {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  totalWorkTime: number; // in seconds
  totalBreakTime: number; // in seconds
  status: 'active' | 'paused' | 'completed';
}

export interface DayStats {
  totalWorkTime: number;
  totalBreakTime: number;
  sessions: WorkSession[];
}