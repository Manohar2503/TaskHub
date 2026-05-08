import Joi from 'joi';
import { HTTP_STATUS } from '../config/constants.js';

/**
 * Validation middleware factory
 */
export const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const messages = error.details.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            }));

            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Validation error',
                errors: messages,
            });
        }

        req.body = value;
        next();
    };
};

// Auth Schemas
export const signupSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

// Project Schemas
export const createProjectSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500),
    startDate: Joi.date(),
    endDate: Joi.date().greater(Joi.ref('startDate')),
});

export const updateProjectSchema = Joi.object({
    name: Joi.string().min(3).max(100),
    description: Joi.string().max(500),
    startDate: Joi.date(),
    endDate: Joi.date().greater(Joi.ref('startDate')),
    status: Joi.string().valid('active', 'archived'),
});

export const addTeamMemberSchema = Joi.object({
    userId: Joi.string().required(),
    role: Joi.string().valid('admin', 'member').default('member'),
});

// Task Schemas
export const createTaskSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(1000),
    projectId: Joi.string().required(),
    assignedTo: Joi.string().allow('', null),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
    dueDate: Joi.date().allow('', null),
});

export const updateTaskSchema = Joi.object({
    title: Joi.string().min(3).max(100),
    description: Joi.string().max(1000),
    assignedTo: Joi.string().allow('', null),
    status: Joi.string().valid('todo', 'in_progress', 'completed'),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
    dueDate: Joi.date().allow('', null),
});
