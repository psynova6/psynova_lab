import React from 'react';
import { SparkleIcon } from '../common/icons';

interface DailyAffirmationProps {
  affirmation: string;
}

const DailyAffirmation: React.FC<DailyAffirmationProps> = ({ affirmation }) => {
  if (!affirmation) return null;

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-10">
      {/* shimmer-card class from Stitch design + glass-card-60 aesthetics */}
      <div className="shimmer-card relative bg-white/60 rounded-[2rem] shadow-sm p-6 overflow-hidden animate-fade-in-down">
        {/* Large decorative quote mark — exact from Stitch HTML */}
        <div
          className="absolute -top-6 -left-2 text-[120px] font-serif leading-none select-none z-0"
          style={{ color: 'rgba(146,187,128,0.20)' }}
          aria-hidden="true"
        >
          "
        </div>

        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <SparkleIcon className="w-5 h-5 text-brand-light-green animate-spin-slow" />
            <h3 className="text-xs font-bold text-brand-dark-green tracking-widest uppercase">
              Daily Affirmation
            </h3>
          </div>
          <p className="text-lg italic font-medium text-brand-dark-green/90 leading-snug">
            {affirmation}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DailyAffirmation;
