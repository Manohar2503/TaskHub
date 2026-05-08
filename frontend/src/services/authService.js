import apiClient from './apiClient.js';

export const authService = {
    signup: async (name, email, password, confirmPassword) => {
        const response = await apiClient.post('/auth/signup', {
            name,
            email,
            password,
            confirmPassword,
        });
        return response.data;
    },

    login: async (email, password) => {
        const response = await apiClient.post('/auth/login', {
            email,
            password,
        });
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    },

    updateProfile: async (name, avatar) => {
        const response = await apiClient.put('/auth/profile', {
            name,
            avatar,
        });
        return response.data;
    },

    getAllUsers: async () => {
        const response = await apiClient.get('/auth/users');
        return response.data;
    },
};
