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
            <div className="bg-brand-background/30 border border-brand-light-green/20 rounded-2xl p-4 flex-1 flex flex-col hover:bg-brand-light-green/5 transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-brand-light-green/20 flex items-center justify-center mr-2">
                            {icon}
                        </div>
                        <h4 className="text-lg font-bold text-brand-dark-green">{title}</h4>
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
                                <li key={user.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-brand-light-green/20 transition-colors group">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-brand-dark-green text-white flex items-center justify-center text-xs font-bold shrink-0">
                                            {user.name.charAt(0)}
                                        </div>
                                        <span className="font-semibold text-brand-dark-green/90 text-sm">{user.name}</span>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveClick(user.id, user.name)}
                                        className="text-xs text-red-500 font-semibold hover:bg-red-50 px-2 py-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                                        aria-label={`Remove ${user.name}`}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center py-6 opacity-60">
                            <p className="text-brand-dark-green text-sm font-medium">No {title.toLowerCase()} assigned.</p>
                        </div>
                    )}
                </div>
            </div>
        )
    };

    return (
        <div className="h-full bg-white/90 rounded-3xl shadow-premium p-6 sm:p-8 border border-brand-light-green/20 transition-all duration-300">
            {!isExpanded ? (
                <button
                    onClick={() => setIsExpanded(true)}
                    className="w-full h-full text-left flex flex-col justify-center gap-4 animate-fade-in-down group"
                    aria-label="Expand peers section"
                >
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-brand-light-green/20 flex items-center justify-center">
                                <UserGroupIcon className="w-6 h-6 text-brand-dark-green" />
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-2xl font-bold text-brand-dark-green tracking-tight">Care Team</h3>
                                <p className="text-sm font-medium text-brand-dark-green/70">{assistants.length} Assistants, {volunteers.length} Volunteers</p>
                            </div>
                        </div>
                        <span className="w-10 h-10 rounded-full bg-brand-background flex items-center justify-center group-hover:bg-brand-light-green/30 transition-colors">
                            <svg className="w-5 h-5 text-brand-dark-green/50 group-hover:text-brand-dark-green transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                    </div>
                </button>
            ) : (
                <div className="animate-fade-in-down h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl sm:text-2xl font-bold text-brand-dark-green tracking-tight">Care Team Members</h3>
                        <button onClick={() => setIsExpanded(false)} className="text-sm font-bold text-brand-dark-green/60 hover:text-brand-dark-green bg-brand-background px-3 py-1.5 rounded-full transition-colors" aria-label="Collapse peers section">Close</button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-6">
                        <UserList
                            title="Assistants"
                            users={assistants}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-brand-dark-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                </svg>
                            }
                            userType="assistant"
                        />
                        <UserList
                            title="Volunteers"
                            users={volunteers}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-brand-dark-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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