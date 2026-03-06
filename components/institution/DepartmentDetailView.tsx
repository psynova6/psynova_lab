import React, { useState } from 'react';
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
export const anonStudent = (i: number) => `Student ${['A', 'B', 'C', 'D', 'E', 'F', 'G'][i % 7]}`;
export const anonTherapist = (i: number) => `Therapist ${i + 1}`;

// Base Card Primitive
export const PastelCard: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
    <div style={{
        background: P.cardBg,
        borderRadius: '20px',
        padding: '1.25rem',
        boxShadow: P.cardShadow,
        border: `1px solid ${P.cardBorder}`,
        ...style
    }}>
        {children}
    </div>
);

export const CardHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
        <div style={{ color: P.textMuted }}>{icon}</div>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: P.textMain }}>{title}</h3>
    </div>
);

// Tab Content Placeholders (To be implemented)
const DepartmentOverview: React.FC<{ dept: Department }> = ({ dept }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Top: Large Wellness Distribution Bar */}
            <PastelCard>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <CardHeader icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>} title="Student Wellness Zones" />
                    <div style={{ background: P.bg, padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', color: P.textMuted, fontWeight: 500 }}>
                        1250 Total Students
                    </div>
                </div>

                {/* The thick continuous bar */}
                <div style={{ height: '40px', display: 'flex', borderRadius: '8px', overflow: 'hidden', gap: '4px', marginBottom: '1rem' }}>
                    <div style={{ flex: 68, background: P.safe, position: 'relative', display: 'flex', alignItems: 'center', paddingLeft: '1rem' }}>
                        <span style={{ color: P.cardBg, fontWeight: 600, fontSize: '1.2rem' }}>68%</span>
                    </div>
                    <div style={{ flex: 22, background: P.mild, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: P.cardBg, fontWeight: 600, fontSize: '1.2rem' }}>22%</span>
                    </div>
                    <div style={{ flex: 10, background: P.critical, position: 'relative', display: 'flex', alignItems: 'center', paddingRight: '1rem', justifyContent: 'flex-end' }}>
                        <span style={{ color: P.cardBg, fontWeight: 600, fontSize: '1.2rem' }}>10%</span>
                    </div>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: P.textMuted }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: 12, height: 12, borderRadius: '50%', background: P.safe }} /> Safe (850)</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: 12, height: 12, borderRadius: '50%', background: P.mild }} /> Mild (275)</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: 12, height: 12, borderRadius: '50%', background: P.critical }} /> Critical (125)</div>
                </div>
            </PastelCard>

            {/* Bottom 50/50 Grid */}
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
                                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: f.w, background: f.c, borderRadius: '4px' }} />
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
                                    <div style={{ height: '100%', width: `${s.p}%`, background: i === 3 ? P.critical : P.safe }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </PastelCard>

            </div>

        </div>
    );
};
const StudentAnalytics: React.FC<{ dept: Department }> = ({ dept }) => {
    const PAD = { l: 40, r: 20, t: 20, b: 40 };

    // 1. Sessions Attended vs. Improvement
    const W1 = 500, H1 = 250;
    const bubbleData = [
        { x: 3, y: 1.5, r: 6, c: P.critical },
        { x: 4, y: 3, r: 10, c: P.mild },
        { x: 4.5, y: 2.5, r: 12, c: P.mild },
        { x: 5, y: 4, r: 22, c: P.critical },
        { x: 5.5, y: 5, r: 10, c: '#e79d90' }, // lighter red/pink
        { x: 6, y: 3.5, r: 14, c: P.mild },
        { x: 7, y: 5, r: 8, c: '#86c2c6' }, // light blue
        { x: 8, y: 4.8, r: 16, c: '#a4d47c' }, // bright green
        { x: 9, y: 6.2, r: 15, c: '#a4d47c' },
        { x: 10, y: 6.5, r: 24, c: P.safe },
    ];
    const px1 = (v: number) => PAD.l + ((v - 2) / 8) * (W1 - PAD.l - PAD.r);
    const py1 = (v: number) => PAD.t + (1 - v / 8) * (H1 - PAD.t - PAD.b);

    // 3. Wellness Score Over Time (Students)
    const W3 = 450, H3 = 200;
    const s1 = [3, 5, 5.8, 5.2, 4.5, 3.5, 4.8, 5.2, 6.2, 6.5]; // Student 1 (Red line -> Green later)
    const px3 = (i: number) => PAD.l + (i / 9) * (W3 - PAD.l - PAD.r);
    const py3 = (v: number) => PAD.t + (1 - (v - 2) / 6) * (H3 - PAD.t - PAD.b);

    // Path data for the smooth line
    const linePath = `M ${px3(0)} ${py3(s1[0])} ` + s1.slice(1).map((v, i) => `L ${px3(i + 1)} ${py3(v)}`).join(' ');
    // Area under the first half
    const areaPath = `M ${px3(0)} ${py3(s1[0])} ` + s1.slice(1, 4).map((v, i) => `L ${px3(i + 1)} ${py3(v)}`).join(' ') + ` L ${px3(3)} ${py3(2)} L ${px3(0)} ${py3(2)} Z`;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>

            {/* 1. Sessions vs. Improvement */}
            <PastelCard>
                <CardHeader icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><circle cx="9" cy="14" r="2"></circle><circle cx="15" cy="8" r="3"></circle><circle cx="19" cy="16" r="1.5"></circle></svg>} title="Sessions Attended vs. Improvement" />
                <svg viewBox={`0 0 ${W1} ${H1}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                    {[0, 2, 4, 6, 8].map(vy => (
                        <g key={vy}>
                            <line x1={PAD.l} x2={W1 - PAD.r} y1={py1(vy)} y2={py1(vy)} stroke={P.cardBorder} strokeWidth={1} />
                            <text x={PAD.l - 8} y={py1(vy) + 4} textAnchor="end" fontSize="10" fill={P.textMuted}>{vy}</text>
                        </g>
                    ))}
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(vx => (
                        <text key={vx} x={px1(vx)} y={H1 - 15} textAnchor="middle" fontSize="10" fill={P.textMuted}>{vx}</text>
                    ))}
                    <text x={W1 / 2} y={H1} textAnchor="middle" fontSize="11" fill={P.textMuted}>Sessions Attended</text>

                    {/* Curved trend arrow */}
                    <path d={`M ${px1(2)} ${py1(0.5)} Q ${px1(6)} ${py1(1.5)} ${px1(10)} ${py1(4.5)}`} fill="none" stroke={P.safe} strokeWidth={2} strokeOpacity={0.6} strokeLinecap="round" />
                    <polygon points={`${px1(10)},${py1(4.5)} ${px1(10) - 6},${py1(4.5) - 4} ${px1(10) - 4},${py1(4.5) + 2}`} fill={P.safe} fillOpacity={0.6} />

                    {/* Bubbles */}
                    {bubbleData.map((d, i) => (
                        <g key={i}>
                            <circle cx={px1(d.x)} cy={py1(d.y)} r={d.r} fill={d.c} fillOpacity={0.85} stroke="#fff" strokeWidth={1} />
                            <circle cx={px1(d.x) - d.r * 0.3} cy={py1(d.y) - d.r * 0.3} r={d.r * 0.2} fill="#ffffff" fillOpacity={0.4} />
                        </g>
                    ))}
                </svg>
            </PastelCard>

            {/* 2. Health Risk History (Weekly blocks) */}
            <PastelCard>
                <CardHeader icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 14h6"></path><path d="M9 10h6"></path></svg>} title="Health Risk History" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    {/* Row 1: Safe baseline */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', color: P.textMain }}>Safe</div>
                        <div style={{ flex: 1, display: 'flex', gap: '4px', height: '24px' }}>
                            {[1, 2, 3].map(i => <div key={i} style={{ flex: 1, background: '#a8d2b0' }} />)}
                            {[1, 2].map(i => <div key={i + 3} style={{ flex: 0.8, background: '#f8d9a1' }} />)}
                            <div style={{ flex: 0.8, background: '#ee9a8b' }} />
                        </div>
                    </div>
                    {/* Row 2: Mild baseline */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', color: P.textMain }}>Mild</div>
                        <div style={{ flex: 1, display: 'flex', gap: '4px', height: '24px' }}>
                            {[1, 2].map(i => <div key={i} style={{ flex: 1, background: '#c1dcc7' }} />)}
                            {[1, 2].map(i => <div key={i + 2} style={{ flex: 1, background: P.mild }} />)}
                            <div style={{ flex: 1, background: P.critical }} />
                            <div style={{ flex: 0.5, background: '#ebd4d4' }} />
                        </div>
                    </div>

                    <div style={{ height: '12px' }} /> {/* Gap */}

                    {/* Row 3: Student 1 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', color: P.textMain }}>{anonStudent(0)}</div>
                        <div style={{ flex: 1, display: 'flex', gap: '4px', height: '24px' }}>
                            <div style={{ flex: 2, background: P.safe }} />
                            <div style={{ flex: 1, background: '#cce1a8' }} />
                            <div style={{ flex: 3, background: 'transparent' }} />
                        </div>
                    </div>
                    {/* Row 4: Student 2 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', color: P.textMain }}>{anonStudent(1)}</div>
                        <div style={{ flex: 1, display: 'flex', gap: '4px', height: '24px' }}>
                            <div style={{ flex: 3, background: '#a8d2b0' }} />
                            <div style={{ flex: 0.2, background: P.critical }} />
                            <div style={{ flex: 1.5, background: '#ee9a8b' }} />
                            <div style={{ flex: 0.5, background: P.mild }} />
                            <div style={{ flex: 1, background: '#f5ead2' }} />
                        </div>
                    </div>
                </div>
            </PastelCard>

            {/* 3. Wellness Score Over Time */}
            <PastelCard>
                <CardHeader icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>} title="Wellness Score Over Time" />
                <svg viewBox={`0 0 ${W3} ${H3}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                    {[2, 4, 6, 8].map(vy => (
                        <g key={vy}>
                            <line x1={PAD.l} x2={W3 - PAD.r} y1={py3(vy)} y2={py3(vy)} stroke={P.cardBorder} strokeWidth={1} />
                            <text x={PAD.l - 8} y={py3(vy) + 4} textAnchor="end" fontSize="10" fill={P.textMuted}>{vy}</text>
                        </g>
                    ))}
                    <line x1={PAD.l} x2={W3 - PAD.r} y1={py3(5)} y2={py3(5)} stroke={P.textMuted} opacity={0.3} strokeWidth={1} strokeDasharray="4,4" />
                    {[-20, -18, -15, -12, -8, -6, -4, -3, -2, 0].map((vx, i) => (
                        <text key={i} x={px3(i)} y={H3 - 10} textAnchor="middle" fontSize="10" fill={P.textMuted}>{vx}</text>
                    ))}

                    {/* Area under the high-risk part */}
                    <path d={areaPath} fill="#fbebe9" />

                    {/* Trend Line */}
                    <path d={linePath} fill="none" stroke={P.safe} strokeWidth={2.5} strokeLinejoin="round" />

                    {/* Color segments to match the image: it starts red, goes to green. */}
                    <path d={`M ${px3(0)} ${py3(s1[0])} L ${px3(1)} ${py3(s1[1])} L ${px3(2)} ${py3(s1[2])} L ${px3(3)} ${py3(s1[3])}`} fill="none" stroke={P.critical} strokeWidth={2.5} strokeLinejoin="round" />

                    {/* Dots */}
                    {s1.map((v, i) => <circle key={i} cx={px3(i)} cy={py3(v)} r={4} fill={i < 4 ? P.critical : P.safe} stroke={P.cardBg} strokeWidth={1.5} />)}

                    <text x={px3(1)} y={py3(s1[1]) - 15} fontSize="11" fill={P.critical} fontWeight="500">{anonStudent(0)}</text>

                    {/* Legend at bottom */}
                    <g transform={`translate(${PAD.l}, ${H3 + 20})`}>
                        <line x1="0" y1="0" x2="16" y2="0" stroke={P.critical} strokeWidth="3" />
                        <text x="24" y="4" fontSize="11" fill={P.textMain}>{anonStudent(0)}</text>
                        <circle cx="4" cy="18" r="2" fill={P.textMuted} opacity="0.5" />
                        <circle cx="10" cy="18" r="2" fill={P.textMuted} opacity="0.5" />
                        <text x="24" y="22" fontSize="10" fill={P.textMuted}>14% Students - Safe Zone</text>
                    </g>
                    <g transform={`translate(${PAD.l + 160}, ${H3 + 20})`}>
                        <line x1="0" y1="0" x2="16" y2="0" stroke={P.safe} strokeWidth="3" />
                        <text x="24" y="4" fontSize="11" fill={P.textMain}>{anonStudent(1)}</text>
                        <circle cx="4" cy="18" r="2" fill={P.textMuted} opacity="0.5" />
                        <circle cx="10" cy="18" r="2" fill={P.textMuted} opacity="0.5" />
                        <circle cx="16" cy="18" r="2" fill={P.textMuted} opacity="0.5" />
                        <text x="28" y="22" fontSize="10" fill={P.textMuted}>67% Students - Critical</text>
                    </g>
                </svg>
            </PastelCard>

            {/* 4. Health Risk History (Fading timeline) */}
            <PastelCard>
                <CardHeader icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>} title="Health Risk History" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    {/* Headers */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0 }}>
                        <div style={{ width: '40px' }}>&nbsp;</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', color: P.textMain }}>Safe</div>
                        <div style={{ flex: 1, display: 'flex', height: '28px' }}>
                            <div style={{ flex: 1.5, background: '#a8d2b0' }} />
                            <div style={{ flex: 1, background: '#cae3ce' }} />
                            <div style={{ flex: 0.8, background: '#edf5ee' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', color: P.textMain }}>Mild</div>
                        <div style={{ flex: 1, display: 'flex', height: '28px' }}>
                            <div style={{ flex: 1, background: '#dcecdb' }} />
                            <div style={{ flex: 1.5, background: '#f8d9a1' }} />
                            <div style={{ flex: 0.8, background: P.critical }} />
                            <div style={{ flex: 0.5, background: '#f4ede1' }} />
                        </div>
                    </div>

                    <div style={{ height: '8px' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', color: P.textMain }}>{anonStudent(1)}</div>
                        <div style={{ flex: 1, display: 'flex', height: '28px' }}>
                            <div style={{ flex: 1, background: P.safe }} />
                            <div style={{ flex: 1, background: '#cce1a8' }} />
                            <div style={{ flex: 2, background: '#f0f5e7' }} />
                        </div>
                    </div>

                    {/* X axis labels for this timeline */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.1rem' }}>
                        <div style={{ width: '40px' }} />
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${P.cardBorder}`, paddingTop: '0.5rem', fontSize: '0.8rem', color: P.textMuted }}>
                            <span>-20</span><span>-12</span><span>-10</span><span>-8</span><span>-6</span><span>-4</span><span>-2</span><span>0</span>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '0.8rem', color: P.textMuted, opacity: 0.8 }}>Time Stepping</div>

                </div>
            </PastelCard>

        </div>
    );
};
const TherapistPerformance: React.FC<{ dept: Department }> = ({ dept }) => {
    const PAD = { l: 40, r: 20, t: 20, b: 40 };

    // 1. Therapist Load vs. Outcomes (Scatter with curved arrow)
    const W1 = 500, H1 = 250;
    const loadData = [
        { x: 12, y: 22, r: 14, c: P.critical, label: anonTherapist(0) }, // "Rahul" equivalent
        { x: 18, y: 62, r: 16, c: P.safe, label: anonTherapist(1) }, // Rohan Verma
        { x: 23, y: 75, r: 25, c: P.mild, label: anonTherapist(2) }, // Dr. Ananya
    ];
    const px1 = (v: number) => PAD.l + ((v - 10) / 18) * (W1 - PAD.l - PAD.r);
    const py1 = (v: number) => PAD.t + (1 - v / 100) * (H1 - PAD.t - PAD.b);

    // 2. Therapist Availability Timeline
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const times = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'];
    const heatmap = times.map((_, i) => days.map((_, j) => {
        // Mimicking the pattern from 1.jpeg / 2.jpeg (blocks of green, orange, red)
        if (j > 4 && i < 4) return P.critical; // weekend mornings busy
        if (j < 2 && i < 2) return P.safe; // mon/tue early open
        if (i === 5 && j === 1) return P.critical; // Tue 1PM full
        if ((i + j) % 3 === 0) return P.mild;
        return P.safe;
    }));

    // 3. Wellness Score Over Time
    const W3 = 400, H3 = 200;
    const tVals = [-20, -18, -15, -12, -8, -6, -4, -3, -2, 0];
    const s1 = [2.5, 5.5, 5, 4.3, 3, 4, 5, 6, 6.2, 7]; // Safe trend
    const s2 = [5, 4.8, 4.5, 4.1, 4.5, 5.2, 5.5, 5.8, 6.1, 6.5]; // Mild trend
    const px3 = (i: number) => PAD.l + (i / 9) * (W3 - PAD.l - PAD.r);
    const py3 = (v: number) => PAD.t + (1 - (v - 2) / 6) * (H3 - PAD.t - PAD.b);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>

            {/* 1. Therapist Load vs. Outcomes */}
            <PastelCard>
                <CardHeader icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 12l-4-4-4 4"></path><path d="M12 16V8"></path></svg>} title="Therapist Load vs. Outcomes" />
                <svg viewBox={`0 0 ${W1} ${H1}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                    {/* Grid lines */}
                    {[0, 20, 40, 60, 80, 100].map(vy => (
                        <g key={vy}>
                            <line x1={PAD.l} x2={W1 - PAD.r} y1={py1(vy)} y2={py1(vy)} stroke={P.cardBorder} strokeWidth={1} />
                            <text x={PAD.l - 8} y={py1(vy) + 4} textAnchor="end" fontSize="10" fill={P.textMuted}>{vy}%</text>
                        </g>
                    ))}
                    {/* X axis labels */}
                    {[10, 12, 14, 16, 18, 20, 22, 24, 26, 28].map(vx => (
                        <text key={vx} x={px1(vx)} y={H1 - 15} textAnchor="middle" fontSize="10" fill={P.textMuted}>{vx}</text>
                    ))}
                    <text x={W1 / 2} y={H1} textAnchor="middle" fontSize="11" fill={P.textMuted}>Current Student Load</text>

                    {/* Curved trend arrow */}
                    <path d={`M ${px1(10)} ${py1(10)} Q ${px1(20)} ${py1(25)} ${px1(28)} ${py1(60)}`} fill="none" stroke={P.safe} strokeWidth={2} strokeOpacity={0.5} />
                    <polygon points={`${px1(28)},${py1(60)} ${px1(28) - 6},${py1(60) - 4} ${px1(28) - 4},${py1(60) + 2}`} fill={P.safe} fillOpacity={0.5} />

                    {/* Bubbles */}
                    {loadData.map((d, i) => (
                        <g key={i}>
                            <circle cx={px1(d.x)} cy={py1(d.y)} r={d.r} fill={d.c} fillOpacity={0.8} />
                            {/* Highlight dot for 3D effect */}
                            <circle cx={px1(d.x) - d.r * 0.3} cy={py1(d.y) - d.r * 0.3} r={d.r * 0.2} fill="#ffffff" fillOpacity={0.4} />
                            <text x={px1(d.x)} y={py1(d.y) - d.r - 5} textAnchor="middle" fontSize="10" fill={P.textMain} fontWeight={500}>{d.label}</text>
                        </g>
                    ))}
                </svg>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem', fontSize: '0.85rem', color: P.textMuted }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: P.safe }} /> Safe</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: P.mild }} /> Mild</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: P.critical }} /> Critical</div>
                </div>
                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: P.textMuted, opacity: 0.7, marginTop: '0.2rem' }}>Bubble Size = Critical Cases Handled</div>
            </PastelCard>

            {/* 2. Therapist Availability Timeline */}
            <PastelCard>
                <CardHeader icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>} title="Therapist Availability Timeline" />
                <div style={{ marginBottom: '1rem', color: P.textMuted, fontSize: '0.9rem' }}>8 AM — 5 PM</div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ borderCollapse: 'separate', borderSpacing: '2px', width: '100%', fontSize: '0.85rem', color: P.textMuted }}>
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }} />
                                {days.map(d => <th key={d} style={{ fontWeight: 400, paddingBottom: '0.5rem' }}>{d}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {times.map((time, i) => (
                                <tr key={time}>
                                    <td style={{ textAlign: 'right', paddingRight: '0.5rem', whiteSpace: 'nowrap' }}>{time}</td>
                                    {heatmap[i].map((color, j) => (
                                        <td key={j} style={{ background: color, height: '20px', width: '40px', opacity: 0.85 }} />
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', fontSize: '0.85rem', color: P.textMuted }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: P.safe }} /> Open</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: P.mild }} /> Moderate</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: P.critical }} /> Full</div>
                </div>
            </PastelCard>

            {/* 3. Wellness Score Over Time */}
            <PastelCard>
                <CardHeader icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>} title="Wellness Score Over Time" />
                <svg viewBox={`0 0 ${W3} ${H3}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                    {/* Grid */}
                    {[2, 4, 6, 8].map(vy => (
                        <g key={vy}>
                            <line x1={PAD.l} x2={W3 - PAD.r} y1={py3(vy)} y2={py3(vy)} stroke={P.cardBorder} strokeWidth={1} />
                            <text x={PAD.l - 8} y={py3(vy) + 4} textAnchor="end" fontSize="10" fill={P.textMuted}>{vy}</text>
                        </g>
                    ))}
                    <line x1={PAD.l} x2={W3 - PAD.r} y1={py3(5)} y2={py3(5)} stroke={P.textMuted} opacity={0.3} strokeWidth={1} strokeDasharray="4,4" />
                    {/* X Labels */}
                    {[-20, -18, -15, -12, -8, -6, -4, -3, -2, 0].map((vx, i) => (
                        <text key={i} x={px3(i)} y={H3 - 10} textAnchor="middle" fontSize="10" fill={P.textMuted}>{vx}</text>
                    ))}

                    {/* Lines - curved via bezier approx */}
                    <path d={`M ${px3(0)} ${py3(s1[0])} ` + s1.slice(1).map((v, i) => `L ${px3(i + 1)} ${py3(v)}`).join(' ')} fill="none" stroke={P.critical} strokeWidth={2.5} strokeLinejoin="round" />
                    <path d={`M ${px3(0)} ${py3(s2[0])} ` + s2.slice(1).map((v, i) => `L ${px3(i + 1)} ${py3(v)}`).join(' ')} fill="none" stroke={P.safe} strokeWidth={2.5} strokeLinejoin="round" />

                    {/* Dots */}
                    {s1.map((v, i) => <circle key={`1-${i}`} cx={px3(i)} cy={py3(v)} r={4} fill={P.critical} stroke={P.cardBg} strokeWidth={1.5} />)}
                    {s2.map((v, i) => <circle key={`2-${i}`} cx={px3(i)} cy={py3(v)} r={4} fill={P.safe} stroke={P.cardBg} strokeWidth={1.5} />)}

                    <text x={px3(1)} y={py3(s1[1]) - 15} fontSize="11" fill={P.critical} fontWeight="500">{anonTherapist(0)}</text>
                    <text x={px3(8)} y={py3(s2[8]) + 20} fontSize="11" fill={P.safe} fontWeight="500">{anonTherapist(1)}</text>
                </svg>
            </PastelCard>

            {/* 4. Session Completion Rate */}
            <PastelCard style={{ display: 'flex', flexDirection: 'column' }}>
                <CardHeader icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>} title="Session Completion Rate" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
                    <div style={{ position: 'relative', width: '140px', height: '140px', flexShrink: 0 }}>
                        <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="50" cy="50" r="40" fill="none" stroke={P.cardBorder} strokeWidth="12" />
                            {/* 78% completion (green), rest is missed (orange) */}
                            <circle cx="50" cy="50" r="40" fill="none" stroke={P.safe} strokeWidth="12" strokeDasharray={`${0.78 * 251.2} 251.2`} />
                            <circle cx="50" cy="50" r="40" fill="none" stroke={P.mild} strokeWidth="12" strokeDasharray={`${0.22 * 251.2} 251.2`} strokeDashoffset={-(0.78 * 251.2)} />
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: P.textMain }}>78%</div>
                            <div style={{ fontSize: '0.7rem', color: P.textMuted, marginTop: '-4px' }}>225 Sessions</div>
                        </div>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem', color: P.textMain, fontWeight: 500 }}>
                                <span>Completed</span><span>Missed</span>
                            </div>
                            <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', gap: '2px' }}>
                                <div style={{ flex: 78, background: P.safe }} />
                                <div style={{ flex: 22, background: P.critical }} />
                            </div>
                        </div>

                        {/* Stacked legend mimicking the bottom of image 2 */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: P.textMuted, marginTop: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#d1d5db' }} /> 0%</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: P.mild }} /> 25%</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fbbf24' }} /> 50%</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: P.critical }} /> 100%</div>
                        </div>
                    </div>
                </div>
            </PastelCard>

        </div>
    );
};
const TrendAnalysis: React.FC<{ dept: Department }> = ({ dept }) => {
    const PAD = { l: 40, r: 20, t: 20, b: 40 };

    // 1. Semester Heatmap
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Dec'];
    const heatmapRows = [
        // 4 rows of randomish pastel colors going from green -> yellow -> red
        ['#edf5ee', '#cae3ce', '#a8d2b0', '#cae3ce', '#f0f5e7', '#cae3ce', '#a8d2b0', '#cce1a8'],
        ['#cae3ce', '#f5ead2', '#f8d9a1', '#f8d9a1', '#f8d9a1', '#f8d9a1', '#f5ead2', '#cae3ce'],
        ['#f5ead2', '#f8d9a1', '#ee9a8b', '#ee9a8b', '#ee9a8b', '#dc7665', '#f8d9a1', '#f5ead2'],
        ['#a8d2b0', '#cce1a8', '#f8d9a1', '#f5ead2', '#ee9a8b', '#ee9a8b', '#cae3ce', '#a8d2b0']
    ];

    // 2. Year-wise Wellness Distribution
    const W2 = 400, H2 = 200;
    const sems = ['1st', '2nd', '3rd', '4th', '5th', '6th'];
    const bars = [
        { s: 20, m: 30, c: 50 },  // 1st gets thicker over time
        { s: 25, m: 35, c: 40 },
        { s: 30, m: 40, c: 30 },
        { s: 35, m: 45, c: 20 },
        { s: 40, m: 50, c: 10 },
        { s: 50, m: 40, c: 10 },
    ];
    // Re-map bars so they visually mirror the image
    // The image shows Safe (green) at bottom, Mild (amber) middle, Critical (red) top.
    const px2 = (i: number) => PAD.l + (i + 0.5) * ((W2 - PAD.l - PAD.r) / 6);

    // 3. Help-Seeking Funnel (Curve)
    // X: -20 to 5. Y: 0 to 1800
    const W3 = 450, H3 = 200;
    // Curve points approximating the visual
    const c1 = [250, 700, 600, 300, 250]; // Rahul (-0 to -28)
    const c2 = [250, 500, 800, 1000, 1200, 1400]; // Priya (-28 to 5)
    const px3 = (i: number) => PAD.l + (i / 10) * (W3 - PAD.l - PAD.r);
    const py3 = (v: number) => PAD.t + (1 - v / 1800) * (H3 - PAD.t - PAD.b);

    const legend = [
        { c: '#a8d2b0', l: 'Safe' },
        { c: '#f8d9a1', l: 'Mild' },
        { c: '#ee9a8b', l: 'Critical' },
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>

            {/* 1. Semester Heatmap */}
            <PastelCard>
                <CardHeader icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>} title="Semester Heatmap" />
                <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                    <table style={{ borderCollapse: 'separate', borderSpacing: '4px', width: '100%', fontSize: '0.85rem' }}>
                        <thead>
                            <tr>
                                {months.map(m => <th key={m} style={{ color: P.textMuted, fontWeight: 500, paddingBottom: '0.5rem' }}>{m}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {heatmapRows.map((row, i) => (
                                <tr key={i}>
                                    {row.map((color, j) => (
                                        <td key={j} style={{ background: color, height: '36px', minWidth: '36px' }} />
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: P.textMuted }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#a8d2b0' }} /> Low</div>
                    <div style={{ flex: 1, margin: '0 1rem', display: 'flex' }}>
                        <div style={{ flex: 1, height: '8px', background: 'linear-gradient(to right, #a8d2b0, #f8d9a1, #ee9a8b)' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: P.critical }} /> High</div>
                </div>
            </PastelCard>

            {/* 2. Year-wise Wellness Distribution */}
            <PastelCard>
                <CardHeader icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>} title="Year-wise Wellness Distribution" />
                <svg viewBox={`0 0 ${W2} ${H2}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                    {[20, 40, 60, 80, 100].map(vy => (
                        <line key={vy} x1={PAD.l} x2={W2 - PAD.r} y1={H2 - PAD.b - (vy / 100) * (H2 - PAD.t - PAD.b)} y2={H2 - PAD.b - (vy / 100) * (H2 - PAD.t - PAD.b)} stroke={P.cardBorder} strokeWidth={1} />
                    ))}
                    {sems.map((s, i) => (
                        <text key={i} x={px2(i)} y={H2 - 15} textAnchor="middle" fontSize="10" fill={P.textMuted}>{s}</text>
                    ))}
                    {/* Stacked bars */}
                    {bars.map((b, i) => {
                        const hC = (b.c / 100) * (H2 - PAD.t - PAD.b);
                        const hM = (b.m / 100) * (H2 - PAD.t - PAD.b);
                        const hS = (b.s / 100) * (H2 - PAD.t - PAD.b);
                        const bw = 32;
                        const bx = px2(i) - bw / 2;
                        let yA = H2 - PAD.b;
                        return (
                            <g key={i}>
                                {/* Safe */}
                                <rect x={bx} y={yA - hS} width={bw} height={hS} fill={P.safe} />
                                {/* Mild */}
                                <rect x={bx} y={yA - hS - hM - 2} width={bw} height={hM} fill={P.mild} />
                                {/* Critical */}
                                <rect x={bx} y={yA - hS - hM - hC - 4} width={bw} height={hC} fill={P.critical} />
                            </g>
                        );
                    })}
                    <text x={PAD.l - 5} y={H2 - PAD.b - 10} textAnchor="end" fontSize="10" fill={P.textMuted}>Safe</text>
                    <text x={PAD.l - 5} y={H2 - PAD.b - 60} textAnchor="end" fontSize="10" fill={P.textMuted}>Mild</text>
                    <text x={PAD.l - 5} y={H2 - PAD.b - 110} textAnchor="end" fontSize="10" fill={P.textMuted}>Critical</text>
                    <text x={PAD.l - 5} y={PAD.t + 15} textAnchor="end" fontSize="10" fill={P.textMuted}>Safe</text>
                </svg>
            </PastelCard>

            {/* 3. Help-Seeking Funnel (Curve) */}
            <PastelCard>
                <CardHeader icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>} title="Help-Seeking Funnel" />
                <svg viewBox={`0 0 ${W3} ${H3}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                    {[0, 200, 600, 1800].map(vy => (
                        <g key={vy}>
                            <line x1={PAD.l} x2={W3 - PAD.r} y1={py3(vy)} y2={py3(vy)} stroke={P.cardBorder} strokeWidth={1} />
                            <text x={PAD.l - 8} y={py3(vy) + 4} textAnchor="end" fontSize="10" fill={P.textMuted}>{vy}</text>
                        </g>
                    ))}
                    <line x1={PAD.l} x2={W3 - PAD.r} y1={py3(0)} y2={py3(0)} stroke={P.textMuted} strokeWidth={1} strokeDasharray="4,4" opacity={0.3} />

                    {[0, -120, -210, -121, -28, 15, 10, -3, -4, -2, 5].map((vx, i) => (
                        <text key={i} x={px3(i)} y={H3 - 15} textAnchor="middle" fontSize="10" fill={P.textMuted}>{vx === 0 ? '0' : vx}</text>
                    ))}

                    <path d={`M ${px3(0)} ${py3(c1[0])} Q ${px3(1)} ${py3(c1[1] + 100)} ${px3(2)} ${py3(c1[2])} T ${px3(4)} ${py3(c1[4])}`} fill="none" stroke={P.critical} strokeWidth="3" strokeLinecap="round" />
                    <path d={`M ${px3(4)} ${py3(c2[0])} Q ${px3(6)} ${py3(c2[2])} ${px3(10)} ${py3(c2[5])}`} fill="none" stroke={P.safe} strokeWidth="3" strokeLinecap="round" />

                    {[0, 1, 2, 3, 4].map(i => <circle key={`c1-${i}`} cx={px3(i)} cy={py3(c1[i])} r={4} fill={P.critical} stroke={P.cardBg} strokeWidth={1.5} />)}
                    {[0, 1, 2, 3, 4, 5].map(i => <circle key={`c2-${i}`} cx={px3(i + 4)} cy={py3(c2[i])} r={4} fill={P.safe} stroke={P.cardBg} strokeWidth={1.5} />)}

                    <text x={px3(1)} y={py3(700) - 15} fontSize="11" fill={P.critical} fontWeight="500">{anonStudent(0)}</text>

                    {/* Legend */}
                    <g transform={`translate(${PAD.l}, ${H3 + 20})`}>
                        <line x1="0" y1="0" x2="16" y2="0" stroke={P.critical} strokeWidth="3" />
                        <text x="24" y="4" fontSize="11" fill={P.textMain}>{anonStudent(0)}</text>
                        <circle cx="4" cy="18" r="2" fill={P.textMuted} opacity="0.5" />
                        <text x="14" y="22" fontSize="10" fill={P.textMuted}>14% Students - Safe Zone</text>
                    </g>
                    <g transform={`translate(${W3 / 2}, ${H3 + 20})`}>
                        <line x1="0" y1="0" x2="16" y2="0" stroke={P.safe} strokeWidth="3" />
                        <text x="24" y="4" fontSize="11" fill={P.textMain}>{anonStudent(1)}</text>
                        <circle cx="4" cy="18" r="2" fill={P.textMuted} opacity="0.5" />
                        <text x="14" y="22" fontSize="10" fill={P.textMuted}>67% Students - Critical</text>
                    </g>
                </svg>
            </PastelCard>

            {/* 4. Response Rate & Outreach */}
            <PastelCard>
                <CardHeader icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>} title="Response Rate & Outreach" />
                <div style={{ display: 'flex', alignItems: 'center', height: '220px', padding: '1rem', gap: '2rem' }}>

                    {/* Funnel SVG */}
                    <svg viewBox="0 0 100 200" style={{ height: '100%', width: '120px', overflow: 'visible' }}>
                        {/* Total */}
                        <polygon points="0,0 100,0 80,50 20,50" fill="#e2ebd1" />
                        {/* Sought Help */}
                        <polygon points="20,55 80,55 65,110 35,110" fill="#a4d47c" />
                        {/* Attended Sessions */}
                        <polygon points="35,115 65,115 55,160 45,160" fill={P.mild} />
                        {/* Improved */}
                        <polygon points="45,165 55,165 50,190 50,190" fill="#71b576" />
                    </svg>

                    {/* Labels & Data */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingTop: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: P.textMain, width: '60px' }}>1250</div>
                            <div style={{ background: P.bg, padding: '0.5rem 1rem', borderRadius: '8px', flex: 1, color: P.textMuted, fontSize: '1.1rem' }}>Total Students</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: P.textMain, width: '60px' }}>180</div>
                            <div style={{ background: P.bg, padding: '0.5rem 1rem', borderRadius: '8px', flex: 1, color: P.textMuted, fontSize: '1.1rem' }}>Sought Help</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: P.textMain, width: '60px' }}>120</div>
                            <div style={{ background: P.bg, padding: '0.5rem 1rem', borderRadius: '8px', flex: 1, color: P.textMuted, fontSize: '1.1rem' }}>Attended Sessions</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: P.textMain, width: '60px' }}>100</div>
                            <div style={{ background: 'transparent', padding: '0.5rem 1rem', flex: 1, color: P.textMuted, fontSize: '1.1rem' }}>Improved</div>
                        </div>
                    </div>
                </div>
            </PastelCard>

        </div>
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
        <div style={{ backgroundColor: P.bg, minHeight: '100%', borderRadius: '32px', padding: '2rem 3rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

            {/* Header Area */}
            <div style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative' }}>
                <button onClick={onBack} aria-label="Back" style={{
                    position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                    background: 'transparent', border: 'none', cursor: 'pointer', color: P.textMuted,
                    display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 500
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Back
                </button>
                <h1 style={{ fontSize: '2rem', fontWeight: 600, color: P.textMain, margin: 0 }}>
                    {activeTab === 'overview' && 'Department Overview'}
                    {activeTab === 'students' && 'Student Analytics'}
                    {activeTab === 'therapists' && 'Therapist Performance'}
                    {activeTab === 'trends' && 'Trend Analysis'}
                </h1>
            </div>

            {/* Pill Navigation */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', background: P.tabBg, padding: '0.35rem', borderRadius: '999px', gap: '0.25rem' }}>
                    {tabs.map(t => {
                        const isActive = activeTab === t.id;
                        return (
                            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.6rem 1.25rem', borderRadius: '999px',
                                border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                                background: isActive ? P.tabActiveBg : 'transparent',
                                color: isActive ? P.tabActiveText : P.tabInactiveText,
                                transition: 'all 0.2s ease-in-out',
                                boxShadow: isActive ? '0 4px 12px rgba(124, 162, 131, 0.3)' : 'none'
                            }}>
                                <span style={{ display: 'flex', alignItems: 'center', opacity: isActive ? 1 : 0.7 }}>{t.icon}</span>
                                {t.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <div>
                {activeTab === 'overview' && <DepartmentOverview dept={department} />}
                {activeTab === 'students' && <StudentAnalytics dept={department} />}
                {activeTab === 'therapists' && <TherapistPerformance dept={department} />}
                {activeTab === 'trends' && <TrendAnalysis dept={department} />}
            </div>

        </div>
    );
}