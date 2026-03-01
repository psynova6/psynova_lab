import React from 'react';
import type { Notification } from '../../types';
import { NotificationIconRenderer } from '../common/icons';

interface NotificationsDropdownProps {
    isOpen: boolean;
    notifications: Notification[];
    onViewAll: () => void;
    onMarkAsRead: (id: number) => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ isOpen, notifications, onViewAll, onMarkAsRead }) => {
    if (!isOpen) return null;

    const handleGenericClick = (title: string) => {
        alert(`Navigating to ${title}. This feature is coming soon!`);
    };

    const displayedNotifications = notifications.slice(0, 5);

    return (
        <div className="absolute right-0 mt-2 w-80 bg-brand-background rounded-3xl shadow-2xl border border-brand-light-green/30 z-50 animate-fade-in-down origin-top-right">
            <div className="p-4 border-b border-brand-light-green/50">
                <h3 className="font-bold text-lg text-brand-dark-green">Notifications</h3>
            </div>

            <div className="py-2 max-h-80 overflow-y-auto">
                {displayedNotifications.length > 0 ? (
                    displayedNotifications.map((notif) => (
                        <a
                            href="#"
                            key={notif.id}
                            onClick={(e) => {
                                e.preventDefault();
                                onMarkAsRead(notif.id);
                                if (notif.onClick) {
                                    notif.onClick();
                                } else {
                                    handleGenericClick(notif.title);
                                }
                            }}
                            className={`block p-3 hover:bg-brand-light-green/20 transition-colors ${!notif.read ? 'bg-brand-light-green/10' : ''}`}>
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
                    <div className="p-4 text-center text-sm text-brand-dark-green/70">
                        You have no new notifications.
                    </div>
                )}
            </div>

            <div className="p-2 border-t border-brand-light-green/50 text-center">
                <button
                    onClick={onViewAll}
                    aria-label="View all notifications in a modal"
                    className="text-sm font-semibold text-brand-dark-green hover:underline w-full p-2 rounded-lg">
                    View all notifications
                </button>
            </div>
        </div>
    );
};

export default NotificationsDropdown;