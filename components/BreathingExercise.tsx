
import React, { useState, useEffect } from 'react';

const PHASES = {
  inhale: { duration: 4000, text: 'Breathe In...', scale: 'scale-150' },
  hold: { duration: 4000, text: 'Hold', scale: 'scale-150' },
  exhale: { duration: 6000, text: 'Breathe Out...', scale: 'scale-100' },
};

const BreathingExercise = ({ onBack }: { onBack: () => void }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  useEffect(() => {
    const cycle = () => {
      setPhase(currentPhase => {
        if (currentPhase === 'inhale') return 'hold';
        if (currentPhase === 'hold') return 'exhale';
        return 'inhale';
      });
    };

    const timer = setTimeout(cycle, PHASES[phase].duration);

    return () => clearTimeout(timer);
  }, [phase]);

  const currentPhase = PHASES[phase];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="relative w-48 h-48 flex items-center justify-center mb-8">
        <div className="absolute inset-0 bg-brand-light-green/30 rounded-full animate-pulse-slow"></div>
        <div
          className={`relative w-32 h-32 bg-brand-light-green rounded-full transition-transform duration-[3000ms] ease-in-out ${currentPhase.scale}`}
        ></div>
        <p className="absolute text-xl font-semibold text-brand-dark-green">
          {currentPhase.text}
        </p>
      </div>
      <p className="text-brand-dark-green/80 mb-6">
        Follow the rhythm. Match your breath to the expanding and contracting circle.
      </p>
      <button onClick={onBack} aria-label="Go back to coping tools list" className="text-sm font-semibold text-brand-dark-green hover:underline">
        Back to Tools
      </button>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default BreathingExercise;