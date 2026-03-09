import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/games`;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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

export interface GameProgressData {
    current_scene_id: string;
    flags: Record<string, any>;
    history: string[];
    completed_endings: string[];
}

export const gameApiService = {
    async getProgress(gameId: string) {
        try {
            const response = await apiClient.get(`/progress/${gameId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch progress:', error);
            return null;
        }
    },

    async updateProgress(gameId: string, data: GameProgressData) {
        try {
            const response = await apiClient.put(`/progress/${gameId}`, data);
            return response.data;
        } catch (error) {
            console.error('Failed to update progress:', error);
            throw error;
        }
    }
};
