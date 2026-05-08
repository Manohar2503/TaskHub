import React from 'react';
import { Trash2, Edit2, MessageCircle } from 'lucide-react';

const priorityColors = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
};

const statusBadges = {
    todo: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
};

export const TaskCard = ({
    task,
    onEdit,
    onDelete,
    onStatusChange,
    onCommentClick,
    className = '',
}) => {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
    const statusActions = {
        todo: [
            { status: 'in_progress', label: 'Start' },
            { status: 'completed', label: 'Complete' },
        ],
        in_progress: [
            { status: 'todo', label: 'To Do' },
            { status: 'completed', label: 'Complete' },
        ],
        completed: [
            { status: 'todo', label: 'Reopen' },
        ],
    };

    return (
        <div className={`card p-4 hover:shadow-md transition ${className}`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{task.title}</h3>
                    {task.description && (
                        <p className="text-sm text-gray-500 line-clamp-1 mt-1">{task.description}</p>
                    )}
                </div>
                <div className="flex items-center space-x-2 ml-2">
                    {onEdit && (
                        <button
                            onClick={() => onEdit(task)}
                            className="p-1 text-gray-500 hover:text-gray-700 transition"
                            title="Edit"
                        >
                            <Edit2 size={16} />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(task._id)}
                            className="p-1 text-gray-500 hover:text-red-600 transition"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Metadata */}
            <div className="space-y-2 mb-3">
                {/* Status and Priority */}
                <div className="flex items-center gap-2">
                    <span className={`badge ${statusBadges[task.status]}`}>
                        {task.status.replace('_', ' ')}
                    </span>
                    <span className={`badge ${priorityColors[task.priority]}`}>
                        {task.priority}
                    </span>
                </div>

                {/* Assigned To */}
                {task.assignedTo && (
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-600">Assigned to:</span>
                        {task.assignedTo.avatar ? (
                            <img
                                src={task.assignedTo.avatar}
                                alt={task.assignedTo.name}
                                className="w-6 h-6 rounded-full"
                            />
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="text-xs text-primary-600 font-medium">
                                    {task.assignedTo.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                        <span className="text-xs text-gray-600">{task.assignedTo.name}</span>
                    </div>
                )}

                {/* Due Date */}
                {task.dueDate && (
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-600">Due:</span>
                        <span className={`text-xs font-medium ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                            {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        {isOverdue && <span className="text-xs text-red-600 font-semibold">Overdue</span>}
                    </div>
                )}
            </div>

            {/* Status Actions */}
            {onStatusChange && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {statusActions[task.status]?.map((action) => (
                        <button
                            key={action.status}
                            type="button"
                            onClick={() => onStatusChange(task, action.status)}
                            className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Footer */}
            {onCommentClick && (
                <button
                    onClick={() => onCommentClick(task)}
                    className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 mt-3 pt-3 border-t border-gray-100"
                >
                    <MessageCircle size={14} />
                    <span>Comments</span>
                </button>
            )}
        </div>
    );
};
