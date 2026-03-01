import React from 'react';
import type { FeatureCardProps } from '../../types';

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, actionText, onClick }) => {
  return (
    <div className="glass-card rounded-[2rem] shadow-premium p-4 sm:p-6 flex flex-col items-center text-center transform hover:-translate-y-2 hover:shadow-premium-hover transition-all duration-300 ease-out h-full group">
      <div className="bg-brand-gradient p-4 rounded-full mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
        {React.isValidElement(icon)
          ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
            className: `${(icon as React.ReactElement<{ className?: string }>).props.className || ''} w-8 h-8 text-white`.trim()
          })
          : icon}
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-brand-dark-green mb-2 tracking-tight">{title}</h3>
      <p className="text-brand-dark-green/70 mb-4 flex-grow text-sm sm:text-base leading-relaxed">{description}</p>
      <button
        onClick={onClick}
        aria-label={`${actionText} for ${title}`}
        className="mt-auto bg-brand-dark-green text-white font-bold py-2.5 px-6 sm:px-8 rounded-full shadow-md hover:bg-brand-light-green hover:text-brand-dark-green hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark-green active:scale-95"
      >
        {actionText}
      </button>
    </div>
  );
};

export default React.memo(FeatureCard);
