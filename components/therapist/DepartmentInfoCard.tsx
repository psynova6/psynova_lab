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
            className="w-full bg-white/60 rounded-2xl sm:rounded-[2rem] shadow-lg p-4 sm:p-6 animate-fade-in-down cursor-pointer hover:shadow-xl hover:bg-white/80 transition-all duration-300 text-left group"
        >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center">
                    <BuildingIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-brand-dark-green" />
                    <div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-brand-dark-green">{department.name}</h3>
                        <p className="text-xs sm:text-sm text-brand-dark-green/70">{totalStudents} Students</p>
                    </div>
                </div>
                <span className="text-xl sm:text-2xl text-brand-dark-green/50 group-hover:text-brand-dark-green group-hover:translate-x-1 transition-all">→</span>
            </div>

            <div>
                <p className="text-xs sm:text-sm font-semibold text-brand-dark-green/80 mb-2">Student Wellness Distribution</p>
                <div className="w-full h-6 sm:h-8 flex rounded-full overflow-hidden bg-gray-200">
                    <div style={{ width: `${safePercent}%` }} className="h-full bg-brand-dark-green flex items-center justify-center text-white font-bold text-xs sm:text-sm" title={`${Math.round(safePercent)}% Safe`}></div>
                    <div style={{ width: `${mildPercent}%` }} className="h-full bg-yellow-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm" title={`${Math.round(mildPercent)}% Mild`}></div>
                    <div style={{ width: `${criticalPercent}%` }} className="h-full bg-red-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm" title={`${Math.round(criticalPercent)}% Critical`}></div>
                </div>
                <div className="flex justify-between text-xs mt-2 px-1">
                    <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-brand-dark-green mr-1"></span>Safe</span>
                    <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>Mild</span>
                    <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>Critical</span>
                </div>
            </div>
        </button>
    );
};

export default DepartmentInfoCard;
