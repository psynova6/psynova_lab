import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { P, PastelCard, CardHeader } from '../institution/DepartmentDetailView';
import type { TherapistStudent, StudentSession } from '../../types';

interface StudentAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentName: string;
    sessions: StudentSession[];
    severityLevel: string;
    sessionsCompleted: number;
}

const StudentAnalysisModal: React.FC<StudentAnalysisModalProps> = ({
    isOpen,
    onClose,
    studentName,
    sessions,
    severityLevel,
    sessionsCompleted
}) => {
    if (!isOpen) return null;

    // --- Mock Data Generation based on student status ---
    const generateTrendData = () => {
        const data = [];
        let currentWellness = severityLevel === 'safe' ? 7 : severityLevel === 'mild' ? 5 : 3;

        for (let i = 6; i >= 0; i--) {
            data.push({
                week: `Week -${i}`,
                wellness: Math.max(1, Math.min(10, currentWellness + (Math.random() * 2 - 1)))
            });
            // Simulate gradual improvement
            currentWellness += 0.5;
        }
        return data;
    };

    const generateAttendanceData = () => {
        return [
            { month: 'Jan', attended: Math.floor(sessionsCompleted * 0.1), missed: 0 },
            { month: 'Feb', attended: Math.floor(sessionsCompleted * 0.2), missed: 1 },
            { month: 'Mar', attended: Math.floor(sessionsCompleted * 0.3), missed: 0 },
            { month: 'Apr', attended: Math.floor(sessionsCompleted * 0.4), missed: 2 },
        ];
    };

    const trendData = generateTrendData();
    const attendanceData = generateAttendanceData();

    const getSeverityColor = (severity: string) => {
        if (severity === 'safe') return P.safe;
        if (severity === 'mild') return P.mild;
        return P.critical;
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                style={{ backgroundColor: P.bg, borderRadius: '32px', padding: '2.5rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}
                className="w-full max-w-5xl shadow-2xl relative"
            >
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-3xl font-bold" style={{ color: P.textMain }}>
                            {studentName}'s Analysis
                        </h2>
                        <p style={{ color: P.textMuted }} className="text-lg mt-1">
                            Comprehensive wellness and attendance breakdown
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors absolute top-8 right-8"
                        style={{ color: P.textMuted }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* KPI Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <PastelCard>
                        <div className="flex flex-col">
                            <span style={{ color: P.textMuted }} className="text-sm font-semibold uppercase tracking-wider mb-2">Current Status</span>
                            <div className="flex items-end gap-3">
                                <span style={{ color: getSeverityColor(severityLevel) }} className="text-4xl font-bold capitalize">
                                    {severityLevel}
                                </span>
                            </div>
                        </div>
                    </PastelCard>
                    <PastelCard>
                        <div className="flex flex-col">
                            <span style={{ color: P.textMuted }} className="text-sm font-semibold uppercase tracking-wider mb-2">Total Sessions</span>
                            <div className="flex items-end gap-3">
                                <span style={{ color: P.textMain }} className="text-4xl font-bold">
                                    {sessionsCompleted}
                                </span>
                            </div>
                        </div>
                    </PastelCard>
                    <PastelCard>
                        <div className="flex flex-col">
                            <span style={{ color: P.textMuted }} className="text-sm font-semibold uppercase tracking-wider mb-2">Recent Engagement</span>
                            <div className="flex items-end gap-3">
                                <span style={{ color: P.safe }} className="text-4xl font-bold">
                                    High
                                </span>
                            </div>
                        </div>
                    </PastelCard>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Wellness Trend */}
                    <PastelCard>
                        <CardHeader
                            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>}
                            title="Wellness Trajectory (Last 6 Weeks)"
                        />
                        <div className="h-64 mt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={P.tabBg} />
                                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: P.textMuted, fontSize: 12 }} dy={10} />
                                    <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: P.textMuted, fontSize: 12 }} />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                                        itemStyle={{ color: P.textMain, fontWeight: 600 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="wellness"
                                        stroke={getSeverityColor(severityLevel)}
                                        strokeWidth={4}
                                        dot={{ fill: getSeverityColor(severityLevel), strokeWidth: 2, r: 6, stroke: '#fff' }}
                                        activeDot={{ r: 8, strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </PastelCard>

                    {/* Attendance History */}
                    <PastelCard>
                        <CardHeader
                            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>}
                            title="Session Attendance"
                        />
                        <div className="h-64 mt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={P.tabBg} />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: P.textMuted, fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: P.textMuted, fontSize: 12 }} />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                                    />
                                    <Area type="monotone" dataKey="attended" stackId="1" stroke={P.safe} fill={P.safe} fillOpacity={0.6} />
                                    <Area type="monotone" dataKey="missed" stackId="1" stroke={P.critical} fill={P.critical} fillOpacity={0.6} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </PastelCard>
                </div>
            </motion.div>
        </div>
    );
};

export default StudentAnalysisModal;
