import React from 'react';
import { SparkleIcon } from '../common/icons';

interface DailyAffirmationProps {
  affirmation: string;
}

const DailyAffirmation: React.FC<DailyAffirmationProps> = ({ affirmation }) => {
  if (!affirmation) return null;

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10">
      {/* shimmer-card + glass-card-60 — no overflow-hidden so quote mark is visible */}
      <div className="shimmer-card relative bg-white/60 rounded-[2rem] shadow-sm p-6 animate-fade-in-down">
        {/* Large decorative quote mark — inside card bounds so it renders */}
        <div
          className="absolute top-1 left-3 font-serif select-none"
          style={{ color: 'rgba(146,187,128,0.25)', fontSize: '100px', lineHeight: 1, zIndex: 0 }}
          aria-hidden="true"
        >
          "
        </div>

        <div className="relative flex flex-col gap-3 items-center text-center" style={{ zIndex: 1 }}>
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
