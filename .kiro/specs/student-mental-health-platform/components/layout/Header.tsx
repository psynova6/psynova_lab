import React, { useState, useRef, useEffect } from 'react';
import { UserIcon, NotificationIcon } from '../common/icons';
import AccountDropdown from './AccountDropdown';
import NotificationsDropdown from './NotificationsDropdown';
import Logo from './Logo';
import type { UserProfile, Notification } from '../../types';

interface HeaderProps {
  userProfile: UserProfile;
  notifications: Notification[];
  onOpenProfileSettings: () => void;
  onOpenSubscription: () => void;
  onLogout: () => void;
  onClearNotifications: () => void;
  onViewAllNotifications: () => void;
  onMarkAsRead: (id: number) => void;
}

const Header: React.FC<HeaderProps> = ({
  userProfile,
  notifications,
  onOpenProfileSettings,
  onOpenSubscription,
  onLogout,
  onClearNotifications,
  onViewAllNotifications,
  onMarkAsRead
}) => {
  const [isAccountOpen, setAccountOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);

  const hasUnreadNotifications = notifications.some(n => !n.read);

  const accountRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAccountToggle = () => {
    setNotificationsOpen(false);
    setAccountOpen(!isAccountOpen);
  };

  const handleNotificationsToggle = () => {
    setAccountOpen(false);
    setNotificationsOpen(!isNotificationsOpen);
  };

  const handleNotificationsClick = () => {
    handleNotificationsToggle();
  }

  return (
    <header className="sticky top-0 bg-brand-background/80 backdrop-blur-md z-40 border-b border-white/30 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          <div className="flex items-center min-w-0 ml-2 md:ml-6">
            <Logo className="h-14 md:h-20 w-auto transition-all duration-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]" />
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={handleNotificationsClick}
                aria-label="Open notifications"
                className="relative p-2 rounded-full text-brand-dark-green hover:bg-brand-light-green/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark-green"
              >
                <NotificationIcon className="h-6 w-6" />
                {hasUnreadNotifications && (
                  <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-brand-background"></span>
                )}
              </button>
              <NotificationsDropdown
                isOpen={isNotificationsOpen}
                notifications={notifications}
                onViewAll={() => {
                  setNotificationsOpen(false);
                  onViewAllNotifications();
                }}
                onMarkAsRead={onMarkAsRead}
              />
            </div>

            <div className="relative" ref={accountRef}>
              <button
                onClick={handleAccountToggle}
                aria-label="Open account menu"
                className="rounded-full text-brand-dark-green hover:bg-brand-light-green/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark-green"
              >
                {userProfile.avatar ? (
                  <img src={userProfile.avatar} alt="User Avatar" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="p-1">
                    <UserIcon className="h-6 w-6" />
                  </div>
                )}
              </button>
              <AccountDropdown
                isOpen={isAccountOpen}
                userProfile={userProfile}
                onOpenProfileSettings={() => {
                  setAccountOpen(false);
                  onOpenProfileSettings();
                }}
                onOpenSubscription={() => {
                  setAccountOpen(false);
                  onOpenSubscription();
                }}
                onLogout={onLogout}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);