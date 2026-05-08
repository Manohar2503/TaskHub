// User Roles
export const USER_ROLES = {
    ADMIN: 'admin',
    MEMBER: 'member',
};

// Task Status
export const TASK_STATUS = {
    TODO: 'todo',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
};

// Task Priority
export const TASK_PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent',
};

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
    UNAUTHORIZED: 'Unauthorized - Please login',
    FORBIDDEN: 'Forbidden - You do not have permission',
    NOT_FOUND: 'Resource not found',
    INVALID_EMAIL: 'Invalid email address',
    INVALID_PASSWORD: 'Password must be at least 6 characters',
    USER_EXISTS: 'User already exists',
    INVALID_CREDENTIALS: 'Invalid credentials',
    TOKEN_EXPIRED: 'Token has expired',
    INVALID_TOKEN: 'Invalid token',
};

// Success Messages
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Logged in successfully',
    SIGNUP_SUCCESS: 'Account created successfully',
    PROJECT_CREATED: 'Project created successfully',
    PROJECT_UPDATED: 'Project updated successfully',
    PROJECT_DELETED: 'Project deleted successfully',
    TASK_CREATED: 'Task created successfully',
    TASK_UPDATED: 'Task updated successfully',
    TASK_DELETED: 'Task deleted successfully',
};
