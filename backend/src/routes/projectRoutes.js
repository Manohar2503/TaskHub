import express from 'express';
import {
    createProject,
    getMyProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addTeamMember,
    removeTeamMember,
    updateTeamMemberRole,
} from '../controllers/projectController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { isProjectOwnerOrAdmin } from '../middleware/authorizationMiddleware.js';
import { validate, createProjectSchema, updateProjectSchema, addTeamMemberSchema } from '../validators/validationSchemas.js';

const router = express.Router();

// All project routes require authentication
router.use(authMiddleware);

// Project routes
router.post('/', validate(createProjectSchema), createProject);
router.get('/', getMyProjects);
router.get('/:projectId', getProjectById);
router.put('/:projectId', validate(updateProjectSchema), isProjectOwnerOrAdmin, updateProject);
router.delete('/:projectId', isProjectOwnerOrAdmin, deleteProject);

// Team member routes
router.post('/:projectId/members', validate(addTeamMemberSchema), isProjectOwnerOrAdmin, addTeamMember);
router.delete('/:projectId/members/:userId', isProjectOwnerOrAdmin, removeTeamMember);
router.patch('/:projectId/members/:userId/role', isProjectOwnerOrAdmin, updateTeamMemberRole);

export default router;
