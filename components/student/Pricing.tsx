
import React from 'react';
import { CheckIcon } from '../common/icons';

const pricingData = [
  {
    name: 'Free',
    price: '₹0',
    description: 'Awareness & self-help plan',
    features: [
      'AI-guided self-help chat',
      'Mood tracking tools',
      'Basic mental health quizzes',
      'Limited educational content',
    ],
  },
  {
    name: 'Basic',
    price: '₹99',
    priceSuffix: '/month',
    description: 'Affordable self-guided plan',
    features: [
      'Full AI mental health support',
      'Access to entire psychoeducation library',
      '1 discounted therapy session per month',
    ],
  },
  {
    name: 'Premium',
    price: '₹199',
    priceSuffix: '/month',
    description: 'Balanced AI + therapy access',
    features: [
      'All Basic features',
      '2 therapy sessions/month (partially subsidized)',
      '24/7 mental health helpline',
      'Priority AI guidance and progress tracking',
    ],
  },
];

interface PricingCardProps {
  plan: typeof pricingData[0];
  isSelected: boolean;
  onSelect: (planName: string) => void;
}

const PricingCard: React.FC<PricingCardProps> = React.memo(({ plan, isSelected, onSelect }) => {
  const cardClasses = `group rounded-[2rem] p-6 flex flex-col h-full transition-all duration-300 ease-in-out ${isSelected
      ? 'bg-brand-dark-green text-white scale-105 shadow-2xl'
      : 'bg-white/60 text-brand-dark-green shadow-lg hover:bg-brand-dark-green hover:text-white hover:scale-105 hover:shadow-2xl'
    }`;

  const buttonClasses = `w-full py-3 mt-auto font-semibold rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isSelected
      ? 'bg-brand-light-green text-brand-dark-green hover:bg-white focus:ring-brand-light-green'
      : 'bg-brand-dark-green text-white group-hover:bg-brand-light-green group-hover:text-brand-dark-green focus:ring-brand-dark-green'
    }`;

  const handleChoosePlan = () => {
    onSelect(plan.name);
    if (plan.name === 'Premium') {
      // In a real app, you might redirect to payment here
    }
  }

  return (
    <div className={cardClasses}>
      <div>
        <h3 className="text-xl sm:text-2xl font-bold">{plan.name}</h3>
        <p className={`mt-2 transition-colors text-sm sm:text-base ${isSelected ? 'text-gray-300' : 'text-gray-600 group-hover:text-gray-300'}`}>{plan.description}</p>
        <div className="mt-6">
          <span className="text-3xl sm:text-4xl font-extrabold">{plan.price}</span>
          {plan.priceSuffix && <span className="text-base sm:text-lg font-medium">{plan.priceSuffix}</span>}
        </div>
      </div>
      <ul className="space-y-4 mt-8 flex-grow text-sm sm:text-base">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckIcon className={`w-6 h-6 mr-3 flex-shrink-0 transition-colors ${isSelected ? 'text-brand-light-green' : 'text-brand-dark-green group-hover:text-brand-light-green'}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={handleChoosePlan}
        aria-label={`Choose the ${plan.name} plan`}
        className={buttonClasses}>
        {isSelected ? 'Current Plan' : 'Choose Plan'}
      </button>
    </div>
  );
});

interface PricingProps {
  selectedPlan: string | null;
  onPlanSelect: (planName: string) => void;
}

const Pricing: React.FC<PricingProps> = React.memo(({ selectedPlan, onPlanSelect }) => {
  // Default to Free if no plan selected
  const currentPlan = selectedPlan || 'Free';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch p-4">
      {pricingData.map((plan) => (
        <PricingCard
          key={plan.name}
          plan={plan}
          isSelected={currentPlan === plan.name}
          onSelect={onPlanSelect}
        />
      ))}
    </div>
  );
});

export default Pricing;
