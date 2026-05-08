import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { Header } from './components/Header.jsx';
import { ProtectedRoute } from './routes/ProtectedRoute.jsx';

// Pages
import { LoginPage } from './pages/LoginPage.jsx';
import { SignupPage } from './pages/SignupPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { ProjectsPage } from './pages/ProjectsPage.jsx';
import { ProjectDetailPage } from './pages/ProjectDetailPage.jsx';
import { TasksPage } from './pages/TasksPage.jsx';

import './index.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-gray-50">
                    <Header />
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />

                        {/* Protected Routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <DashboardPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/projects"
                            element={
                                <ProtectedRoute>
                                    <ProjectsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/projects/:projectId"
                            element={
                                <ProtectedRoute>
                                    <ProjectDetailPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/tasks"
                            element={
                                <ProtectedRoute>
                                    <TasksPage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Redirects */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </div>
                <Toaster position="top-right" />
            </AuthProvider>
        </Router>
    );
}

export default App;
