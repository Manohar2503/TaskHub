import express from 'express';
import { signup, login, getCurrentUser, getAllUsers, updateProfile } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate, signupSchema, loginSchema } from '../validators/validationSchemas.js';

const router = express.Router();

// Public routes
router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);
router.put('/profile', authMiddleware, updateProfile);

router.get('/users', authMiddleware, getAllUsers);

export default router;
