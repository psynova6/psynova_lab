import React from 'react';
import { SparkleIcon } from '../common/icons';

interface WelcomeBannerProps {
  userName: string;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ userName }) => {
  return (
    <section className="relative py-6 overflow-hidden">
      {/* Radial aura glow behind the heading — from Stitch design */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full -z-10 blur-[40px]"
        style={{ background: 'rgba(146,187,128,0.30)' }}
        aria-hidden="true"
      />

      {/* Floating leaf particles — exact from Stitch HTML */}
      <div className="particle-leaf absolute" style={{ left: '10%', top: '20%' }} aria-hidden="true" />
      <div className="particle absolute w-2 h-2 rounded-full" style={{ left: '80%', top: '40%', background: '#92bb80', opacity: 0.6 }} aria-hidden="true" />
      <div className="particle-leaf absolute opacity-30 -rotate-12" style={{ left: '60%', top: '80%' }} aria-hidden="true" />
      <div className="particle absolute w-3 h-3 rounded-full opacity-40" style={{ left: '30%', top: '90%', background: '#92bb80' }} aria-hidden="true" />

      {/* Gradient heading text — Stitch design token */}
      <h2
        className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight pb-2 animate-slide-in-down"
        style={{
          backgroundImage: 'linear-gradient(to right, #235328, #92bb80)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Welcome,<br />{userName}
      </h2>

      <p className="text-base text-brand-dark-green/70 mt-2 max-w-xs animate-fade-up [animation-delay:150ms]">
        A safe space to understand your mind. We're here with you.
      </p>
    </section>
  );
};

export default React.memo(WelcomeBanner);