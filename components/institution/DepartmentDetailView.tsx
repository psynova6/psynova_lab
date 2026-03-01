import React from 'react';
import type { Department } from '../../types';
import StatisticsCard from './StatisticsCard';
import StudentManagementCard from './StudentManagementCard';
import TherapistManagementCard from './TherapistManagementCard';

interface DepartmentDetailViewProps {
    department: Department;
    onBack: () => void;
}

const DepartmentDetailView: React.FC<DepartmentDetailViewProps> = ({ department, onBack }) => {
    return (
        <div className="animate-fade-in-down">
            <div className="flex items-center mb-8">
                <button onClick={onBack} aria-label="Back to all departments" className="p-2 w-12 h-12 flex items-center justify-center text-3xl rounded-full text-brand-dark-green/60 hover:text-brand-dark-green hover:bg-black/10 transition-colors">&larr;</button>
                <h1 className="text-3xl font-bold text-center flex-grow">{department.name} Overview</h1>
                <div className="w-12 h-12"></div> {/* Spacer to balance the back button */}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="lg:col-span-2">
                    <StatisticsCard stats={department.stats} />
                </div>
                <div>
                    <StudentManagementCard
                        students={department.students}
                    />
                </div>
                <div>
                    <TherapistManagementCard
                        therapists={department.therapists}
                    />
                </div>
            </div>
        </div>
    );
};

export default DepartmentDetailView;