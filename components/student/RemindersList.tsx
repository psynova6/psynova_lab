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
        <div className="h-full bg-white/90 rounded-3xl shadow-premium p-6 sm:p-8 animate-fade-in-down flex flex-col border border-brand-light-green/20">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-brand-light-green/20 flex items-center justify-center">
                        <AlarmClockIcon className="w-6 h-6 text-brand-dark-green" />
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-brand-dark-green tracking-tight">Daily Tasks</h2>
                        <p className="text-sm text-brand-dark-green/70">{upcomingReminders.length} pending tasks</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3">
                {upcomingReminders.length > 0 ? (
                    upcomingReminders.map((reminder) => (
                        <div key={reminder.id} className="group flex items-start justify-between p-4 rounded-2xl bg-brand-background/30 hover:bg-brand-light-green/10 transition-colors duration-200 border border-transparent hover:border-brand-light-green/30">
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                <button
                                    onClick={() => handleDelete(reminder.id, reminder.task)}
                                    className="mt-0.5 w-6 h-6 rounded-full border-2 border-brand-light-green flex items-center justify-center flex-shrink-0 hover:bg-brand-light-green hover:border-brand-dark-green transition-all group/btn"
                                    title="Mark as complete"
                                >
                                    <svg className="w-3.5 h-3.5 text-white opacity-0 group-hover/btn:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                </button>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-brand-dark-green text-sm sm:text-base leading-tight">{reminder.task}</p>
                                    <p className="text-xs font-medium text-brand-dark-green/60 mt-1">Due: {formatDate(reminder.dueDate)}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-brand-light-green/10 flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-brand-dark-green/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <p className="font-bold text-brand-dark-green/80 text-lg">All caught up!</p>
                        <p className="text-sm font-medium text-brand-dark-green/50 mt-1">No tasks for today.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(RemindersList);