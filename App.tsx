import React, { Suspense, lazy } from 'react';
import { useAuth } from './hooks/useAuth';
import type { UserProfile, Role } from './types';

const LoginPage = lazy(() => import('./components/LoginPage'));
const StudentDashboard = lazy(() => import('./components/student/StudentDashboard'));
const InstitutionDashboard = lazy(() => import('./components/institution/InstitutionDashboard'));
const TherapistDashboard = lazy(() => import('./components/therapist/TherapistDashboard'));


// --- Suspense Fallback Component ---
// A simple spinner to show while lazy-loaded components are being fetched.
const LoadingSpinner = () => (
    <div className="fixed inset-0 bg-brand-background z-[100] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand-light-green border-t-brand-dark-green rounded-full animate-spin"></div>
    </div>
);


// Helper to check both localStorage and sessionStorage for the auth flag
const getInitialAuthState = (): boolean => {
    const fromLocal = localStorage.getItem('isAuthenticated');
    const fromSession = sessionStorage.getItem('isAuthenticated');
    return fromLocal === 'true' || fromSession === 'true';
};


function App() {
    const { isAuthenticated, role, login, logout, userProfile, updateProfile } = useAuth();

    const renderDashboard = () => {
        switch (role) {
            case 'student':
                return <StudentDashboard userProfile={userProfile} onLogout={logout} onProfileUpdate={updateProfile} />;
            case 'institution':
                return <InstitutionDashboard userProfile={userProfile} onLogout={logout} />;
            case 'therapist':
                return <TherapistDashboard userProfile={userProfile} onLogout={logout} />;
            default:
                // If role is null but authenticated, something is wrong. Log out.
                logout();
                return <LoginPage onLoginSuccess={login} />;
        }
    };

    return (
        <Suspense fallback={<LoadingSpinner />}>
            {isAuthenticated && role ? renderDashboard() : <LoginPage onLoginSuccess={login} />}
        </Suspense>
    );
}

export default App;
