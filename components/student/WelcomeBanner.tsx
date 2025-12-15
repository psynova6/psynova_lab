import React from 'react';

interface WelcomeBannerProps {
  userName: string;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ userName }) => {
  return (
    <section className="text-center py-12 md:py-20">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-dark-green mb-4 animate-fade-in-down">
        Welcome, {userName}
      </h2>
      <p className="text-lg sm:text-xl text-brand-dark-green/80 max-w-3xl mx-auto">
        A safe space to understand your mind. We're here to listen and support you on your journey to mental wellness.
      </p>
    </section>
  );
};

export default React.memo(WelcomeBanner);