import axios from 'axios';

const SYNA_BASE_URL = 'http://localhost:8000/syna';

const synaClient = axios.create({
    baseURL: SYNA_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the access token if needed for personalized context
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

export const synaAiService = {
    /**
     * Sends a message to the Syna AI backend (processed via 7-step risk pipeline).
     */
    async sendMessage(message: string): Promise<any> {
        const response = await synaClient.post('/chat', { message });
        return response.data;
    },

    /**
     * Records a mood check-in.
     */
    async recordMood(mood: number): Promise<any> {
        const response = await synaClient.post('/mood', { mood });
        return response.data;
    },

    /**
     * Fetches the isolated chat history for the logged-in user.
     */
    async getChatHistory(): Promise<any> {
        const response = await synaClient.get('/history');
        return response.data;
    }
};
