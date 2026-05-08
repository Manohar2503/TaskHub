import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// ========================
// Middleware
// ========================

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging
app.use(morgan('combined'));

// Rate limiting
const isDevelopment = process.env.NODE_ENV !== 'production';
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX || (isDevelopment ? 1000 : 100)),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests. Please wait a moment and try again.',
    },
});

//app.use('/api/', limiter);

// ========================
// Health Check
// ========================

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Task Manager API is running',
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
    });
});

// ========================
// Routes
// ========================

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// ========================
// Error Handling
// ========================

app.use(notFound);
app.use(errorHandler);

// ========================
// Server Startup
// ========================

const PORT = process.env.PORT || 5000;

// if (!process.env.VERCEL) {
//     app.listen(PORT, () => {
//         console.log(`Server is running on port ${PORT}`);
//         console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
//     });
// }

export default app;
