import React from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { DayStats } from './components/Stats/DayStats';
import { TimerDisplay } from './components/Timer/TimerDisplay';
import { TimerControls } from './components/Timer/TimerControls';
import { useTimer } from './hooks/useTimer';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AnalyticsPage } from './components/Analytics/AnalyticsPage';
import { HomePage } from './components/Home/HomePage';
import type { WorkSession } from './types';
import { supabase } from './lib/supabase';
import { AuthModal } from './components/Auth/AuthModal';
import { TutorialModal } from './components/Tutorial/TutorialModal';

function App() {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [sessions, setSessions] = useLocalStorage<WorkSession[]>('work-sessions', []);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = React.useState(false);
  const [showAnalytics, setShowAnalytics] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const { workTime, breakTime, status, startTimer, pauseTimer, endTimer } = useTimer();

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
  const handleEndSession = () => {
    const currentDate = new Date();
    if (new Date().toDateString() !== currentDate.toDateString()) {
      return;
    }

    endTimer();
    // Calculate the actual start time by subtracting the total session duration from current time
    const startTime = new Date(currentDate.getTime() - (workTime + breakTime) * 1000);
    
    const newSession: WorkSession = {
      id: Date.now().toString(),
      date: currentDate.toISOString(),
      startTime: startTime.toISOString(),
      endTime: currentDate.toISOString(),
      totalWorkTime: workTime,
      totalBreakTime: breakTime,
      status: 'completed',
    };
    
    // Validate that the start time makes sense (not before today)
    if (startTime.toDateString() !== currentDate.toDateString()) {
      console.warn('Session start time was calculated to be on a different day, adjusting to start of day');
      newSession.startTime = new Date(currentDate.setHours(0, 0, 0, 0)).toISOString();
    }
    
    setSessions((prev) => [...prev, newSession]);
  };

  const handleMergeSessions = () => {
    const todaySessions = sessions.filter(
      (session) => new Date(session.date).toDateString() === selectedDate.toDateString()
    );
    
    if (todaySessions.length <= 1) return;
    
    // Use the date from the first session to maintain the original date
    const sessionDate = new Date(todaySessions[0].date);
    
    const mergedSession: WorkSession = {
      id: Date.now().toString(),
      date: sessionDate.toISOString(),
      startTime: todaySessions[0].startTime,
      endTime: todaySessions[todaySessions.length - 1].endTime,
      totalWorkTime: todaySessions.reduce((acc, session) => acc + session.totalWorkTime, 0),
      totalBreakTime: todaySessions.reduce((acc, session) => acc + session.totalBreakTime, 0),
      status: 'completed',
    };
    
    setSessions((prev) => [
      ...prev.filter(
        (session) => new Date(session.date).toDateString() !== selectedDate.toDateString()
      ),
      mergedSession,
    ]);
  };

  return (
    <div className="min-h-screen bg-[#0F0F1A] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent relative">
      {!user ? (
        <HomePage onOpenAuth={() => setIsAuthModalOpen(true)} />
      ) : (
        <>
          <Header
            onToggleSidebar={() => setIsSidebarOpen(true)}
            user={user}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onToggleAnalytics={() => setShowAnalytics(!showAnalytics)}
            onOpenTutorial={() => setIsTutorialOpen(true)}
            showAnalytics={showAnalytics}
          />
          
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            workSessions={sessions}
          />
          
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
            {showAnalytics ? (
              <AnalyticsPage />
            ) : (
              <div className="space-y-8">
                <TimerDisplay
                  workTime={workTime}
                  breakTime={breakTime}
                  status={status}
                />
                <TimerControls
                  status={status}
                  isDisabled={selectedDate.toDateString() !== new Date().toDateString()}
                  onStart={startTimer}
                  onPause={pauseTimer}
                  onEnd={handleEndSession}
                />
              
                <DayStats
                  date={selectedDate}
                  sessions={sessions.filter((session) =>
                    new Date(session.date).toDateString() === selectedDate.toDateString()
                  )}
                  onMergeSessions={handleMergeSessions}
                />
              </div>
            )}
          </main>
        </>
      )}
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </div>
  );

}
export default App;
