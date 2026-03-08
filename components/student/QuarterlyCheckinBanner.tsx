import React from 'react';
import { CheckIcon } from '../common/icons';

interface QuarterlyCheckinBannerProps {
  onStart: () => void;
  onDismiss: () => void;
}

const QuarterlyCheckinBanner: React.FC<QuarterlyCheckinBannerProps> = React.memo(({ onStart, onDismiss }) => {
  return (
    <div className="py-4 px-4 sm:px-6 lg:px-8 animate-scale-in">
      <div className="bg-[#eaf0e6] border border-[#dce5d8] text-brand-dark-green rounded-3xl sm:rounded-full shadow-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-4xl mx-auto">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="hidden sm:block flex-shrink-0 bg-[#f7e098] p-2 rounded-full animate-pulse">
            <CheckIcon className="h-6 w-6 text-yellow-800" />
          </div>
          <p className="text-base md:text-lg">
            Your quarterly check-in is ready.{' '}
            <button
              onClick={onStart}
              aria-label="Start your quarterly check-in assessment"
              className="font-bold underline hover:text-brand-dark-green/80 transition-colors duration-200"
            >
              Take a few moments to track your progress.
            </button>
          </p>
        </div>
        <button
          onClick={onDismiss}
          aria-label="Dismiss quarterly check-in banner"
          className="text-2xl font-light leading-none hover:text-brand-dark-green/80 hover:rotate-90 transition-all duration-200 p-1 sm:self-center self-end flex-shrink-0"
        >
          &times;
        </button>
      </div>
    </div>
  );
});

export default QuarterlyCheckinBanner;