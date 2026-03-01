
import React, { useState, useEffect } from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import DepartmentDetailView from './DepartmentDetailView';
import { BuildingIcon } from '../common/icons';
import { MOCK_INSTITUTION_DATA } from '../../utils/mockInstitutionData';
import type { UserProfile, Notification, Department, Student, Therapist } from '../../types';

interface InstitutionDashboardProps {
    userProfile: UserProfile;
    onLogout: () => void;
}

const InstitutionDashboard: React.FC<InstitutionDashboardProps> = ({ userProfile, onLogout }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

    useEffect(() => {
        // In a real app, this would be an API call
        setDepartments(MOCK_INSTITUTION_DATA);
    }, []);

    const handleMarkAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const DepartmentSelectionView = () => (
        <div className="text-center animate-fade-in-down">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Institution Dashboard</h1>
            <p className="text-lg text-brand-dark-green/80 mb-12">Select a department to view detailed analytics.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {departments.map(dept => (
                    <button
                        key={dept.id}
                        onClick={() => setSelectedDepartment(dept)}
                        className="group bg-white/50 p-6 rounded-[2rem] shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center gap-4 text-brand-dark-green hover:bg-brand-dark-green hover:text-white"
                    >
                        <BuildingIcon className="w-12 h-12 text-brand-dark-green group-hover:text-brand-light-green transition-colors" />
                        <h3 className="text-xl font-semibold">{dept.name}</h3>
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-brand-background min-h-screen font-sans text-brand-dark-green flex flex-col">
            <Header
                userProfile={userProfile}
                notifications={notifications}
                onOpenProfileSettings={() => alert('Profile settings coming soon!')}
                onOpenSubscription={() => { }}
                onLogout={onLogout}
                onClearNotifications={() => setNotifications([])}
                onViewAllNotifications={() => alert('Notifications page coming soon!')}
                onMarkAsRead={handleMarkAsRead}
            />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {selectedDepartment ? (
                    <DepartmentDetailView
                        department={selectedDepartment}
                        onBack={() => setSelectedDepartment(null)}
                    />
                ) : (
                    <DepartmentSelectionView />
                )}
            </main>
            <Footer onTermsClick={() => alert('Terms of Service page coming soon!')} />
        </div>
    );
};

export default InstitutionDashboard;
