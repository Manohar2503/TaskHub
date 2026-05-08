import React, { useEffect, useState } from 'react';
import { taskService } from '../services/taskService.js';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { TaskCard } from '../components/TaskCard.jsx';
import { Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchTasks();
    }, [filter]);

    const fetchTasks = async () => {
        try {
            const response = await taskService.getMyAssignedTasks(
                filter !== 'all' ? filter : undefined
            );
            if (response.success) {
                setTasks(response.data.tasks);
            }
        } catch (error) {
            toast.error('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (taskId) => {
        if (!window.confirm('Delete this task?')) return;

        try {
            const response = await taskService.deleteTask(taskId);
            if (response.success) {
                setTasks(tasks.filter((t) => t._id !== taskId));
                toast.success('Task deleted');
            }
        } catch (error) {
            toast.error('Failed to delete task');
        }
    };

    const handleStatusChange = async (task, status) => {
        try {
            const response = await taskService.updateTask(
                task._id,
                undefined,
                undefined,
                status,
                undefined,
                undefined,
                undefined
            );

            if (response.success) {
                if (filter !== 'all' && status !== filter) {
                    setTasks((currentTasks) => currentTasks.filter((item) => item._id !== task._id));
                } else {
                    setTasks((currentTasks) => currentTasks.map((item) => (
                        item._id === task._id ? response.data.task : item
                    )));
                }
                toast.success('Task status updated');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update task status');
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    const filteredTasks = tasks;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
                    <p className="text-gray-600 mt-2">Tasks assigned to you</p>
                </div>

                {/* Filter */}
                <div className="flex items-center space-x-4 mb-6">
                    <Filter size={20} className="text-gray-500" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="input-field max-w-xs"
                    >
                        <option value="all">All Tasks</option>
                        <option value="todo">Todo</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                {/* Tasks */}
                {filteredTasks.length === 0 ? (
                    <div className="card p-12 text-center">
                        <p className="text-gray-600 text-lg">
                            {filter === 'all'
                                ? 'No tasks assigned to you yet'
                                : `No ${filter.replace('_', ' ')} tasks`}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onDelete={handleDelete}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
