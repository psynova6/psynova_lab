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
      <div
        className="shimmer-card relative rounded-[2rem] shadow-md p-6 animate-fade-in-down border border-brand-light-green/40"
        style={{ background: 'linear-gradient(135deg, #a8cca0 0%, #92bb80 100%)' }}
      >
        {/* Large decorative quote mark — inside card bounds so it renders */}
        <div
          className="absolute top-1 left-3 font-serif select-none"
          style={{ color: 'rgba(35, 83, 40, 0.1)', fontSize: '100px', lineHeight: 1, zIndex: 0 }}
          aria-hidden="true"
        >
          "
        </div>

        <div className="relative flex flex-col gap-3 items-center text-center" style={{ zIndex: 1 }}>
          <div className="flex items-center gap-2">
            <SparkleIcon className="w-5 h-5 text-white animate-spin-slow" />
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
