import React from 'react';
import { Clock, Menu, LogIn, LogOut, BarChart2, HelpCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleAnalytics: () => void;
  onOpenTutorial: () => void;
  showAnalytics: boolean;
  user: any;
  onOpenAuth: () => void;
}

export function Header({ onToggleSidebar, onToggleAnalytics, onOpenTutorial, showAnalytics, user, onOpenAuth }: HeaderProps) {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-[#1A1A2E]/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 relative">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 sm:p-2 rounded-md hover:bg-white/5 transition-colors"
          >
            <Menu size={20} className="text-indigo-300 sm:w-6 sm:h-6" />
          </button>
          
          <div className="flex items-center space-x-2">
            <Clock size={24} className="text-indigo-400 sm:w-8 sm:h-8" />
            <h1 className="text-base sm:text-lg md:text-xl font-semibold gradient-text">
              Work Hours Tracker
            </h1>
          </div>
          
          <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3">
            <button
              onClick={onOpenTutorial}
              className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10 text-indigo-300 transition-colors"
            >
              <HelpCircle size={16} />
              <span>Tutorial</span>
            </button>
            <button
              onClick={onToggleAnalytics}
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                showAnalytics
                  ? 'bg-indigo-500 text-white'
                  : 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300'
              }`}
            >
              <BarChart2 size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{showAnalytics ? 'Show Timer' : 'Analytics'}</span>
            </button>
            
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-white/5 hover:bg-white/10 text-indigo-300 transition-colors"
              >
                <LogOut size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 transition-colors"
              >
                <LogIn size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className="sm:hidden flex justify-center space-x-6 py-2 border-t border-white/5">
          <button
            onClick={onOpenTutorial}
            className="flex flex-col items-center space-y-1 text-indigo-300"
          >
            <HelpCircle size={18} />
            <span className="text-xs">Help</span>
          </button>
          <button
            onClick={onToggleAnalytics}
            className={`flex flex-col items-center space-y-1 ${
              showAnalytics ? 'text-white' : 'text-indigo-300'
            }`}
          >
            <BarChart2 size={18} />
            <span className="text-xs">{showAnalytics ? 'Timer' : 'Stats'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}