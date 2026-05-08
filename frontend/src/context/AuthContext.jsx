import React, { createContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/authService.js';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(!!localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);

    // Initialize user on mount
    useEffect(() => {
        const initializeAuth = async () => {
            const savedUser = localStorage.getItem('user');
            const savedToken = localStorage.getItem('token');

            if (!savedToken || !savedUser) {
                setLoading(false);
                return;
            }

            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
                setIsAuthenticated(true);

                const response = await authService.getCurrentUser();
                if (response.success) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    setUser(response.data.user);
                }
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setToken(null);
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const signup = useCallback(async (name, email, password, confirmPassword) => {
        setLoading(true);
        try {
            const response = await authService.signup(name, email, password, confirmPassword);

            if (response.success) {
                const { user: userData, token: authToken } = response.data;

                localStorage.setItem('token', authToken);
                localStorage.setItem('user', JSON.stringify(userData));

                setUser(userData);
                setToken(authToken);
                setIsAuthenticated(true);

                toast.success(response.message);
                return response;
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Signup failed';
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (email, password) => {
        setLoading(true);
        try {
            const response = await authService.login(email, password);

            if (response.success) {
                const { user: userData, token: authToken } = response.data;

                localStorage.setItem('token', authToken);
                localStorage.setItem('user', JSON.stringify(userData));

                setUser(userData);
                setToken(authToken);
                setIsAuthenticated(true);

                toast.success(response.message);
                return response;
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUser(null);
        setToken(null);
        setIsAuthenticated(false);

        toast.success('Logged out successfully');
    }, []);

    const updateProfile = useCallback(async (name, avatar) => {
        setLoading(true);
        try {
            const response = await authService.updateProfile(name, avatar);

            if (response.success) {
                const updatedUser = response.data.user;

                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);

                toast.success('Profile updated successfully');
                return response;
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Update failed';
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const value = {
        user,
        token,
        loading,
        isAuthenticated,
        signup,
        login,
        logout,
        updateProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
