
import React from 'react';
import { SettingsIcon, BillingIcon, LogoutIcon, UserIcon } from '../common/icons';
import type { UserProfile } from '../../types';

interface AccountDropdownProps {
  isOpen: boolean;
  userProfile: UserProfile;
  onOpenProfileSettings: () => void;
  onOpenSubscription: () => void;
  onLogout: () => void;
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({ isOpen, userProfile, onOpenProfileSettings, onOpenSubscription, onLogout }) => {
  if (!isOpen) return null;

  const handleProfileClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenProfileSettings();
  };

  const handleSubscriptionClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onOpenSubscription();
  }

  const handleLogoutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onLogout();
  }

  return (
    <div className="absolute right-0 mt-2 w-64 bg-brand-background rounded-3xl shadow-2xl border border-brand-light-green/30 z-50 animate-fade-in-down origin-top-right">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-brand-light-green/30 flex items-center justify-center mr-3 overflow-hidden">
            {userProfile.avatar ? (
              <img src={userProfile.avatar} alt="User Avatar" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-7 h-7 text-brand-dark-green" />
            )}
          </div>
          <div>
            <p className="font-bold text-brand-dark-green">{userProfile.name}</p>
            <p className="text-sm text-brand-dark-green/70">{localStorage.getItem('selectedPlan') || 'Free'} Plan</p>
          </div>
        </div>
        <div className="border-t border-brand-light-green/50 -mx-4"></div>
      </div>

      <div className="px-2 pb-2">
        <a href="#" onClick={handleProfileClick} className="flex items-center px-3 py-2 text-brand-dark-green rounded-2xl hover:bg-brand-light-green/20 transition-colors">
          <SettingsIcon className="w-5 h-5 mr-3" />
          <span>Profile Settings</span>
        </a>
        <a href="#" onClick={handleSubscriptionClick} className="flex items-center px-3 py-2 text-brand-dark-green rounded-2xl hover:bg-brand-light-green/20 transition-colors">
          <BillingIcon className="w-5 h-5 mr-3" />
          <span>Subscription</span>
        </a>
        <div className="border-t border-brand-light-green/50 my-2"></div>
        <a href="#" onClick={handleLogoutClick} className="flex items-center px-3 py-2 text-red-600 rounded-2xl hover:bg-red-100/50 transition-colors">
          <LogoutIcon className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </a>
      </div>
    </div>
  );
};

export default AccountDropdown;
