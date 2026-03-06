import React from 'react';

interface WelcomeBannerProps {
  userName: string;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ userName }) => {
  return (
    <section className="relative py-8 text-center">
      {/* Radial aura glow — centered behind content */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'rgba(146,187,128,0.25)', filter: 'blur(40px)', zIndex: 0 }}
        aria-hidden="true"
      />

      {/* Leaf particles */}
      <div
        className="particle-leaf"
        style={{ position: 'absolute', left: '72%', top: '10%', zIndex: 1 }}
        aria-hidden="true"
      />
      <div
        style={{ position: 'absolute', left: '85%', top: '50%', width: 8, height: 8, borderRadius: '50%', background: '#92bb80', opacity: 0.55, zIndex: 1, animation: 'floatCard 5s ease-in-out infinite alternate' }}
        aria-hidden="true"
      />
      <div
        className="particle-leaf"
        style={{ position: 'absolute', left: '60%', bottom: '5%', opacity: 0.3, transform: 'rotate(-12deg)', zIndex: 1 }}
        aria-hidden="true"
      />

      {/* Centered content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
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

        <p className="text-base text-brand-dark-green/70 mt-3 animate-fade-up mx-auto" style={{ animationDelay: '150ms', maxWidth: '36rem' }}>
          A safe space to understand your mind. We're here with you.
        </p>
      </div>
    </section>
  );
};

export default React.memo(WelcomeBanner);