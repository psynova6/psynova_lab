import React from 'react';
import type { FeatureCardProps } from '../../types';

// Badge accent colours per card — from Stitch design
const badgeColors: Record<string, string> = {
  "AI Chatbot 'Syna'": '#92bb80',
  'Coping Tools': '#e29578',
  'Connect with Therapists': '#83c5be',
  'Set a Reminder': '#ffddd2',
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, actionText, onClick }) => {
  const badgeColor = badgeColors[title] ?? '#92bb80';

  return (
    <div
      className="float-card group relative flex flex-col items-center text-center gap-3 p-5 rounded-[2rem] border border-white/60 cursor-pointer active:scale-95 transition-transform duration-150"
      style={{ background: 'rgba(255,255,255,0.50)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      {/* Icon with coloured badge dot — exact from Stitch HTML */}
      <div className="relative">
        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-brand-dark-green shadow-sm border border-slate-100">
          {icon}
        </div>
        {/* Badge accent dot */}
        <div
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white"
          style={{ background: badgeColor }}
          aria-hidden="true"
        />
      </div>

      {/* Title + subtitle tag */}
      <div>
        <h4 className="font-bold text-brand-dark-green text-base leading-snug">{title}</h4>
        <p className="text-[11px] text-brand-dark-green/50 font-medium uppercase tracking-wider mt-1 line-clamp-2">
          {description}
        </p>
      </div>

      {/* Full-width CTA button — from Stitch design */}
      <button
        onClick={onClick}
        aria-label={`${actionText} for ${title}`}
        className="mt-auto w-full py-2.5 bg-brand-dark-green text-white rounded-full text-sm font-bold
                   hover:bg-brand-light-green hover:text-brand-dark-green
                   transition-colors duration-300
                   active:scale-95 pulse-glow
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark-green"
        style={{ boxShadow: 'inset 0 2px 4px 0 rgba(255,255,255,0.3)' }}
      >
        {actionText}
      </button>
    </div>
  );
};

export default React.memo(FeatureCard);