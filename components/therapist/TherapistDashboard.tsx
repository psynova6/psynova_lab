
import React, { useState, useEffect } from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import DepartmentInfoCard from './DepartmentInfoCard';
import DepartmentStudentListView from './DepartmentStudentListView';
import StudentDetailView from './StudentDetailView';
import PeersCard from './PeersCard';
import RemindersList from '../student/RemindersList';
import AddUserModal from '../shared/AddUserModal';
import { MOCK_THERAPIST_PROFILE, MOCK_STUDENT_SESSIONS } from '../../utils/mockTherapistData';
import type { UserProfile, Notification, TherapistProfile, TherapistDepartmentView, TherapistStudent, Reminder } from '../../types';

interface TherapistDashboardProps {
    userProfile: UserProfile;
    onLogout: () => void;
}

type ViewType = 'overview' | 'departmentStudents' | 'studentDetail';

const TherapistDashboard: React.FC<TherapistDashboardProps> = ({ userProfile, onLogout }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [profile, setProfile] = useState<TherapistProfile | null>(null);
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; userType: 'assistant' | 'volunteer' }>({ isOpen: false, userType: 'assistant' });

    // Navigation state
    const [currentView, setCurrentView] = useState<ViewType>('overview');
    const [selectedDepartment, setSelectedDepartment] = useState<TherapistDepartmentView | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<TherapistStudent | null>(null);

    // Reminders state
    const [reminders, setReminders] = useState<Reminder[]>([
        { id: 1, task: 'Follow-up session with Neha Desai', dueDate: '2025-11-29T14:00:00Z', reminderTiming: 30 },
        { id: 2, task: 'Review notes for Karthik Iyer', dueDate: '2025-11-30T10:00:00Z', reminderTiming: 60 },
        { id: 3, task: 'Department meeting - Computer Science', dueDate: '2025-12-02T11:00:00Z', reminderTiming: 0 },
    ]);

    useEffect(() => {
        setProfile(MOCK_THERAPIST_PROFILE);
    }, []);

    const handleMarkAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const openAddPeerModal = (userType: 'assistant' | 'volunteer') => {
        setModalConfig({ isOpen: true, userType });
    };

    const handleAddPeer = (name: string) => {
        if (!profile) return;
        const newUser = { id: Date.now(), name };

        setProfile(prevProfile => {
            if (!prevProfile) return null;
            if (modalConfig.userType === 'assistant') {
                return { ...prevProfile, assistants: [...prevProfile.assistants, newUser] };
            } else {
                return { ...prevProfile, volunteers: [...prevProfile.volunteers, newUser] };
            }
        });

        setModalConfig({ isOpen: false, userType: 'assistant' });
    };

    const handleRemovePeer = (userType: 'assistant' | 'volunteer', userId: number) => {
        if (!profile) return;

        setProfile(prevProfile => {
            if (!prevProfile) return null;
            if (userType === 'assistant') {
                return { ...prevProfile, assistants: prevProfile.assistants.filter(a => a.id !== userId) };
            } else {
                return { ...prevProfile, volunteers: prevProfile.volunteers.filter(v => v.id !== userId) };
            }
        });
    };

    const handleDepartmentClick = (department: TherapistDepartmentView) => {
        setSelectedDepartment(department);
        setCurrentView('departmentStudents');
    };

    const handleStudentClick = (student: TherapistStudent) => {
        setSelectedStudent(student);
        setCurrentView('studentDetail');
    };

    const handleBackToOverview = () => {
        setCurrentView('overview');
        setSelectedDepartment(null);
        setSelectedStudent(null);
    };

    const handleBackToStudentList = () => {
        setCurrentView('departmentStudents');
        setSelectedStudent(null);
    };

    const handleDeleteReminder = (id: number) => {
        setReminders(prev => prev.filter(r => r.id !== id));
    };

    if (!profile) {
        return (
            <div className="bg-brand-background min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-brand-light-green border-t-brand-dark-green rounded-full animate-spin"></div>
            </div>
        );
    }

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
            <main className="flex-grow container mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 md:py-8">
                {currentView === 'overview' && (
                    <>
                        <div className="text-center mb-4 sm:mb-6 md:mb-8 animate-fade-in-down">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">Therapist Dashboard</h1>
                            <p className="text-sm md:text-base text-brand-dark-green/80">Welcome, {profile.name}</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
                            {profile.departments.map(dept => (
                                <DepartmentInfoCard
                                    key={dept.id}
                                    department={dept}
                                    onClick={() => handleDepartmentClick(dept)}
                                />
                            ))}
                        </div>

                        <div className="max-w-4xl mx-auto mb-4 sm:mb-6">
                            <PeersCard
                                assistants={profile.assistants}
                                volunteers={profile.volunteers}
                                onAdd={openAddPeerModal}
                                onRemove={handleRemovePeer}
                            />
                        </div>

                        <RemindersList
                            reminders={reminders}
                            onDelete={handleDeleteReminder}
                        />
                    </>
                )}

                {currentView === 'departmentStudents' && selectedDepartment && (
                    <DepartmentStudentListView
                        department={selectedDepartment}
                        onBack={handleBackToOverview}
                        onStudentClick={handleStudentClick}
                    />
                )}

                {currentView === 'studentDetail' && selectedStudent && selectedDepartment && (
                    <StudentDetailView
                        student={selectedStudent}
                        departmentName={selectedDepartment.name}
                        therapistId={profile.id}
                        sessions={MOCK_STUDENT_SESSIONS[selectedStudent.id] || []}
                        onBack={handleBackToStudentList}
                    />
                )}
            </main>
            <Footer onTermsClick={() => alert('Terms of Service page coming soon!')} />

            {modalConfig.isOpen && (
                <AddUserModal
                    isOpen={modalConfig.isOpen}
                    onClose={() => setModalConfig({ isOpen: false, userType: 'assistant' })}
                    onAdd={handleAddPeer}
                    userType={modalConfig.userType}
                />
            )}
        </div>
    );
};

export default TherapistDashboard;
