import React from 'react';

interface AssessmentPromptProps {
  onStart: () => void;
}

const AssessmentPrompt: React.FC<AssessmentPromptProps> = React.memo(({ onStart }) => {
  return (
    <section className="bg-brand-light-green/30 my-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h3 className="text-2xl font-bold text-brand-dark-green mb-3">Your Quarterly Check-in</h3>
        <p className="text-brand-dark-green/80 max-w-2xl mx-auto mb-6">
          Taking a few moments for a quick assessment helps you and us understand your progress. Your responses are private and secure.
        </p>
        <button 
          onClick={onStart}
          aria-label="Start your quarterly check-in assessment"
          className="bg-brand-dark-green text-white font-semibold py-3 px-8 rounded-full hover:bg-brand-dark-green/90 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark-green"
        >
          Start Assessment
        </button>
      </div>
    </section>
  );
});

export default AssessmentPrompt;