import { useAuthContext } from '../context/AuthContext';

/**
 * Hook to access authentication context.
 * Now wraps useAuthContext to provide a consistent interface without independent state.
 */
export const useAuth = () => {
    return useAuthContext();
};
