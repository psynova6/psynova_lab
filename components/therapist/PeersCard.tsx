import React, { useState } from 'react';
import { UserGroupIcon } from '../common/icons';
import type { Assistant, Volunteer } from '../../types';

interface PeersCardProps {
    assistants: Assistant[];
    volunteers: Volunteer[];
    onAdd: (userType: 'assistant' | 'volunteer') => void;
    onRemove: (userType: 'assistant' | 'volunteer', userId: number) => void;
}

const PeersCard: React.FC<PeersCardProps> = ({ assistants, volunteers, onAdd, onRemove }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const UserList: React.FC<{
        title: string,
        users: { id: number, name: string }[],
        icon: React.ReactNode,
        userType: 'assistant' | 'volunteer'
    }> = ({ title, users, icon, userType }) => {

        const handleRemoveClick = (userId: number, userName: string) => {
            if (window.confirm(`Are you sure you want to remove ${userName} from the ${title.toLowerCase()} list?`)) {
                onRemove(userType, userId);
            }
        };

        return (
            <div className="bg-brand-background/50 rounded-2xl p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                        {icon}
                        <h4 className="text-lg font-semibold text-brand-dark-green">{title}</h4>
                    </div>
                    <button
                        onClick={() => onAdd(userType)}
                        className="text-xs bg-brand-dark-green text-white font-semibold py-1 px-3 rounded-full hover:bg-brand-light-green hover:text-brand-dark-green transition-colors"
                        aria-label={`Add new ${title.slice(0, -1)}`}
                    >
                        Add
                    </button>
                </div>
                <div className="flex-grow">
                    {users.length > 0 ? (
                        <ul className="space-y-2">
                            {users.map(user => (
                                <li key={user.id} className="flex items-center justify-between text-brand-dark-green/90 p-2 rounded-lg hover:bg-brand-light-green/20 transition-colors">
                                    <span className="font-medium">{user.name}</span>
                                    <button
                                        onClick={() => handleRemoveClick(user.id, user.name)}
                                        className="text-xs text-red-600 font-semibold hover:underline"
                                        aria-label={`Remove ${user.name}`}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-brand-dark-green/70 text-sm h-full flex items-center justify-center">No {title.toLowerCase()} assigned.</p>
                    )}
                </div>
            </div>
        )
    };

    return (
        <div className="bg-white/60 rounded-[2rem] shadow-lg p-6 transition-all duration-300">
            {!isExpanded ? (
                <button
                    onClick={() => setIsExpanded(true)}
                    className="w-full text-left flex items-center justify-between animate-fade-in-down group"
                    aria-label="Expand peers section"
                >
                    <div className="flex items-center">
                        <UserGroupIcon className="w-8 h-8 mr-4 text-brand-dark-green" />
                        <div>
                            <h3 className="text-xl font-bold text-brand-dark-green">Your Team</h3>
                            <p className="text-brand-dark-green/70">{assistants.length} Assistants, {volunteers.length} Volunteers</p>
                        </div>
                    </div>
                    <span className="text-2xl font-bold text-brand-dark-green/70 group-hover:text-brand-dark-green transition-transform group-hover:translate-x-1">&rarr;</span>
                </button>
            ) : (
                <div className="animate-fade-in-down">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-brand-dark-green">Manage Your Team</h3>
                        <button onClick={() => setIsExpanded(false)} className="text-sm font-semibold text-brand-dark-green/80 hover:underline" aria-label="Collapse peers section">&larr; Collapse</button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-6">
                        <UserList
                            title="Assistants"
                            users={assistants}
                            icon={
                                // Clean badge/ID icon for assistants
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2 text-brand-dark-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                </svg>
                            }
                            userType="assistant"
                        />
                        <UserList
                            title="Volunteers"
                            users={volunteers}
                            icon={
                                // Clean helping hand icon for volunteers
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2 text-brand-dark-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                                </svg>
                            }
                            userType="volunteer"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PeersCard;