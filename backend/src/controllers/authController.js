import User from '../models/User.js';
import { generateToken, sendSuccess, sendError } from '../utils/helpers.js';
import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../config/constants.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * Signup Controller
 */
export const signup = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
        return sendError(res, ERROR_MESSAGES.USER_EXISTS, HTTP_STATUS.CONFLICT);
    }

    // Create new user
    user = new User({ name, email, password });
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    return sendSuccess(
        res,
        SUCCESS_MESSAGES.SIGNUP_SUCCESS,
        {
            user: user.toJSON(),
            token,
        },
        HTTP_STATUS.CREATED
    );
});

/**
 * Login Controller
 */
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
        return sendError(res, ERROR_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    return sendSuccess(res, SUCCESS_MESSAGES.LOGIN_SUCCESS, {
        user: user.toJSON(),
        token,
    });
});

/**
 * Get Current User
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId);

    if (!user) {
        return sendError(res, ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccess(res, 'User fetched successfully', { user });
});

/**
 * Get All Users (Admin only)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({ isActive: true }).select('-password');

    return sendSuccess(res, 'Users fetched successfully', { users });
});

/**
 * Update User Profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
    const { name, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
        req.userId,
        { name, avatar },
        { new: true, runValidators: true }
    );

    if (!user) {
        return sendError(res, ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccess(res, 'Profile updated successfully', { user });
});
