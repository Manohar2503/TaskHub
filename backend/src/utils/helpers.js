import jwt from 'jsonwebtoken';

/**
 * Generate JWT token
 */
export const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

/**
 * Send success response
 */
export const sendSuccess = (res, message, data = null, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        ...(data && { data }),
    });
};

/**
 * Send error response
 */
export const sendError = (res, message, statusCode = 400, errors = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        ...(errors && { errors }),
    });
};
