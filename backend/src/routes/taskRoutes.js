import express from 'express';
import {
    createTask,
    getTasksByProject,
    getTaskById,
    updateTask,
    deleteTask,
    getDashboardStats,
    addComment,
    getMyAssignedTasks,
} from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate, createTaskSchema, updateTaskSchema } from '../validators/validationSchemas.js';

const router = express.Router();

// All task routes require authentication
router.use(authMiddleware);

// Dashboard stats
router.get('/dashboard/stats', getDashboardStats);

// My assigned tasks
router.get('/my-tasks', getMyAssignedTasks);

// Task routes
router.post('/', validate(createTaskSchema), createTask);
router.get('/project/:projectId', getTasksByProject);
router.get('/:taskId', getTaskById);
router.put('/:taskId', validate(updateTaskSchema), updateTask);
router.delete('/:taskId', deleteTask);

// Comments
router.post('/:taskId/comments', addComment);

export default router;
