import React from 'react';
import { UserIcon } from '../common/icons';
import type { Student } from '../../types';

interface StudentManagementCardProps {
    students: Student[];
}

const StudentManagementCard: React.FC<StudentManagementCardProps> = ({ students }) => {
    return (
        <div className="bg-white/60 rounded-[2rem] shadow-lg p-6 h-full flex flex-col">
            <div className="flex items-center mb-4">
                {/* Clean graduation cap icon for students */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-3 text-brand-dark-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
                <h3 className="text-xl font-bold text-brand-dark-green">Students</h3>
            </div>

            <div className="flex-grow overflow-y-auto max-h-64 pr-2">
                {students.length > 0 ? (
                    <ul className="space-y-3">
                        {students.map(student => (
                            <li key={student.id} className="flex items-center p-2 rounded-xl hover:bg-brand-light-green/20 transition-colors">
                                <UserIcon className="w-5 h-5 mr-3 text-brand-dark-green/70" />
                                <span className="font-medium text-brand-dark-green">{student.name}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center text-brand-dark-green/70 py-8">No students in this department.</div>
                )}
            </div>
        </div>
    );
};

export default StudentManagementCard;