import React from 'react';
import { TherapistIcon } from './common/icons';

const TherapistPromo: React.FC = React.memo(() => {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-[2rem] shadow-lg p-8 md:p-12 flex flex-col md:flex-row items-center">
        <div className="text-brand-dark-green p-6 bg-brand-light-green/30 rounded-full mb-6 md:mb-0 md:mr-8">
          <TherapistIcon className="w-16 h-16" />
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-bold text-brand-dark-green mb-3">Ready to Talk to a Professional?</h3>
          <p className="text-brand-dark-green/80 mb-6">
            Our Pro plan connects you with vetted therapists from your campus or our professional network. Get personalized support through secure chat and sessions.
          </p>
          <button
            aria-label="Upgrade to the Pro plan to connect with therapists"
            className="bg-brand-light-green text-brand-dark-green font-semibold py-3 px-8 rounded-full hover:bg-brand-dark-green hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light-green">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </section>
  );
});

export default TherapistPromo;