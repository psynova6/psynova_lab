const fs = require('fs');
const content = `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area,
    ScatterChart, Scatter, ZAxis,
    BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import type { Department } from '../../types';

// Palette matching the pastel reference images
export const P = {
    bg: '#f1ece9', // Soft pastel cream background
    cardBg: '#f9f6f5', // Slightly off-white/translucent for cards
    textMain: '#3b4c40', // Dark green/grey text
    textMuted: '#8a948e', // Muted text
    tabBg: '#e9e3e0', // Inactive tab background
    tabActiveBg: '#7ca283', // Active tab background (soft green)
    tabActiveText: '#ffffff',
    tabInactiveText: '#6f7e75',

    // Chart Colors
    safe: '#82b989', // Soft green
    mild: '#efbb65', // Soft amber/yellow
    critical: '#dc7665', // Soft red

    cardBorder: 'rgba(255, 255, 255, 0.4)', // Very subtle white border to pop from background
    cardShadow: '0 8px 32px rgba(100, 90, 80, 0.04), 0 2px 8px rgba(100, 90, 80, 0.02)', // Soft ambient shadow
};

// Privacy helpers
export const anonStudent = (i: number) => \\\`Student \\\${['A', 'B', 'C', 'D', 'E', 'F', 'G'][i % 7]}\\\`;
export const anonTherapist = (i: number) => \\\`Therapist \\\${i + 1}\\\`;

// Base Card Primitive
export const PastelCard: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
    <motion.div 
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
        }}
        style={{
            background: P.cardBg,
            borderRadius: '20px',
            padding: '1.25rem',
            boxShadow: P.cardShadow,
            border: \\\`1px solid \\\${P.cardBorder}\\\`,
            ...style
        }}
        whileHover={{ scale: 1.01, boxShadow: '0 12px 40px rgba(100, 90, 80, 0.08)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
        {children}
    </motion.div>
);

export const CardHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
        <div style={{ color: P.textMuted }}>{icon}</div>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: P.textMain }}>{title}</h3>
    </div>
);

// Tab Content
const DepartmentOverview: React.FC<{ dept: Department }> = ({ dept }) => {
    return (
        <motion.div 
            initial="hidden" animate="visible" exit="hidden"
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
            {/* Top: Large Wellness Distribution Bar */}
            <PastelCard>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <CardHeader icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>} title="Student Wellness Zones" />
                    <div style={{ background: P.bg, padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', color: P.textMuted, fontWeight: 500 }}>
                        1250 Total Students
                    </div>
                </div>

                <div style={{ height: '40px', display: 'flex', borderRadius: '8px', overflow: 'hidden', gap: '4px', marginBottom: '1rem' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ duration: 1, delay: 0.2 }} style={{ background: P.safe, position: 'relative', display: 'flex', alignItems: 'center', paddingLeft: '1rem' }}>
                        <span style={{ color: P.cardBg, fontWeight: 600, fontSize: '1.2rem' }}>68%</span>
                    </motion.div>
                    <motion.div initial={{ width: 0 }} animate={{ width: '22%' }} transition={{ duration: 1, delay: 0.5 }} style={{ background: P.mild, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: P.cardBg, fontWeight: 600, fontSize: '1.2rem' }}>22%</span>
                    </motion.div>
                    <motion.div initial={{ width: 0 }} animate={{ width: '10%' }} transition={{ duration: 1, delay: 0.8 }} style={{ background: P.critical, position: 'relative', display: 'flex', alignItems: 'center', paddingRight: '1rem', justifyContent: 'flex-end' }}>
                        <span style={{ color: P.cardBg, fontWeight: 600, fontSize: '1.2rem' }}>10%</span>
                    </motion.div>
                </div>

                <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: P.textMuted }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: 12, height: 12, borderRadius: '50%', background: P.safe }} /> Safe (850)</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: 12, height: 12, borderRadius: '50%', background: P.mild }} /> Mild (275)</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: 12, height: 12, borderRadius: '50%', background: P.critical }} /> Critical (125)</div>
                </div>
            </PastelCard>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                <PastelCard>
                    <CardHeader icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>} title="Help-Seeking Funnel" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                        {[
                            { l: 'Total Enrolled', v: '1250', w: '100%', c: '#edf5ee' },
                            { l: 'Sought Help', v: '180', w: '65%', c: '#cae3ce' },
                            { l: 'Attended Sessions', v: '120', w: '45%', c: P.safe },
                        ].map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '130px', color: P.textMuted, fontSize: '0.9rem' }}>{f.l}</div>
                                <div style={{ flex: 1, height: '32px', position: 'relative' }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: f.w }} transition={{ duration: 1, delay: i * 0.2 }} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, background: f.c, borderRadius: '4px' }} />
                                </div>
                                <div style={{ width: '40px', textAlign: 'right', fontWeight: 600, color: P.textMain }}>{f.v}</div>
                            </div>
                        ))}
                    </div>
                </PastelCard>

                <PastelCard>
                    <CardHeader icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>} title="Department Summary" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
                        {[
                            { l: 'Student Engagement', v: '14.4%', p: 14.4 },
                            { l: 'Session Completion', v: '78.5%', p: 78.5 },
                            { l: 'Improvement Rate', v: '83.3%', p: 83.3 },
                            { l: 'Critical Index', v: '2.1%', p: 2.1 },
                        ].map((s, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                                    <span style={{ color: P.textMuted }}>{s.l}</span>
                                    <span style={{ fontWeight: 600, color: P.textMain }}>{s.v}</span>
                                </div>
                                <div style={{ height: '6px', background: P.bg, borderRadius: '3px', overflow: 'hidden' }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: \\\`\\\${s.p}%\\\` }} transition={{ duration: 1, delay: i * 0.2 }} style={{ height: '100%', background: i === 3 ? P.critical : P.safe }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </PastelCard>
            </div>
        </motion.div>
    );
};

const StudentAnalytics: React.FC<{ dept: Department }> = ({ dept }) => {
    // 1. Sessions Attended vs. Improvement
    const scatterData = [
        { sessions: 3, improvement: 1.5, size: 60, status: 'Critical', label: anonStudent(0) },
        { sessions: 4, improvement: 3, size: 100, status: 'Mild', label: anonStudent(1) },
        { sessions: 4.5, improvement: 2.5, size: 120, status: 'Mild', label: anonStudent(2) },
        { sessions: 5, improvement: 4, size: 220, status: 'Critical', label: anonStudent(3) },
        { sessions: 6, improvement: 3.5, size: 140, status: 'Mild', label: anonStudent(4) },
        { sessions: 8, improvement: 4.8, size: 160, status: 'Safe', label: anonStudent(5) },
        { sessions: 10, improvement: 6.5, size: 240, status: 'Safe', label: anonStudent(6) },
    ];

    const timelineData = [
        { time: '-20', studentA: 3, studentB: 5 },
        { time: '-18', studentA: 5, studentB: 4.8 },
        { time: '-15', studentA: 5.8, studentB: 4.5 },
        { time: '-12', studentA: 5.2, studentB: 4.1 },
        { time: '-8', studentA: 4.5, studentB: 4.5 },
        { time: '-6', studentA: 3.5, studentB: 5.2 },
        { time: '-4', studentA: 4.8, studentB: 5.5 },
        { time: '-3', studentA: 5.2, studentB: 5.8 },
        { time: '-2', studentA: 6.2, studentB: 6.1 },
        { time: '0', studentA: 6.5, studentB: 6.5 },
    ];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', border: \\\`1px solid \\\${P.cardBorder}\\\`, boxShadow: P.cardShadow }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>{data.label || 'Timeline Check'}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} style={{ margin: 0, color: entry.color, fontSize: '0.85rem' }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div 
            initial="hidden" animate="visible" exit="hidden"
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}
        >
            <PastelCard>
                <CardHeader icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><circle cx="9" cy="14" r="2"></circle><circle cx="15" cy="8" r="3"></circle><circle cx="19" cy="16" r="1.5"></circle></svg>} title="Sessions Attended vs. Improvement" />
                <div style={{ height: 250, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={P.cardBorder} />
                            <XAxis type="number" dataKey="sessions" name="Sessions" tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis type="number" dataKey="improvement" name="Improvement" tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                            <ZAxis type="number" dataKey="size" range={[60, 400]} />
                            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                            <Scatter name="Students" data={scatterData}>
                                {
                                    scatterData.map((entry, index) => (
                                        <Cell key={\\\`cell-\\\${index}\\\`} fill={entry.status === 'Safe' ? P.safe : entry.status === 'Mild' ? P.mild : P.critical} />
                                    ))
                                }
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </PastelCard>

            <PastelCard>
                <CardHeader icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>} title="Wellness Score Over Time" />
                <div style={{ height: 250, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timelineData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={P.cardBorder} />
                            <XAxis dataKey="time" tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} domain={[-2, 10]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" name={anonStudent(0)} dataKey="studentA" stroke={P.critical} strokeWidth={3} dot={{ r: 4, fill: P.critical, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" name={anonStudent(1)} dataKey="studentB" stroke={P.safe} strokeWidth={3} dot={{ r: 4, fill: P.safe, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </PastelCard>
        </motion.div>
    );
};

const TherapistPerformance: React.FC<{ dept: Department }> = ({ dept }) => {
    const loadData = [
        { load: 12, outcome: 22, size: 140, label: anonTherapist(0), status: 'Critical' },
        { load: 18, outcome: 62, size: 160, label: anonTherapist(1), status: 'Safe' },
        { load: 23, outcome: 75, size: 250, label: anonTherapist(2), status: 'Mild' },
    ];

    const timelineData = [
        { time: '-20', therA: 2.5, therB: 5 },
        { time: '-18', therA: 5.5, therB: 4.8 },
        { time: '-15', therA: 5, therB: 4.5 },
        { time: '-12', therA: 4.3, therB: 4.1 },
        { time: '-8', therA: 3, therB: 4.5 },
        { time: '-6', therA: 4, therB: 5.2 },
        { time: '-4', therA: 5, therB: 5.5 },
        { time: '-3', therA: 6, therB: 5.8 },
        { time: '-2', therA: 6.2, therB: 6.1 },
        { time: '0', therA: 7, therB: 6.5 },
    ];

    const completionData = [
        { name: 'Completed', value: 78, color: P.safe },
        { name: 'Missed', value: 22, color: P.mild },
    ];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', border: \\\`1px solid \\\${P.cardBorder}\\\`, boxShadow: P.cardShadow }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>{data.label || data.name || 'Statistic'}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} style={{ margin: 0, color: entry.color || entry.payload.color, fontSize: '0.85rem' }}>
                            {entry.name}: {entry.value}%
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div 
            initial="hidden" animate="visible" exit="hidden"
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}
        >
            <PastelCard>
                <CardHeader icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 12l-4-4-4 4"></path><path d="M12 16V8"></path></svg>} title="Therapist Load vs. Outcomes" />
                <div style={{ height: 250, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={P.cardBorder} />
                            <XAxis type="number" dataKey="load" name="Student Load" tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis type="number" dataKey="outcome" name="Outcome %" tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                            <ZAxis type="number" dataKey="size" range={[60, 400]} />
                            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                            <Scatter name="Therapists" data={loadData}>
                                {
                                    loadData.map((entry, index) => (
                                        <Cell key={\\\`cell-\\\${index}\\\`} fill={entry.status === 'Safe' ? P.safe : entry.status === 'Mild' ? P.mild : P.critical} />
                                    ))
                                }
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </PastelCard>

            <PastelCard>
                <CardHeader icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>} title="Wellness Score Over Time" />
                <div style={{ height: 250, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timelineData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={P.cardBorder} />
                            <XAxis dataKey="time" tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} domain={[-2, 10]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" name={anonTherapist(0)} dataKey="therA" stroke={P.critical} strokeWidth={3} dot={{ r: 4, fill: P.critical, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" name={anonTherapist(1)} dataKey="therB" stroke={P.safe} strokeWidth={3} dot={{ r: 4, fill: P.safe, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </PastelCard>

            <PastelCard style={{ display: 'flex', flexDirection: 'column' }}>
                <CardHeader icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>} title="Session Completion Rate" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
                    <div style={{ position: 'relative', width: '140px', height: '140px', flexShrink: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={completionData} 
                                    cx="50%" cy="50%" 
                                    innerRadius={50} outerRadius={60} 
                                    startAngle={90} endAngle={-270}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {completionData.map((entry, index) => (
                                        <Cell key={\\\`cell-\\\${index}\\\`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ fontSize: '2rem', fontWeight: 700, color: P.textMain }}>78%</motion.div>
                            <div style={{ fontSize: '0.7rem', color: P.textMuted, marginTop: '-4px' }}>225 Sessions</div>
                        </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem', color: P.textMain, fontWeight: 500 }}>
                                <span>Completed</span><span>Missed</span>
                            </div>
                            <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', gap: '2px' }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: '78%' }} transition={{ duration: 1 }} style={{ background: P.safe }} />
                                <motion.div initial={{ width: 0 }} animate={{ width: '22%' }} transition={{ duration: 1 }} style={{ background: P.mild }} />
                            </div>
                        </div>
                    </div>
                </div>
            </PastelCard>
        </motion.div>
    );
};

const TrendAnalysis: React.FC<{ dept: Department }> = ({ dept }) => {
    const barData = [
        { sem: '1st', Safe: 20, Mild: 30, Critical: 50 },
        { sem: '2nd', Safe: 25, Mild: 35, Critical: 40 },
        { sem: '3rd', Safe: 30, Mild: 40, Critical: 30 },
        { sem: '4th', Safe: 35, Mild: 45, Critical: 20 },
        { sem: '5th', Safe: 40, Mild: 50, Critical: 10 },
        { sem: '6th', Safe: 50, Mild: 40, Critical: 10 },
    ];

    const areaData = [
        { px: '-28', studentA: 700, studentB: null },
        { px: '-20', studentA: 600, studentB: 500 },
        { px: '-12', studentA: 300, studentB: 800 },
        { px: '-4', studentA: 250, studentB: 1000 },
        { px: '0', studentA: 250, studentB: 1200 },
        { px: '5', studentA: 250, studentB: 1400 },
    ];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', border: \\\`1px solid \\\${P.cardBorder}\\\`, boxShadow: P.cardShadow }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} style={{ margin: 0, color: entry.color || entry.fill, fontSize: '0.85rem' }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div 
            initial="hidden" animate="visible" exit="hidden"
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}
        >
            <PastelCard>
                <CardHeader icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>} title="Year-wise Wellness Distribution" />
                <div style={{ height: 250, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={P.cardBorder} />
                            <XAxis dataKey="sem" tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                            <Bar dataKey="Critical" stackId="a" fill={P.critical} />
                            <Bar dataKey="Mild" stackId="a" fill={P.mild} />
                            <Bar dataKey="Safe" stackId="a" fill={P.safe} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </PastelCard>

            <PastelCard>
                <CardHeader icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>} title="Help-Seeking Funnel" />
                <div style={{ height: 250, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={areaData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={P.cardBorder} />
                            <XAxis dataKey="px" tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: P.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" name={anonStudent(0)} dataKey="studentA" stroke={P.critical} fill={P.critical} fillOpacity={0.2} strokeWidth={3} />
                            <Area type="monotone" name={anonStudent(1)} dataKey="studentB" stroke={P.safe} fill={P.safe} fillOpacity={0.2} strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </PastelCard>
        </motion.div>
    );
};

export default function DepartmentDetailView({ department, onBack }: { department: Department; onBack: () => void }) {
    const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'therapists' | 'trends'>('therapists');

    const tabs = [
        { id: 'overview', label: 'Department Overview', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
        { id: 'students', label: 'Student Analytics', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
        { id: 'therapists', label: 'Therapist Performance', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg> },
        { id: 'trends', label: 'Trend Analysis', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg> },
    ] as const;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            style={{ backgroundColor: P.bg, minHeight: '100%', borderRadius: '32px', padding: '2rem 3rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
            <div style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative' }}>
                <motion.button 
                    whileHover={{ x: -5, opacity: 1 }}
                    onClick={onBack} aria-label="Back" style={{
                    position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                    background: 'transparent', border: 'none', cursor: 'pointer', color: P.textMuted,
                    display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 500
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Back
                </motion.button>
                <h1 style={{ fontSize: '2rem', fontWeight: 600, color: P.textMain, margin: 0 }}>
                    {activeTab === 'overview' && 'Department Overview'}
                    {activeTab === 'students' && 'Student Analytics'}
                    {activeTab === 'therapists' && 'Therapist Performance'}
                    {activeTab === 'trends' && 'Trend Analysis'}
                </h1>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', background: P.tabBg, padding: '0.35rem', borderRadius: '999px', gap: '0.25rem' }}>
                    {tabs.map(t => {
                        const isActive = activeTab === t.id;
                        return (
                            <motion.button 
                                key={t.id} 
                                onClick={() => setActiveTab(t.id)} 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.6rem 1.25rem', borderRadius: '999px',
                                    border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                                    background: isActive ? P.tabActiveBg : 'transparent',
                                    color: isActive ? P.tabActiveText : P.tabInactiveText,
                                    transition: 'background 0.2s, color 0.2s',
                                    boxShadow: isActive ? '0 4px 12px rgba(124, 162, 131, 0.3)' : 'none'
                                }}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', opacity: isActive ? 1 : 0.7 }}>{t.icon}</span>
                                {t.label}
                            </motion.button>
                        )
                    })}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'overview' && <DepartmentOverview dept={department} />}
                    {activeTab === 'students' && <StudentAnalytics dept={department} />}
                    {activeTab === 'therapists' && <TherapistPerformance dept={department} />}
                    {activeTab === 'trends' && <TrendAnalysis dept={department} />}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}`;
fs.writeFileSync('components/institution/DepartmentDetailView.tsx', content);
console.log('done!');
