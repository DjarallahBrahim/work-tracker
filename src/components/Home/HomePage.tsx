import React from 'react';
import { Clock, BarChart2, Calendar, Timer, Shield, ArrowRight } from 'lucide-react';
import { TutorialModal } from '../Tutorial/TutorialModal';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Timer className="w-8 h-8 text-indigo-400" />,
    title: "Smart Time Tracking",
    description: "Effortlessly track your work hours and breaks with our intuitive timer system. Perfect for managing your daily productivity."
  },
  {
    icon: <BarChart2 className="w-8 h-8 text-indigo-400" />,
    title: "Detailed Analytics",
    description: "Gain insights into your work patterns with comprehensive analytics. Visualize your productivity trends and optimize your schedule."
  },
  {
    icon: <Calendar className="w-8 h-8 text-indigo-400" />,
    title: "Calendar Integration",
    description: "View your work history in a beautiful calendar interface. Track your progress and identify patterns over time."
  }
];

interface HomePageProps {
  onOpenAuth: () => void;
}

export function HomePage({ onOpenAuth }: HomePageProps) {
  const [isTutorialOpen, setIsTutorialOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#0F0F1A] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="flex justify-center items-center mb-6">
            <Clock className="w-16 h-16 text-indigo-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold gradient-text mb-6">
            Track Your Work Hours
            <br />
            <span className="text-indigo-300">Like Never Before</span>
          </h1>
          <p className="text-xl text-indigo-200/80 mb-8 max-w-2xl mx-auto">
            A beautiful and intuitive way to track your work hours, analyze your productivity,
            and maintain a healthy work-life balance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors shadow-lg shadow-indigo-500/30 group"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setIsTutorialOpen(true)}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-indigo-300 font-medium transition-colors"
            >
              Watch Demo
            </button>
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-indigo-300 font-medium transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-panel p-6 rounded-xl hover:scale-105 transition-transform duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-indigo-300 mb-3">
                {feature.title}
              </h3>
              <p className="text-indigo-200/70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Security Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-panel p-8 rounded-xl">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-green-400" />
          </div>
          <h2 className="text-2xl font-semibold text-center text-green-300 mb-4">
            Secure & Private
          </h2>
          <p className="text-center text-green-200/70 max-w-2xl mx-auto">
            Your data is protected with industry-standard encryption. We prioritize your privacy
            and ensure your work data remains confidential and secure.
          </p>
        </div>
      </div>
      
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </div>
  );
}