import React from 'react';
import { AlarmClockIcon } from '../common/icons';
import type { Reminder } from '../../types';

interface RemindersListProps {
    reminders: Reminder[];
    onDelete: (id: number) => void;
}

const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    return date.toLocaleString('en-US', options);
}

const RemindersList: React.FC<RemindersListProps> = ({ reminders, onDelete }) => {
    const upcomingReminders = reminders
        .filter(r => new Date(r.dueDate).getTime() > Date.now())
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    // FIX: Added confirmation before deleting a reminder to prevent accidental removal.
    const handleDelete = (id: number, task: string) => {
        if (window.confirm(`Are you sure you want to delete the reminder for "${task}"?`)) {
            onDelete(id);
        }
    };

    return (
        <section className="py-6 sm:py-10 md:py-12">
            <div className="text-center mb-4 sm:mb-6 md:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-dark-green">Upcoming Reminders</h2>
                <p className="text-sm sm:text-base md:text-lg text-brand-dark-green/80 mt-1 sm:mt-2 max-w-2xl mx-auto">
                    Stay on top of your tasks and well-being goals.
                </p>
            </div>
            <div className="max-w-2xl mx-auto">
                <div className="bg-white/60 rounded-2xl sm:rounded-[2rem] shadow-lg p-4 sm:p-6 w-full">
                    {upcomingReminders.length > 0 ? (
                        <ul className="space-y-2 sm:space-y-3">
                            {upcomingReminders.map((reminder) => (
                                <li key={reminder.id} className="flex items-center justify-between p-2 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-brand-light-green/20 transition-colors duration-200">
                                    <div className="flex items-center flex-1 min-w-0">
                                        <AlarmClockIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-brand-dark-green/70 flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-brand-dark-green text-sm sm:text-base truncate">{reminder.task}</p>
                                            <p className="text-xs sm:text-sm text-brand-dark-green/70 truncate">Due: {formatDate(reminder.dueDate)}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(reminder.id, reminder.task)}
                                        aria-label={`Delete reminder for: ${reminder.task}`}
                                        className="text-xs sm:text-sm text-red-600 font-semibold py-1 px-2 sm:px-3 rounded-full hover:bg-red-100 transition-colors flex-shrink-0 ml-2">
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-brand-dark-green/70 py-4 text-sm sm:text-base">You have no upcoming reminders set.</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default React.memo(RemindersList);