import { HTTP_STATUS, ERROR_MESSAGES, USER_ROLES } from '../config/constants.js';

/**
 * Middleware to check if user has required role
 * @param {...string} allowedRoles - Roles allowed to access the route
 * @returns Middleware function
 */
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.userRole || !allowedRoles.includes(req.userRole)) {
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                success: false,
                message: ERROR_MESSAGES.FORBIDDEN,
            });
        }
        next();
    };
};

/**
 * Middleware to check if user is admin
 */
export const isAdmin = (req, res, next) => {
    if (req.userRole !== USER_ROLES.ADMIN) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
            success: false,
            message: ERROR_MESSAGES.FORBIDDEN,
        });
    }
    next();
};

/**
 * Middleware to check if user is project owner or admin
 */
export const isProjectOwnerOrAdmin = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const Project = (await import('../models/Project.js')).default;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        if (project.owner.toString() !== req.userId && req.userRole !== USER_ROLES.ADMIN) {
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                success: false,
                message: ERROR_MESSAGES.FORBIDDEN,
            });
        }

        req.project = project;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
