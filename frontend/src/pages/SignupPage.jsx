import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth.js';
import { User, Mail, Lock } from 'lucide-react';

export const SignupPage = () => {
    const navigate = useNavigate();
    const { signup, loading } = useAuth();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [serverError, setServerError] = useState('');
    const password = watch('password');

    const onSubmit = async (data) => {
        setServerError('');
        try {
            await signup(data.name, data.email, data.password, data.confirmPassword);
            navigate('/dashboard');
        } catch (error) {
            setServerError(error.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-lg shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-primary-600 mb-2">TaskHub</h1>
                        <p className="text-gray-600">Create your account</p>
                    </div>

                    {/* Error Message */}
                    {serverError && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{serverError}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    {...register('name', {
                                        required: 'Name is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Name must be at least 2 characters',
                                        },
                                    })}
                                    className="input-field pl-10"
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.name && (
                                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address',
                                        },
                                    })}
                                    className="input-field pl-10"
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="password"
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters',
                                        },
                                    })}
                                    className="input-field pl-10"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="password"
                                    {...register('confirmPassword', {
                                        required: 'Confirm password is required',
                                        validate: (value) =>
                                            value === password || 'Passwords do not match',
                                    })}
                                    className="input-field pl-10"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full mt-6"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                        </div>
                    </div>

                    {/* Sign In Link */}
                    <Link
                        to="/login"
                        className="btn-secondary w-full text-center"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};
