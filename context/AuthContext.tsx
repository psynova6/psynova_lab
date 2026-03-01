import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';
import { authService } from '../services/authService';
import type { UserProfile, Role } from '../types';

interface AuthContextType {
    isAuthenticated: boolean;
    userProfile: UserProfile;
    role: Role | null;
    setRole: (role: Role | null) => void;
    login: (email: string, password: string, role: Role, rememberMe: boolean) => Promise<any>;
    signup: (data: any) => Promise<any>;
    verify: (email: string, otp: string) => Promise<any>;
    resendOTP: (email: string) => Promise<any>;
    logout: () => Promise<void>;
    updateProfile: (newProfile: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('isAuthenticated') === 'true';
    });
    const [userProfile, setUserProfile] = usePersistentState<UserProfile>('userProfile', { name: 'WARRIOR', avatar: null });
    const [role, setRole] = usePersistentState<Role | null>('userRole', null);

    const roleMap: Record<string, string> = {
        'student': 'student',
        'therapist': 'counselor',
        'institution': 'admin'
    };

    const login = useCallback(async (email: string, password: string, attemptRole: Role, rememberMe: boolean) => {
        try {
            const response = await authService.login({
                email,
                password,
                role: roleMap[attemptRole] || 'student',
                remember_me: rememberMe,
                device_info: navigator.userAgent
            });

            const { access_token, refresh_token } = response;

            localStorage.setItem('accessToken', access_token);
            localStorage.setItem('refreshToken', refresh_token);

            const userName = email.split('@')[0] || 'User';
            setUserProfile({ name: userName.toUpperCase(), avatar: null });

            localStorage.setItem('isAuthenticated', 'true');
            setIsAuthenticated(true);
            return response;
        } catch (error) {
            throw error;
        }
    }, [setUserProfile]);

    const signup = useCallback(async (data: any) => {
        const backendData = {
            ...data,
            role: roleMap[data.role] || 'student',
            consent: true,
            consent_version: '1.0'
        };
        return await authService.signup(backendData);
    }, []);

    const verify = useCallback(async (email: string, otp: string) => {
        return await authService.verifyEmail(email, otp);
    }, []);

    const resendOTP = useCallback(async (email: string) => {
        return await authService.resendVerification(email);
    }, []);

    const logout = useCallback(async () => {
        const refreshToken = localStorage.getItem('refreshToken');

        // --- UX First: Clear ALL local state immediately to prevent data leakage ---
        localStorage.clear();
        sessionStorage.clear();

        setIsAuthenticated(false);
        setRole(null);

        // --- Backend Revocation (Best Effort) ---
        if (refreshToken) {
            try {
                // We use a best-effort call here. If it fails (e.g., 401), we've already logged out locally.
                await authService.logout(refreshToken);
            } catch (e) {
                // Silently log or ignore server-side revocation failure
                console.warn('Backend session revocation failed or was unnecessary:', e);
            }
        }
    }, [setRole]);

    const updateProfile = useCallback((newProfile: UserProfile) => {
        setUserProfile(newProfile);
    }, [setUserProfile]);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            userProfile,
            role,
            setRole,
            login,
            signup,
            verify,
            resendOTP,
            logout,
            updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
