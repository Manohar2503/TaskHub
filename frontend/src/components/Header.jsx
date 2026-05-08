import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Menu, X, LogOut, Settings } from 'lucide-react';

export const Header = () => {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div
                        className="flex-shrink-0 cursor-pointer"
                        onClick={() => handleNavigation('/dashboard')}
                    >
                        <h1 className="text-2xl font-bold text-primary-600">TaskHub</h1>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <button
                            onClick={() => handleNavigation('/dashboard')}
                            className="text-gray-600 hover:text-gray-900 transition"
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => handleNavigation('/projects')}
                            className="text-gray-600 hover:text-gray-900 transition"
                        >
                            Projects
                        </button>
                        <button
                            onClick={() => handleNavigation('/tasks')}
                            className="text-gray-600 hover:text-gray-900 transition"
                        >
                            My Tasks
                        </button>
                    </div>

                    {/* User Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.role}</p>
                            </div>
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full bg-primary-100"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                                    <span className="text-primary-600 font-medium">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => handleNavigation('/profile')}
                            className="p-2 text-gray-600 hover:text-gray-900"
                            title="Settings"
                        >
                            <Settings size={20} />
                        </button>

                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-600 hover:text-red-600"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2"
                        >
                            {isOpen ? (
                                <X size={24} className="text-gray-600" />
                            ) : (
                                <Menu size={24} className="text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden pb-4 space-y-2">
                        <button
                            onClick={() => handleNavigation('/dashboard')}
                            className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded"
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => handleNavigation('/projects')}
                            className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded"
                        >
                            Projects
                        </button>
                        <button
                            onClick={() => handleNavigation('/tasks')}
                            className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded"
                        >
                            My Tasks
                        </button>
                        <button
                            onClick={() => handleNavigation('/profile')}
                            className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded"
                        >
                            Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
};
