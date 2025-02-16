import React from 'react';
import { X, Play, Pause, StopCircle, Calendar, BarChart2, Timer } from 'lucide-react';

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  animation?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Start Timer',
    description: 'Click the Start button to begin tracking your work time. The timer will start counting up.',
    icon: <Play className="w-8 h-8 text-indigo-400" />,
    animation: 'animate-pulse',
  },
  {
    title: 'Take Breaks',
    description: 'Click Pause when you need a break. The break timer will start automatically.',
    icon: <Pause className="w-8 h-8 text-orange-400" />,
  },
  {
    title: 'End Session',
    description: 'Click End when you\'re done working. Your session will be saved automatically.',
    icon: <StopCircle className="w-8 h-8 text-red-400" />,
  },
  {
    title: 'View Calendar',
    description: 'Open the sidebar to view your work history in the calendar. Days with sessions are marked.',
    icon: <Calendar className="w-8 h-8 text-indigo-400" />,
  },
  {
    title: 'Check Analytics',
    description: 'View detailed analytics of your work patterns and productivity trends.',
    icon: <BarChart2 className="w-8 h-8 text-indigo-400" />,
  },
];

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = React.useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1A1A2E] rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <Timer className="w-8 h-8 text-indigo-400" />
          <h2 className="text-2xl font-bold gradient-text">How to Use Work Hours Tracker</h2>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-8">
          {tutorialSteps.map((step, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`p-4 rounded-lg transition-all ${
                currentStep === index
                  ? 'bg-indigo-500/20 ring-2 ring-indigo-500'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className={`flex justify-center ${step.animation || ''}`}>
                {step.icon}
              </div>
            </button>
          ))}
        </div>

        <div className="bg-white/5 rounded-lg p-6">
          <div className={`flex items-center space-x-4 mb-4 ${tutorialSteps[currentStep].animation || ''}`}>
            {tutorialSteps[currentStep].icon}
            <h3 className="text-xl font-semibold text-indigo-300">
              {tutorialSteps[currentStep].title}
            </h3>
          </div>
          <p className="text-indigo-200/80 text-lg">
            {tutorialSteps[currentStep].description}
          </p>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => {
              if (currentStep === tutorialSteps.length - 1) {
                onClose();
              } else {
                setCurrentStep((prev) => prev + 1);
              }
            }}
            className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            {currentStep === tutorialSteps.length - 1 ? 'Got it!' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}