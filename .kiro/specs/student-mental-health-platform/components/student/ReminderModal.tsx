import React, { useState } from 'react';
import type { Reminder } from '../../types';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetReminder: (reminder: Omit<Reminder, 'id'>) => void;
}

const reminderOptions = [
    { label: 'On time', value: 0 },
    { label: '5 minutes before', value: 5 },
    { label: '15 minutes before', value: 15 },
    { label: '30 minutes before', value: 30 },
    { label: '1 hour before', value: 60 },
    { label: '1 day before', value: 1440 },
];

const ReminderModal: React.FC<ReminderModalProps> = ({ isOpen, onClose, onSetReminder }) => {
    const [task, setTask] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [reminderTiming, setReminderTiming] = useState(0);
    const [error, setError] = useState('');

    if (!isOpen) return null;
    
    const getMinDate = () => {
        return new Date().toISOString().split('T')[0];
    }

    const getMaxDate = () => {
        const d = new Date();
        d.setFullYear(d.getFullYear() + 1);
        return d.toISOString().split('T')[0];
    }

    const handleSubmit = () => {
        if (!task.trim()) {
            setError('Please enter a task description.');
            return;
        }
        if (!date || !time) {
            setError('Please set a due date and time.');
            return;
        }
        
        const dueDate = new Date(`${date}T${time}`);
        if (dueDate.getTime() <= Date.now()) {
            setError('The due date and time must be in the future.');
            return;
        }

        onSetReminder({
            task,
            dueDate: dueDate.toISOString(),
            reminderTiming,
        });

        // Reset form and close
        setTask('');
        setDate('');
        setTime('');
        setReminderTiming(0);
        setError('');
        onClose();
    };

    const triggerPicker = (e: React.MouseEvent<HTMLInputElement>) => {
        try {
            // "showPicker" is a standard method on input elements in modern browsers
            if ('showPicker' in e.currentTarget) {
                (e.currentTarget as any).showPicker();
            }
        } catch (error) {
            // Ignore errors if browser doesn't support it
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-brand-background rounded-[2rem] shadow-2xl w-full max-w-lg flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-brand-light-green/50">
                    <h2 className="text-xl font-bold text-brand-dark-green">Set a Reminder</h2>
                    <button onClick={onClose} aria-label="Close reminder modal" className="text-brand-dark-green/70 hover:text-brand-dark-green text-3xl font-light leading-none">&times;</button>
                </header>

                <div className="p-6 md:p-8 space-y-4">
                    <div>
                        <label htmlFor="task" className="block text-sm font-medium text-brand-dark-green/80 mb-1">Task</label>
                        <input type="text" id="task" value={task} onChange={(e) => setTask(e.target.value)} placeholder="e.g., Complete math assignment" aria-label="Task description for reminder" className="w-full px-3 py-2 border border-brand-light-green/50 rounded-2xl focus:ring-brand-dark-green focus:border-brand-dark-green bg-white/50" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-brand-dark-green/80 mb-1">Due Date</label>
                            <input 
                                type="date" 
                                id="date" 
                                value={date} 
                                min={getMinDate()} 
                                max={getMaxDate()}
                                onChange={(e) => setDate(e.target.value)}
                                onClick={triggerPicker} 
                                aria-label="Due date for reminder" 
                                className="w-full px-3 py-2 border border-brand-light-green/50 rounded-2xl focus:ring-brand-dark-green focus:border-brand-dark-green bg-white/50 cursor-pointer" 
                            />
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-brand-dark-green/80 mb-1">Time</label>
                            <input 
                                type="time" 
                                id="time" 
                                value={time} 
                                onChange={(e) => setTime(e.target.value)} 
                                onClick={triggerPicker}
                                aria-label="Due time for reminder" 
                                className="w-full px-3 py-2 border border-brand-light-green/50 rounded-2xl focus:ring-brand-dark-green focus:border-brand-dark-green bg-white/50 cursor-pointer" 
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="reminder" className="block text-sm font-medium text-brand-dark-green/80 mb-1">Remind me</label>
                        <select id="reminder" value={reminderTiming} onChange={(e) => setReminderTiming(Number(e.target.value))} aria-label="Reminder notification timing" className="w-full px-3 py-2 border border-brand-light-green/50 rounded-2xl focus:ring-brand-dark-green focus:border-brand-dark-green bg-white/50">
                            {reminderOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                </div>
                
                <footer className="p-4 border-t border-brand-light-green/50 flex items-center justify-end gap-4">
                    <button onClick={onClose} aria-label="Cancel creating reminder" className="px-6 py-2 rounded-full hover:bg-gray-200/50 transition-colors">Cancel</button>
                    <button onClick={handleSubmit} aria-label="Save and set new reminder" className="bg-brand-dark-green text-white font-semibold py-2 px-8 rounded-full hover:bg-brand-dark-green/90 transition-colors">Set Reminder</button>
                </footer>
            </div>
        </div>
    );
};

export default ReminderModal;