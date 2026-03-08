
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { P } from '../institution/DepartmentDetailView';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import DepartmentInfoCard from './DepartmentInfoCard';
import DepartmentStudentListView from './DepartmentStudentListView';
import StudentDetailView from './StudentDetailView';
import PeersCard from './PeersCard';
import RemindersList from '../student/RemindersList';
import AddUserModal from '../shared/AddUserModal';
import { MOCK_THERAPIST_PROFILE, MOCK_STUDENT_SESSIONS } from '../../utils/mockTherapistData';
import ConnectedStudentsPanel from './ConnectedStudentsPanel';
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
    const [activeTab, setActiveTab] = useState<'connections' | 'departments' | 'team' | 'tasks'>('connections');
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
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/40 backdrop-blur-md rounded-[2rem] p-4 sm:p-8 md:p-12 shadow-premium border border-white/20 h-full"
                    >
                        <div className="relative mb-6 sm:mb-8 md:mb-10 text-center">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-dark-green">
                                Good morning, {profile.name.split(' ')[0]}
                            </h1>
                        </div>

                        <div className="flex justify-center mb-8 sm:mb-10 w-full px-1">
                            <div className="flex flex-wrap justify-center bg-white/50 backdrop-blur-sm p-1 sm:p-1.5 rounded-2xl sm:rounded-full gap-1 sm:gap-2 shadow-sm border border-brand-light-green/10">
                                {[
                                    { id: 'connections', label: 'Connections', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
                                    { id: 'departments', label: 'Departments', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
                                    { id: 'team', label: 'Care Team', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg> },
                                    { id: 'tasks', label: 'Daily Tasks', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg> },
                                ].map(t => {
                                    const isActive = activeTab === t.id;
                                    return (
                                        <motion.button
                                            key={t.id}
                                            onClick={() => setActiveTab(t.id as any)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`
                                                flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-6 sm:py-2.5 rounded-xl sm:rounded-full 
                                                text-xs sm:text-sm md:text-base font-semibold transition-all duration-300
                                                ${isActive
                                                    ? 'bg-brand-dark-green text-white shadow-lg shadow-brand-dark-green/20'
                                                    : 'text-brand-dark-green/60 hover:text-brand-dark-green hover:bg-white/50'}
                                            `}
                                        >
                                            <span style={{ display: 'flex', alignItems: 'center', opacity: isActive ? 1 : 0.7 }}>{t.icon}</span>
                                            {t.label}
                                        </motion.button>
                                    )
                                })}
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="max-w-4xl mx-auto"
                            >
                                {activeTab === 'connections' && (
                                    <ConnectedStudentsPanel />
                                )}

                                {activeTab === 'departments' && (
                                    <div className="bg-white/90 rounded-[20px] shadow-premium p-6 sm:p-8 border border-white/40">
                                        <div className="flex flex-col gap-4">
                                            {profile.departments.map(dept => (
                                                <DepartmentInfoCard
                                                    key={dept.id}
                                                    department={dept}
                                                    onClick={() => handleDepartmentClick(dept)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'team' && (
                                    <PeersCard
                                        assistants={profile.assistants}
                                        volunteers={profile.volunteers}
                                        onAdd={openAddPeerModal}
                                        onRemove={handleRemovePeer}
                                    />
                                )}

                                {activeTab === 'tasks' && (
                                    <RemindersList
                                        reminders={reminders}
                                        onDelete={handleDeleteReminder}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
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
