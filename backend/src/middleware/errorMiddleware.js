import { HTTP_STATUS } from '../config/constants.js';

/**
 * Global error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((error) => error.message);
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: 'Validation error',
            errors: messages,
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(HTTP_STATUS.CONFLICT).json({
            success: false,
            message: `${field} already exists`,
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            message: 'Invalid token',
        });
    }

    // Default error
    return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

/**
 * Not Found middleware
 */
export const notFound = (req, res) => {
    res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl,
    });
};

/**
 * Async error handler wrapper
 */
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
