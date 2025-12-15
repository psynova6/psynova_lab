import React from 'react';
import { BriefcaseIcon, TherapistIcon } from '../common/icons';
import type { Therapist } from '../../types';

interface TherapistManagementCardProps {
    therapists: Therapist[];
}

const TherapistManagementCard: React.FC<TherapistManagementCardProps> = ({ therapists }) => {
    return (
        <div className="bg-white/60 rounded-[2rem] shadow-lg p-6 h-full flex flex-col">
            <div className="flex items-center mb-4">
                <BriefcaseIcon className="w-6 h-6 mr-3 text-brand-dark-green" />
                <h3 className="text-xl font-bold text-brand-dark-green">Therapists</h3>
            </div>

            <div className="flex-grow overflow-y-auto max-h-64 pr-2">
                {therapists.length > 0 ? (
                    <ul className="space-y-4">
                        {therapists.map(therapist => {
                            const loadPercent = (therapist.studentsAttended / therapist.maxCapacity) * 100;
                            return (
                                <li key={therapist.id} className="p-3 rounded-xl hover:bg-brand-light-green/20">
                                    <div className="flex items-center mb-2">
                                        <TherapistIcon className="w-5 h-5 mr-3 text-brand-dark-green/70" />
                                        <span className="font-medium text-brand-dark-green">{therapist.name}</span>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center text-xs text-brand-dark-green/80 mb-1">
                                            <span>Student Load</span>
                                            <span>{therapist.studentsAttended} / {therapist.maxCapacity}</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div style={{ width: `${loadPercent}%` }} className="h-full bg-brand-light-green rounded-full transition-all duration-500"></div>
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                ) : (
                    <div className="text-center text-brand-dark-green/70 py-8">No therapists assigned to this department.</div>
                )}
            </div>
        </div>
    );
};

export default TherapistManagementCard;