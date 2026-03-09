import axios from 'axios';

const SYNA_BASE_URL = `${import.meta.env.VITE_API_URL}/syna/`;
const AUTH_API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

const synaClient = axios.create({
    baseURL: SYNA_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the access token
synaClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle 401 and refresh token
synaClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post(`${AUTH_API_URL}/refresh`, {
                        refresh_token: refreshToken,
                    });
                    const { access_token } = response.data;
                    localStorage.setItem('accessToken', access_token);
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return synaClient(originalRequest);
                } catch (refreshError) {
                    // Force logout if refresh fails
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.reload();
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);

export const synaAiService = {
    /**
     * Sends a message to the Syna AI backend.
     */
    async sendMessage(message: string, conversationId?: string): Promise<any> {
        // If no conversationId is provided, the backend will auto-assign to the primary thread
        const response = await synaClient.post('chat', { message, conversation_id: conversationId });
        return response.data;
    },

    /**
     * Records a mood check-in.
     */
    async recordMood(mood: number): Promise<any> {
        const response = await synaClient.post('mood', { mood });
        return response.data;
    },

    /**
     * Fetches the user's persistent chat history.
     */
    async getPrimaryHistory(): Promise<any> {
        const response = await synaClient.get('history/primary');
        return response.data;
    },

    /**
     * Fetches all conversations (Legacy, but kept for internal use if needed).
     */
    async getConversations(): Promise<any> {
        const response = await synaClient.get('conversations');
        return response.data;
    },

    /**
     * Fetches chat history for a specific conversation.
     */
    async getChatHistory(conversationId: string): Promise<any> {
        const response = await synaClient.get(`history/${conversationId}`);
        return response.data;
    },

    /**
     * Deletes a conversation.
     */
    async deleteConversation(conversationId: string): Promise<any> {
        const response = await synaClient.delete(`conversations/${conversationId}`);
        return response.data;
    }
};
