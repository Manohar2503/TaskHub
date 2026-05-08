import apiClient from './apiClient.js';

export const taskService = {
    createTask: async (title, description, projectId, assignedTo, priority, dueDate) => {
        const response = await apiClient.post('/tasks', {
            title,
            description,
            projectId,
            assignedTo,
            priority,
            dueDate,
        });
        return response.data;
    },

    getTasksByProject: async (projectId, status, priority, assignedTo) => {
        const response = await apiClient.get(`/tasks/project/${projectId}`, {
            params: {
                status,
                priority,
                assignedTo,
            },
        });
        return response.data;
    },

    getTaskById: async (taskId) => {
        const response = await apiClient.get(`/tasks/${taskId}`);
        return response.data;
    },

    updateTask: async (taskId, title, description, status, priority, assignedTo, dueDate) => {
        const response = await apiClient.put(`/tasks/${taskId}`, {
            title,
            description,
            status,
            priority,
            assignedTo,
            dueDate,
        });
        return response.data;
    },

    deleteTask: async (taskId) => {
        const response = await apiClient.delete(`/tasks/${taskId}`);
        return response.data;
    },

    getDashboardStats: async () => {
        const response = await apiClient.get('/tasks/dashboard/stats');
        return response.data;
    },

    addComment: async (taskId, text) => {
        const response = await apiClient.post(`/tasks/${taskId}/comments`, {
            text,
        });
        return response.data;
    },

    getMyAssignedTasks: async (status) => {
        const response = await apiClient.get('/tasks/my-tasks', {
            params: { status },
        });
        return response.data;
    },
};
