
import React from 'react';
import Pricing from './Pricing';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: string | null;
  onPlanSelect: (planName: string) => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, selectedPlan, onPlanSelect }) => {
  if (!isOpen) return null;

  const currentPlanName = selectedPlan || 'Free';

  const handlePlanSelect = (planName: string) => {
    onPlanSelect(planName);
    if (planName !== currentPlanName) {
        alert(`You have successfully switched to the ${planName} plan.`);
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-brand-background rounded-[2rem] shadow-2xl w-full max-w-5xl h-[90vh] max-h-[900px] flex flex-col">
        <header className="flex items-center justify-between p-6 border-b border-brand-light-green/50">
          <div>
            <h2 className="text-2xl font-bold text-brand-dark-green">Manage Subscription</h2>
            <p className="text-brand-dark-green/70 mt-1">
                Current Plan: <span className="font-bold text-brand-dark-green">{currentPlanName}</span>
            </p>
          </div>
          <button onClick={onClose} aria-label="Close subscription modal" className="text-brand-dark-green/70 hover:text-brand-dark-green text-4xl font-light leading-none">&times;</button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
            <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-brand-dark-green mb-2">Available Plans</h3>
                <p className="text-brand-dark-green/80">Choose the plan that best fits your mental wellness journey.</p>
            </div>
            <Pricing selectedPlan={currentPlanName} onPlanSelect={handlePlanSelect} />
        </div>

        <footer className="p-6 border-t border-brand-light-green/50 text-right">
            <button
              onClick={onClose}
              aria-label="Close subscription modal"
              className="bg-brand-dark-green text-white font-semibold py-2 px-8 rounded-full hover:bg-brand-dark-green/90 transition-colors"
            >
              Close
            </button>
        </footer>
      </div>
    </div>
  );
};

export default SubscriptionModal;
