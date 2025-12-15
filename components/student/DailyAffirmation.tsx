import React from 'react';
import { SparkleIcon } from '../common/icons';

interface DailyAffirmationProps {
  affirmation: string;
}

const DailyAffirmation: React.FC<DailyAffirmationProps> = ({ affirmation }) => {
  if (!affirmation) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-16">
      <div className="bg-white/60 rounded-[2rem] shadow-lg p-6 flex items-center gap-4 sm:gap-6 animate-fade-in-down">
        <div className="flex-shrink-0 bg-yellow-200/50 p-3 rounded-full">
          <SparkleIcon className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <h3 className="font-semibold text-brand-dark-green mb-1">Your Daily Affirmation</h3>
          <p className="text-lg text-brand-dark-green/90 italic">"{affirmation}"</p>
        </div>
      </div>
    </section>
  );
};

export default DailyAffirmation;
