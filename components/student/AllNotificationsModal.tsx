import React from 'react';
import type { Notification } from '../../types';
import { NotificationIconRenderer } from '../common/icons';

interface AllNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllAsRead: () => void;
}

const AllNotificationsModal: React.FC<AllNotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead
}) => {
  if (!isOpen) return null;

  const handleGenericClick = (title: string) => {
    alert(`Navigating to ${title}. This feature is coming soon!`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-brand-background rounded-[2rem] shadow-2xl w-full max-w-2xl h-[90vh] max-h-[700px] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-brand-light-green/50">
          <h2 className="text-xl font-bold text-brand-dark-green">All Notifications</h2>
          <button onClick={onClose} aria-label="Close notifications view" className="text-brand-dark-green/70 hover:text-brand-dark-green text-3xl font-light leading-none">&times;</button>
        </header>

        <div className="flex-1 overflow-y-auto p-2">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <a
                href="#"
                key={notif.id}
                onClick={(e) => {
                  e.preventDefault();
                  if (notif.onClick) {
                    notif.onClick();
                    onClose();
                  } else {
                    handleGenericClick(notif.title);
                  }
                }}
                className={`block p-3 m-2 rounded-2xl hover:bg-brand-light-green/20 transition-colors ${!notif.read ? 'bg-brand-light-green/10' : ''}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-light-green/30 flex items-center justify-center mr-3">
                    <NotificationIconRenderer iconName={notif.icon} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-brand-dark-green">{notif.title}</p>
                    <p className="text-xs text-brand-dark-green/80">{notif.description}</p>
                    <p className="text-xs text-brand-dark-green/60 mt-1">{notif.time}</p>
                  </div>
                  {!notif.read && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 ml-2 flex-shrink-0"></div>}
                </div>
              </a>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-brand-dark-green/70 h-full flex items-center justify-center">
              <p>You have no notifications.</p>
            </div>
          )}
        </div>

        <footer className="p-4 border-t border-brand-light-green/50 flex items-center justify-between">
          <button
            onClick={onMarkAllAsRead}
            aria-label="Mark all notifications as read"
            disabled={notifications.every(n => n.read)}
            className="text-sm font-semibold text-brand-dark-green hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark all as read
          </button>
          <button
            onClick={onClose}
            aria-label="Close notifications view"
            className="bg-brand-dark-green text-white font-semibold py-2 px-8 rounded-full hover:bg-brand-dark-green/90 transition-colors"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AllNotificationsModal;