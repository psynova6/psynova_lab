import React from 'react';
import { BuildingIcon } from '../common/icons';
import type { TherapistDepartmentView } from '../../types';

interface DepartmentInfoCardProps {
    department: TherapistDepartmentView;
    onClick: () => void;
}

const DepartmentInfoCard: React.FC<DepartmentInfoCardProps> = ({ department, onClick }) => {
    const { totalStudents, safeZone, mildDangerZone, criticalZone } = department;

    const safePercent = (safeZone / totalStudents) * 100;
    const mildPercent = (mildDangerZone / totalStudents) * 100;
    const criticalPercent = (criticalZone / totalStudents) * 100;

    return (
        <button
            onClick={onClick}
            className="w-full bg-white/90 rounded-3xl shadow-premium p-5 sm:p-6 animate-fade-in-down cursor-pointer hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300 text-left group border border-brand-light-green/20"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-brand-light-green/20 flex items-center justify-center mr-3">
                        <BuildingIcon className="w-5 h-5 text-brand-dark-green" />
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-brand-dark-green">{department.name}</h3>
                        <p className="text-sm text-brand-dark-green/70">{totalStudents} Students</p>
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-brand-background flex items-center justify-center group-hover:bg-brand-light-green/30 transition-colors">
                    <svg className="w-4 h-4 text-brand-dark-green/50 group-hover:text-brand-dark-green transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </div>
            </div>

            <div>
                <p className="text-sm font-semibold text-brand-dark-green/80 mb-2.5">Student Wellness</p>
                <div className="w-full h-3 flex rounded-full overflow-hidden bg-brand-light-green/20 gap-0.5">
                    <div style={{ width: `${safePercent}%` }} className="h-full bg-brand-dark-green transition-all" title={`${Math.round(safePercent)}% Safe`}></div>
                    <div style={{ width: `${mildPercent}%` }} className="h-full bg-yellow-400 transition-all" title={`${Math.round(mildPercent)}% Mild`}></div>
                    <div style={{ width: `${criticalPercent}%` }} className="h-full bg-red-400 transition-all" title={`${Math.round(criticalPercent)}% Critical`}></div>
                </div>
                <div className="flex justify-between text-xs mt-3 px-1 font-medium">
                    <span className="flex items-center text-brand-dark-green"><span className="w-2 h-2 rounded-full bg-brand-dark-green mr-1.5 shadow-sm"></span>{Math.round(safePercent)}% Safe</span>
                    <span className="flex items-center text-yellow-700"><span className="w-2 h-2 rounded-full bg-yellow-400 mr-1.5 shadow-sm"></span>{Math.round(mildPercent)}% Mild</span>
                    <span className="flex items-center text-red-700"><span className="w-2 h-2 rounded-full bg-red-400 mr-1.5 shadow-sm"></span>{Math.round(criticalPercent)}% Critical</span>
                </div>
            </div>
        </button>
    );
};

export default DepartmentInfoCard;
