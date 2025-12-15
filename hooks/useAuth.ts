import { useState, useCallback } from 'react';
import { usePersistentState } from './usePersistentState';
import type { UserProfile, Role } from '../types';

// Helper to check both localStorage and sessionStorage for the auth flag
const getInitialAuthState = (): boolean => {
    const fromLocal = localStorage.getItem('isAuthenticated');
    const fromSession = sessionStorage.getItem('isAuthenticated');
    return fromLocal === 'true' || fromSession === 'true';
};

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuthState);
    const [userProfile, setUserProfile] = usePersistentState<UserProfile>('userProfile', { name: 'WARRIOR', avatar: null });
    const [role, setRole] = usePersistentState<Role | null>('userRole', null);

    const login = useCallback((userName: string, rememberMe: boolean, userRole: Role) => {
        setUserProfile({ name: userName.toUpperCase(), avatar: null });
        setRole(userRole);

        if (rememberMe) {
            localStorage.setItem('isAuthenticated', 'true');
        } else {
            sessionStorage.setItem('isAuthenticated', 'true');
        }
        setIsAuthenticated(true);
    }, [setUserProfile, setRole]);

    const logout = useCallback(() => {
        // Clear all app-related data from storage
        Object.keys(localStorage).forEach(key => {
            if (key !== 'userProfile' && key !== 'userRole' && key !== 'isAuthenticated') {
                // Keep user profile for convenience, but clear session data
                // In a real app, you might clear everything.
            }
        });
        localStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('isAuthenticated');

        // Reset state
        setIsAuthenticated(false);
        setRole(null);
    }, [setRole]);

    const updateProfile = useCallback((newProfile: UserProfile) => {
        setUserProfile(newProfile);
    }, [setUserProfile]);

    return {
        isAuthenticated,
        userProfile,
        role,
        login,
        logout,
        updateProfile
    };
};
