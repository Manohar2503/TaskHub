import apiClient from './apiClient.js';

export const projectService = {
    createProject: async (name, description, startDate, endDate) => {
        const response = await apiClient.post('/projects', {
            name,
            description,
            startDate,
            endDate,
        });
        return response.data;
    },

    getMyProjects: async () => {
        const response = await apiClient.get('/projects');
        return response.data;
    },

    getProjectById: async (projectId) => {
        const response = await apiClient.get(`/projects/${projectId}`);
        return response.data;
    },

    updateProject: async (projectId, name, description, status, startDate, endDate) => {
        const response = await apiClient.put(`/projects/${projectId}`, {
            name,
            description,
            status,
            startDate,
            endDate,
        });
        return response.data;
    },

    deleteProject: async (projectId) => {
        const response = await apiClient.delete(`/projects/${projectId}`);
        return response.data;
    },

    addTeamMember: async (projectId, userId, role) => {
        const response = await apiClient.post(`/projects/${projectId}/members`, {
            userId,
            role,
        });
        return response.data;
    },

    removeTeamMember: async (projectId, userId) => {
        const response = await apiClient.delete(`/projects/${projectId}/members/${userId}`);
        return response.data;
    },

    updateTeamMemberRole: async (projectId, userId, role) => {
        const response = await apiClient.patch(`/projects/${projectId}/members/${userId}/role`, {
            role,
        });
        return response.data;
    },
};
