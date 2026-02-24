import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/auth';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the access token to headers
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_BASE_URL}/refresh`, {
                        refresh_token: refreshToken,
                    });
                    const { access_token } = response.data;
                    localStorage.setItem('accessToken', access_token);
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    // If refresh fails, log out the user
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('isAuthenticated');
                    window.location.reload();
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);

export const authService = {
    async signup(data: any) {
        const response = await apiClient.post('/signup', data);
        return response.data;
    },

    async login(data: any) {
        const response = await apiClient.post('/login', data);
        return response.data;
    },

    async verifyEmail(email: string, code: string) {
        const response = await apiClient.post('/verify-email', { email, code });
        return response.data;
    },

    async resendVerification(email: string) {
        const response = await apiClient.post('/resend-verification', { email });
        return response.data;
    },

    async forgotPassword(email: string) {
        const response = await apiClient.post('/forgot-password', { email });
        return response.data;
    },

    async resetPassword(data: any) {
        const response = await apiClient.post('/reset-password', data);
        return response.data;
    },

    async changePassword(data: any) {
        const response = await apiClient.post('/change-password', data);
        return response.data;
    },

    async getSessions() {
        const response = await apiClient.get('/sessions');
        return response.data;
    },

    async revokeSession(sessionId: string) {
        const response = await apiClient.delete(`/sessions/${sessionId}`);
        return response.data;
    },

    async logout(refreshToken: string) {
        const response = await apiClient.post('/logout', { refresh_token: refreshToken });
        return response.data;
    },
};
