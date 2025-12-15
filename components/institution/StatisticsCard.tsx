import React from 'react';
import { ChartBarIcon } from '../common/icons';
import type { DepartmentStats } from '../../types';

interface StatisticsCardProps {
    stats: DepartmentStats;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ stats }) => {
    const { totalStudents, safeZone, mildDangerZone, criticalZone, reachedOutToTherapist, improvedAfterSessions } = stats;

    const safePercent = (safeZone / totalStudents) * 100;
    const mildPercent = (mildDangerZone / totalStudents) * 100;
    const criticalPercent = (criticalZone / totalStudents) * 100;

    const BarSegment: React.FC<{ percent: number; color: string; label: string; value: number }> = ({ percent, color, label, value }) => (
        <div style={{ width: `${percent}%` }} className={`h-full ${color} flex items-center justify-center text-white font-bold text-sm transition-all duration-500`}>
            <div className="tooltip relative">
                <span className="hidden sm:inline-block">{Math.round(percent)}%</span>
                <span className="tooltip-text absolute z-10 w-40 p-2 -mt-12 -ml-20 text-xs leading-tight text-white transform bg-black rounded-lg shadow-lg opacity-0">
                    {value} students in {label}
                </span>
            </div>
        </div>
    );

    const StatItem: React.FC<{ value: number | string; label: string }> = ({ value, label }) => (
        <div className="text-center bg-brand-background/50 p-4 rounded-2xl">
            <p className="text-2xl md:text-3xl font-bold text-brand-dark-green">{value}</p>
            <p className="text-sm text-brand-dark-green/80">{label}</p>
        </div>
    );

    return (
        <div className="bg-white/60 rounded-[2rem] shadow-lg p-6">
            <style>{`
                .tooltip:hover .tooltip-text {
                    opacity: 1;
                }
            `}</style>
            <div className="flex items-center mb-4">
                <ChartBarIcon className="w-6 h-6 mr-3 text-brand-dark-green" />
                <h3 className="text-xl font-bold text-brand-dark-green">Overall Student Wellness</h3>
            </div>

            <div className="mb-6">
                <p className="text-sm font-semibold text-brand-dark-green/80 mb-2">Student Wellness Zones ({totalStudents} total)</p>
                <div className="w-full h-8 flex rounded-full overflow-hidden bg-gray-200">
                    <BarSegment percent={safePercent} color="bg-green-500" label="Safe Zone" value={safeZone} />
                    <BarSegment percent={mildPercent} color="bg-yellow-500" label="Mild Danger Zone" value={mildDangerZone} />
                    <BarSegment percent={criticalPercent} color="bg-red-500" label="Critical Zone" value={criticalZone} />
                </div>
                <div className="flex justify-between text-xs mt-2 px-1">
                    <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>Safe</span>
                    <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>Mild</span>
                    <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>Critical</span>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatItem value={reachedOutToTherapist} label="Sought Help" />
                <StatItem value={improvedAfterSessions} label="Improved with Therapy" />
                <StatItem value={criticalZone} label="Critical Cases" />
                <StatItem
                    value={reachedOutToTherapist > 0 ? `${Math.round((improvedAfterSessions / reachedOutToTherapist) * 100)}%` : '0%'}
                    label="Improvement Rate"
                />
            </div>
        </div>
    );
};

export default StatisticsCard;
