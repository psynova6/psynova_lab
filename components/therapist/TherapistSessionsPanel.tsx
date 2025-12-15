import React, { useState } from 'react';
import { CalendarIcon } from '../common/icons';
import type { StudentSession } from '../../types';

interface TherapistSessionsPanelProps {
    sessions: StudentSession[];
    studentName: string;
}

const TherapistSessionsPanel: React.FC<TherapistSessionsPanelProps> = ({ sessions, studentName }) => {
    const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');

    const filteredSessions = sessions.filter(session =>
        filterStatus === 'all' || session.status === filterStatus
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-brand-dark-green text-white';
            case 'scheduled':
                return 'bg-yellow-500 text-white';
            case 'cancelled':
                return 'bg-red-500 text-white';
            default:
                return 'bg-gray-400 text-white';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const sortedSessions = [...filteredSessions].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-brand-dark-green">Sessions with {studentName}</h3>
                    <p className="text-sm text-brand-dark-green/70">{filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''}</p>
                </div>

                {/* Filter buttons */}
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${filterStatus === 'all'
                                ? 'bg-brand-dark-green text-white'
                                : 'bg-brand-background text-brand-dark-green hover:bg-brand-light-green/30'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilterStatus('scheduled')}
                        className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${filterStatus === 'scheduled'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-brand-background text-brand-dark-green hover:bg-brand-light-green/30'
                            }`}
                    >
                        Scheduled
                    </button>
                    <button
                        onClick={() => setFilterStatus('completed')}
                        className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${filterStatus === 'completed'
                                ? 'bg-brand-dark-green text-white'
                                : 'bg-brand-background text-brand-dark-green hover:bg-brand-light-green/30'
                            }`}
                    >
                        Completed
                    </button>
                    <button
                        onClick={() => setFilterStatus('cancelled')}
                        className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${filterStatus === 'cancelled'
                                ? 'bg-red-500 text-white'
                                : 'bg-brand-background text-brand-dark-green hover:bg-brand-light-green/30'
                            }`}
                    >
                        Cancelled
                    </button>
                </div>
            </div>

            {/* Sessions list */}
            <div className="space-y-3">
                {sortedSessions.map(session => (
                    <div key={session.id} className="bg-white/60 rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1">
                                <CalendarIcon className="w-6 h-6 text-brand-dark-green flex-shrink-0 mt-1" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="font-bold text-brand-dark-green">{formatDate(session.date)}</h4>
                                        <span className="text-sm text-brand-dark-green/70">{session.time}</span>
                                    </div>
                                    {session.notes && (
                                        <div className="mt-2 bg-brand-background/50 rounded-lg p-3">
                                            <p className="text-sm font-semibold text-brand-dark-green/80 mb-1">Session Notes:</p>
                                            <p className="text-sm text-brand-dark-green/90">{session.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(session.status)} whitespace-nowrap`}>
                                {session.status.toUpperCase()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {sortedSessions.length === 0 && (
                <div className="text-center py-12 text-brand-dark-green/70 bg-brand-background/30 rounded-2xl">
                    <p>No {filterStatus !== 'all' ? filterStatus : ''} sessions found.</p>
                </div>
            )}
        </div>
    );
};

export default TherapistSessionsPanel;
