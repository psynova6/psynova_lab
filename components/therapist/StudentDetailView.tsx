import React, { useState } from 'react';
import TherapistNotesPanel from './TherapistNotesPanel';
import TherapistSessionsPanel from './TherapistSessionsPanel';
import type { TherapistStudent, StudentSession } from '../../types';

interface StudentDetailViewProps {
    student: TherapistStudent;
    departmentName: string;
    therapistId: number;
    sessions: StudentSession[];
    onBack: () => void;
}

const StudentDetailView: React.FC<StudentDetailViewProps> = ({ student, departmentName, therapistId, sessions, onBack }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'sessions'>('overview');

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'safe':
                return 'bg-brand-dark-green';
            case 'mild':
                return 'bg-yellow-500';
            case 'critical':
                return 'bg-red-500';
            default:
                return 'bg-gray-400';
        }
    };

    const getSeverityTextColor = (severity: string) => {
        switch (severity) {
            case 'safe':
                return 'text-brand-dark-green';
            case 'mild':
                return 'text-yellow-600';
            case 'critical':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not checked in';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="animate-fade-in-down">
            <div className="flex items-center mb-8">
                <button onClick={onBack} aria-label="Back to student list" className="p-2 w-12 h-12 flex items-center justify-center text-3xl rounded-full text-brand-dark-green/60 hover:text-brand-dark-green hover:bg-black/10 transition-colors">&larr;</button>
                <h1 className="text-3xl font-bold text-center flex-grow">Student Details</h1>
                <div className="w-12 h-12"></div> {/* Spacer */}
            </div>

            {/* Student header card */}
            <div className="bg-white/60 rounded-[2rem] shadow-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-brand-dark-green mb-2">{student.name}</h2>
                        <p className="text-sm text-brand-dark-green/70">{departmentName}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className={`px-4 py-2 rounded-full font-bold ${getSeverityColor(student.severityLevel)} text-white text-lg`}>
                            {student.severityLevel.toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-brand-dark-green/10">
                    <div className="text-center bg-brand-background/50 p-4 rounded-2xl">
                        <p className="text-2xl font-bold text-brand-dark-green">{student.sessionsCompleted}</p>
                        <p className="text-sm text-brand-dark-green/70">Sessions Completed</p>
                    </div>
                    <div className="text-center bg-brand-background/50 p-4 rounded-2xl">
                        <p className={`text-2xl font-bold ${getSeverityTextColor(student.severityLevel)}`}>{student.severityLevel}</p>
                        <p className="text-sm text-brand-dark-green/70">Current Status</p>
                    </div>
                    <div className="text-center bg-brand-background/50 p-4 rounded-2xl">
                        <p className="text-sm font-bold text-brand-dark-green">{formatDate(student.lastCheckIn).split(',')[0]}</p>
                        <p className="text-xs text-brand-dark-green/70">Last Check-in</p>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-colors ${activeTab === 'overview'
                            ? 'bg-brand-dark-green text-white'
                            : 'bg-white/60 text-brand-dark-green hover:bg-brand-light-green/30'
                        }`}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('notes')}
                    className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-colors ${activeTab === 'notes'
                            ? 'bg-brand-dark-green text-white'
                            : 'bg-white/60 text-brand-dark-green hover:bg-brand-light-green/30'
                        }`}
                >
                    Notes
                </button>
                <button
                    onClick={() => setActiveTab('sessions')}
                    className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-colors ${activeTab === 'sessions'
                            ? 'bg-brand-dark-green text-white'
                            : 'bg-white/60 text-brand-dark-green hover:bg-brand-light-green/30'
                        }`}
                >
                    Sessions
                </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white/60 rounded-[2rem] shadow-lg p-6">
                {activeTab === 'overview' && (
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-brand-dark-green mb-4">Student Overview</h3>
                        <div className="space-y-4">
                            <div className="bg-brand-background/50 p-4 rounded-2xl">
                                <p className="font-semibold text-brand-dark-green mb-2">Current Wellness Level:</p>
                                <p className={`text-lg font-bold ${getSeverityTextColor(student.severityLevel)}`}>
                                    {student.severityLevel === 'safe' && 'Student is in a safe mental state'}
                                    {student.severityLevel === 'mild' && 'Student is experiencing mild stress/anxiety'}
                                    {student.severityLevel === 'critical' && 'Student requires immediate attention and support'}
                                </p>
                            </div>
                            <div className="bg-brand-background/50 p-4 rounded-2xl">
                                <p className="font-semibold text-brand-dark-green mb-2">Last Check-in:</p>
                                <p className="text-brand-dark-green/90">{formatDate(student.lastCheckIn)}</p>
                            </div>
                            <div className="bg-brand-background/50 p-4 rounded-2xl">
                                <p className="font-semibold text-brand-dark-green mb-2">Progress:</p>
                                <p className="text-brand-dark-green/90">Completed {student.sessionsCompleted} therapy sessions</p>
                            </div>
                        </div>
                        <div className="mt-6 p-4 bg-brand-light-green/20 rounded-2xl border-2 border-brand-light-green/50">
                            <p className="text-sm text-brand-dark-green">
                                💡 <strong>Tip:</strong> Use the Notes tab to keep track of session progress and the Sessions tab to view appointment history.
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'notes' && (
                    <TherapistNotesPanel
                        therapistId={therapistId}
                        studentId={student.id}
                        studentName={student.name}
                    />
                )}

                {activeTab === 'sessions' && (
                    <TherapistSessionsPanel
                        sessions={sessions}
                        studentName={student.name}
                    />
                )}
            </div>
        </div>
    );
};

export default StudentDetailView;
