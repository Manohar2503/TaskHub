import React from 'react';

export const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
    </div>
);

export const SmallSpinner = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
    };

    return (
        <div className={`animate-spin rounded-full border-t-2 border-b-2 border-primary-600 ${sizeClasses[size]}`}></div>
    );
};
