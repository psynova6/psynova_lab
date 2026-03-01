import React from 'react';
import type { TherapistDepartmentView, TherapistStudent } from '../../types';

interface DepartmentStudentListViewProps {
    department: TherapistDepartmentView;
    onBack: () => void;
    onStudentClick: (student: TherapistStudent) => void;
}

const DepartmentStudentListView: React.FC<DepartmentStudentListViewProps> = ({ department, onBack, onStudentClick }) => {
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

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not checked in';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="animate-fade-in-down">
            <div className="flex items-center mb-6 sm:mb-8">
                <button onClick={onBack} aria-label="Back to departments" className="p-2 w-12 h-12 flex items-center justify-center text-3xl rounded-full text-brand-dark-green/60 hover:text-brand-dark-green hover:bg-black/10 transition-colors active:scale-95">&larr;</button>
                <h1 className="text-2xl sm:text-3xl font-bold text-center flex-grow">{department.name} - Students</h1>
                <div className="w-12 h-12"></div> {/* Spacer */}
            </div>

            <div className="bg-white/60 rounded-[2rem] shadow-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-brand-dark-green">Student List</h2>
                        <p className="text-sm text-brand-dark-green/70">{department.students.length} students</p>
                    </div>
                    <div className="text-sm text-brand-dark-green/70">
                        <div className="flex gap-3 sm:gap-4">
                            <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-brand-dark-green mr-1"></span>Safe</span>
                            <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>Mild</span>
                            <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>Critical</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {department.students.map(student => (
                        <div key={student.id} className="bg-brand-background/50 rounded-2xl p-4 hover:bg-brand-light-green/20 transition-all duration-300 group active:scale-[0.98]">
                            <div className="mb-3">
                                <h3 className="font-bold text-brand-dark-green truncate text-base">{student.name}</h3>
                                <p className="text-xs text-brand-dark-green/60 mt-1">Last check-in: {formatDate(student.lastCheckIn)}</p>
                            </div>

                            <div className="flex items-center justify-between text-xs text-brand-dark-green/70 mb-4">
                                <span className="text-sm">{student.sessionsCompleted} sessions</span>
                                <span className={`px-3 py-1.5 rounded-full text-white font-semibold text-xs ${getSeverityColor(student.severityLevel)}`}>
                                    {student.severityLevel.toUpperCase()}
                                </span>
                            </div>

                            <button
                                onClick={() => onStudentClick(student)}
                                className="w-full bg-brand-dark-green text-white font-semibold py-3 px-4 rounded-full hover:bg-brand-light-green hover:text-brand-dark-green transition-colors active:scale-95 min-h-[48px]"
                            >
                                Explore
                            </button>
                        </div>
                    ))}
                </div>

                {department.students.length === 0 && (
                    <div className="text-center py-12 text-brand-dark-green/70">
                        <p>No students in this department yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DepartmentStudentListView;
