import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../services/taskService.js';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { BarChart3, CheckCircle2, Clock, AlertCircle, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export const DashboardPage = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await taskService.getDashboardStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            toast.error('Failed to fetch dashboard stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    const { stats: dashboardStats } = stats || {};

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-2">Welcome back! Here's your task overview.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    {/* Total Projects */}
                    <div className="card p-6 hover:shadow-md transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Projects</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {dashboardStats?.totalProjects || 0}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <BarChart3 className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Total Tasks */}
                    <div className="card p-6 hover:shadow-md transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Tasks</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {dashboardStats?.totalTasks || 0}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Zap className="text-purple-600" size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Completed Tasks */}
                    <div className="card p-6 hover:shadow-md transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {dashboardStats?.completedTasks || 0}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CheckCircle2 className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Pending Tasks */}
                    <div className="card p-6 hover:shadow-md transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {dashboardStats?.pendingTasks || 0}
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Clock className="text-yellow-600" size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Overdue Tasks */}
                    <div className="card p-6 hover:shadow-md transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Overdue</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {dashboardStats?.overdueTasks || 0}
                                </p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-lg">
                                <AlertCircle className="text-red-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                {dashboardStats && (
                    <div className="card p-6 mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Progress</h2>
                        <div className="flex items-center space-x-4">
                            <div className="flex-1">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${dashboardStats.completionPercentage}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-primary-600">
                                {dashboardStats.completionPercentage}%
                            </p>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                        onClick={() => navigate('/projects')}
                        className="card p-6 hover:shadow-md transition text-left cursor-pointer"
                    >
                        <h3 className="text-lg font-semibold text-gray-900">View All Projects</h3>
                        <p className="text-gray-600 mt-2">Manage your projects and team members</p>
                    </button>

                    <button
                        onClick={() => navigate('/tasks')}
                        className="card p-6 hover:shadow-md transition text-left cursor-pointer"
                    >
                        <h3 className="text-lg font-semibold text-gray-900">View My Tasks</h3>
                        <p className="text-gray-600 mt-2">Check your assigned tasks</p>
                    </button>
                </div>
            </div>
        </div>
    );
};
