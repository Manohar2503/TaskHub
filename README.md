# TaskHub - MERN Stack Project Management Web App

A professional, production-level project management application built with the MERN (MongoDB, Express, React, Node.js) stack. Features modern UI/UX, role-based access control, and comprehensive task management capabilities.

## 🎯 Features

### Authentication
- ✅ User signup and login
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected routes
- ✅ Role-based access control (Admin/Member)

### Project Management
- ✅ Create, read, update, and delete projects
- ✅ Add team members to projects
- ✅ Assign team member roles
- ✅ Project overview with statistics
- ✅ Project status tracking (active/archived)

### Task Management
- ✅ Create, read, update, and delete tasks
- ✅ Assign tasks to team members
- ✅ Set task priority levels (low/medium/high/urgent)
- ✅ Track task status (todo/in_progress/completed)
- ✅ Set due dates and track overdue tasks
- ✅ Add comments to tasks
- ✅ Task filtering and sorting

### Dashboard
- ✅ Real-time statistics overview
- ✅ Total projects and tasks count
- ✅ Completed and pending task tracking
- ✅ Overdue task alerts
- ✅ Task completion percentage
- ✅ Visual progress indicators

## 📋 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate limiting
- **Logging**: Morgan

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: Context API + React Hooks
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

### Database
- MongoDB Atlas or Local MongoDB
- Mongoose for schema validation and relationships

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file** (copy from .env.example)
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** in `.env`:
   ```env
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/task-manager
   JWT_SECRET=your_secret_key_min_32_chars
   JWT_EXPIRE=7d
   NODE_ENV=development
   PORT=5000
   CORS_ORIGIN=http://localhost:5173
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory** (in another terminal)
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file** (copy from .env.example)
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** in `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_APP_NAME=Task Manager
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   App will run on `http://localhost:5173`

## 📁 Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js        # MongoDB connection
│   │   └── constants.js       # App constants
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Project.js         # Project schema
│   │   └── Task.js            # Task schema
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification
│   │   ├── authorizationMiddleware.js # Role-based access
│   │   └── errorMiddleware.js      # Error handling
│   ├── validators/
│   │   └── validationSchemas.js    # Joi schemas
│   ├── utils/
│   │   └── helpers.js              # Helper functions
│   └── server.js                    # Express app setup
├── .env.example
├── package.json
└── README.md
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx              # Navigation header
│   │   ├── LoadingSpinner.jsx      # Loading indicators
│   │   ├── Modal.jsx               # Reusable modal
│   │   └── TaskCard.jsx            # Task card component
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ProjectsPage.jsx
│   │   └── TasksPage.jsx
│   ├── context/
│   │   └── AuthContext.jsx         # Authentication state
│   ├── hooks/
│   │   └── useAuth.js              # Custom auth hook
│   ├── routes/
│   │   └── ProtectedRoute.jsx      # Route protection
│   ├── services/
│   │   ├── apiClient.js            # Axios instance
│   │   ├── authService.js          # Auth API calls
│   │   ├── projectService.js       # Project API calls
│   │   └── taskService.js          # Task API calls
│   ├── App.jsx                      # Main app component
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Tailwind styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── package.json
└── README.md
```

## 🔐 Authentication Flow

1. **Signup**
   - User enters name, email, and password
   - Password is hashed using bcrypt with salt rounds = 10
   - User data is stored in MongoDB
   - JWT token is generated and returned

2. **Login**
   - User enters email and password
   - Password is compared with hashed password
   - JWT token is generated for authenticated session
   - Token is stored in localStorage

3. **Protected Routes**
   - All protected routes require valid JWT token
   - Token is automatically sent in request headers
   - Invalid/expired tokens redirect to login page

4. **Token Structure**
   ```javascript
   {
     id: userId,
     role: userRole,
     iat: issuedAt,
     exp: expirationTime
   }
   ```

## 📊 Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  avatar: String (optional),
  role: 'admin' | 'member',
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Project Model
```javascript
{
  name: String (required),
  description: String,
  owner: ObjectId (ref: User),
  teamMembers: [{
    user: ObjectId (ref: User),
    role: 'admin' | 'member',
    joinedAt: Date
  }],
  status: 'active' | 'archived',
  startDate: Date,
  endDate: Date,
  taskCount: Number,
  completedTaskCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  title: String (required),
  description: String,
  project: ObjectId (ref: Project, required),
  assignedTo: ObjectId (ref: User),
  createdBy: ObjectId (ref: User, required),
  status: 'todo' | 'in_progress' | 'completed',
  priority: 'low' | 'medium' | 'high' | 'urgent',
  dueDate: Date,
  isOverdue: Boolean,
  completedAt: Date,
  comments: [{
    user: ObjectId (ref: User),
    text: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 REST API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `GET /api/auth/users` - Get all users (protected, admin only)

### Projects
- `POST /api/projects` - Create project (protected)
- `GET /api/projects` - Get user's projects (protected)
- `GET /api/projects/:projectId` - Get project details (protected)
- `PUT /api/projects/:projectId` - Update project (protected)
- `DELETE /api/projects/:projectId` - Delete project (protected)

### Team Members
- `POST /api/projects/:projectId/members` - Add member (protected)
- `DELETE /api/projects/:projectId/members/:userId` - Remove member (protected)
- `PATCH /api/projects/:projectId/members/:userId/role` - Update member role (protected)

### Tasks
- `POST /api/tasks` - Create task (protected)
- `GET /api/tasks/project/:projectId` - Get project tasks (protected)
- `GET /api/tasks/:taskId` - Get task details (protected)
- `PUT /api/tasks/:taskId` - Update task (protected)
- `DELETE /api/tasks/:taskId` - Delete task (protected)
- `GET /api/tasks/dashboard/stats` - Get dashboard stats (protected)
- `POST /api/tasks/:taskId/comments` - Add comment (protected)
- `GET /api/tasks/my-tasks` - Get assigned tasks (protected)

## 🔒 Role-Based Access Control

### Admin
- Full access to all projects
- Can manage all users
- Can delete any project or task

### Member
- Can view projects they're part of
- Can only manage their assigned tasks
- Cannot delete projects they don't own

## 🛡️ Security Features

1. **Password Security**
   - Bcrypt hashing with 10 salt rounds
   - Passwords never stored in plain text

2. **JWT Authentication**
   - Secure token-based authentication
   - Token expiration (default 7 days)
   - Automatic refresh on login

3. **API Security**
   - Helmet.js for HTTP headers
   - CORS protection
   - Rate limiting (100 requests per 15 minutes)
   - Input validation with Joi

4. **Authorization**
   - Role-based access control
   - Resource ownership verification
   - Protected routes on frontend

5. **Data Privacy**
   - Passwords never sent in responses
   - Sensitive data excluded from API responses

## 🚀 Deployment Guide

### Backend Deployment (Heroku example)

1. **Create Heroku account** and install Heroku CLI

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create app**
   ```bash
   heroku create your-app-name
   ```

4. **Set environment variables**
   ```bash
   heroku config:set MONGODB_URL=your_mongodb_url
   heroku config:set JWT_SECRET=your_secret_key
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Vercel example)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configure environment variables** in Vercel dashboard

## 📝 API Request/Response Examples

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "member"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Create Project
```bash
POST /api/projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Website Redesign",
  "description": "Redesign company website",
  "startDate": "2024-01-15",
  "endDate": "2024-03-15"
}

Response:
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "project": { ... }
  }
}
```

### Create Task
```bash
POST /api/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Design mockups",
  "description": "Create UI mockups",
  "projectId": "...",
  "assignedTo": "...",
  "priority": "high",
  "dueDate": "2024-02-15"
}

Response:
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": { ... }
  }
}
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📚 Documentation Links

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [JWT Documentation](https://jwt.io/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👨‍💻 Author

Created as a professional MERN stack project management solution.

## 📞 Support

For support, email support@taskhub.com or open an issue in the repository.

---

**Happy Project Managing! 🚀**
