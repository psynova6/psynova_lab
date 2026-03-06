import React from 'react';

interface WelcomeBannerProps {
  userName: string;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ userName }) => {
  return (
    <section className="text-center py-12 md:py-20 relative overflow-hidden">
      {/* Decorative floating particles */}
      <span className="absolute left-[10%] top-8 w-3 h-3 rounded-full bg-brand-light-green/40 float-card [animation-duration:4s]" aria-hidden="true" />
      <span className="absolute right-[15%] top-12 w-2 h-2 rounded-full bg-brand-light-green/30 float-card [animation-duration:5.5s] [animation-delay:1s]" aria-hidden="true" />
      <span className="absolute left-[30%] bottom-4 w-2.5 h-2.5 rounded-full bg-brand-dark-green/15 float-card [animation-duration:3.8s] [animation-delay:0.5s]" aria-hidden="true" />
      <span className="absolute right-[30%] bottom-6 w-2 h-2 rounded-full bg-brand-light-green/25 float-card [animation-duration:5s] [animation-delay:1.5s]" aria-hidden="true" />

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-dark-green mb-4 animate-slide-in-down">
        Welcome, {userName}
      </h2>
      <p className="text-lg sm:text-xl text-brand-dark-green/80 max-w-3xl mx-auto animate-fade-up [animation-delay:150ms]">
        A safe space to understand your mind. We're here to listen and support you on your journey to mental wellness.
      </p>
    </section>
  );
};

export default React.memo(WelcomeBanner);