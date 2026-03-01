import React from 'react';
import type { FeatureCardProps } from '../../types';

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, actionText, onClick }) => {
  return (
    <div className="bg-white/50 rounded-[2rem] shadow-md p-4 sm:p-6 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 h-full">
      <div className="bg-brand-light-green/30 p-4 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-brand-dark-green mb-2">{title}</h3>
      <p className="text-brand-dark-green/70 mb-4 flex-grow text-sm sm:text-base">{description}</p>
      <button
        onClick={onClick}
        aria-label={`${actionText} for ${title}`}
        className="mt-auto bg-brand-dark-green text-white font-semibold py-2 px-4 sm:px-6 rounded-full hover:bg-brand-light-green hover:text-brand-dark-green transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark-green"
      >
        {actionText}
      </button>
    </div>
  );
};

export default React.memo(FeatureCard);