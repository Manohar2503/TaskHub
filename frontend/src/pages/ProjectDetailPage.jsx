import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { LoadingSpinner, SmallSpinner } from '../components/LoadingSpinner.jsx';
import { Modal } from '../components/Modal.jsx';
import { TaskCard } from '../components/TaskCard.jsx';
import { authService } from '../services/authService.js';
import { projectService } from '../services/projectService.js';
import { taskService } from '../services/taskService.js';

const emptyTaskForm = {
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
};

export const ProjectDetailPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [taskForm, setTaskForm] = useState(emptyTaskForm);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const teamMembers = useMemo(() => (
        project?.teamMembers
            ?.map((member) => member.user)
            .filter(Boolean) || []
    ), [project]);

    const assignableUsers = useMemo(() => {
        const usersById = new Map();

        [...teamMembers, ...users].forEach((user) => {
            if (user?._id) {
                usersById.set(user._id, user);
            }
        });

        return Array.from(usersById.values()).sort((a, b) => (
            a.name.localeCompare(b.name)
        ));
    }, [teamMembers, users]);

    useEffect(() => {
        fetchProjectDetails();
    }, [projectId]);

    const fetchProjectDetails = async () => {
        setLoading(true);
        try {
            const [projectResponse, tasksResponse, usersResponse] = await Promise.all([
                projectService.getProjectById(projectId),
                taskService.getTasksByProject(projectId),
                authService.getAllUsers(),
            ]);

            if (projectResponse.success) {
                setProject(projectResponse.data.project);
            }

            if (tasksResponse.success) {
                setTasks(tasksResponse.data.tasks);
            }

            if (usersResponse.success) {
                setUsers(usersResponse.data.users);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load project');
            navigate('/projects');
        } finally {
            setLoading(false);
        }
    };

    const openCreateTaskModal = () => {
        setEditingTaskId(null);
        setTaskForm({
            ...emptyTaskForm,
            assignedTo: assignableUsers[0]?._id || '',
        });
        setShowTaskModal(true);
    };

    const openEditTaskModal = (task) => {
        setEditingTaskId(task._id);
        setTaskForm({
            title: task.title || '',
            description: task.description || '',
            assignedTo: task.assignedTo?._id || '',
            priority: task.priority || 'medium',
            status: task.status || 'todo',
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        });
        setShowTaskModal(true);
    };

    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const payload = {
                ...taskForm,
                assignedTo: taskForm.assignedTo || undefined,
                dueDate: taskForm.dueDate || undefined,
            };

            if (editingTaskId) {
                const response = await taskService.updateTask(
                    editingTaskId,
                    payload.title,
                    payload.description,
                    payload.status,
                    payload.priority,
                    payload.assignedTo,
                    payload.dueDate
                );

                if (response.success) {
                    setTasks((currentTasks) => currentTasks.map((task) => (
                        task._id === editingTaskId ? response.data.task : task
                    )));
                    toast.success('Task updated successfully');
                }
            } else {
                const response = await taskService.createTask(
                    payload.title,
                    payload.description,
                    projectId,
                    payload.assignedTo,
                    payload.priority,
                    payload.dueDate
                );

                if (response.success) {
                    setTasks((currentTasks) => [response.data.task, ...currentTasks]);
                    setProject((currentProject) => ({
                        ...currentProject,
                        taskCount: (currentProject.taskCount || 0) + 1,
                    }));
                    toast.success('Task assigned successfully');
                }
            }

            setShowTaskModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save task');
        } finally {
            setSubmitting(false);
        }
    };

    const handleTaskDelete = async (taskId) => {
        if (!window.confirm('Delete this task?')) return;

        try {
            const response = await taskService.deleteTask(taskId);
            if (response.success) {
                setTasks((currentTasks) => currentTasks.filter((task) => task._id !== taskId));
                setProject((currentProject) => ({
                    ...currentProject,
                    taskCount: Math.max((currentProject.taskCount || 1) - 1, 0),
                }));
                toast.success('Task deleted');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete task');
        }
    };

    const handleTaskStatusChange = async (task, status) => {
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
                setTasks((currentTasks) => currentTasks.map((item) => (
                    item._id === task._id ? response.data.task : item
                )));

                setProject((currentProject) => {
                    const completedDelta =
                        task.status !== 'completed' && status === 'completed'
                            ? 1
                            : task.status === 'completed' && status !== 'completed'
                                ? -1
                                : 0;

                    return {
                        ...currentProject,
                        completedTaskCount: Math.max((currentProject.completedTaskCount || 0) + completedDelta, 0),
                    };
                });

                toast.success('Task status updated');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update task status');
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate('/projects')}
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft size={18} />
                    <span>Back to projects</span>
                </button>

                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                        {project.description && (
                            <p className="text-gray-600 mt-2 max-w-3xl">{project.description}</p>
                        )}
                        <div className="flex flex-wrap gap-3 mt-4 text-sm text-gray-600">
                            <span>{project.taskCount || 0} tasks</span>
                            <span>{project.completedTaskCount || 0} completed</span>
                            <span>{teamMembers.length} members</span>
                        </div>
                    </div>
                    <button
                        onClick={openCreateTaskModal}
                        className="btn-primary inline-flex items-center justify-center gap-2"
                    >
                        <Plus size={20} />
                        <span>Add Task</span>
                    </button>
                </div>

                {assignableUsers.length === 0 && (
                    <div className="card p-4 mb-6 text-sm text-gray-600">
                        No registered users are available for assignment yet.
                    </div>
                )}

                {tasks.length === 0 ? (
                    <div className="card p-12 text-center">
                        <p className="text-gray-600 text-lg">No tasks yet. Add the first task for this project.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onEdit={openEditTaskModal}
                                onDelete={handleTaskDelete}
                                onStatusChange={handleTaskStatusChange}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={showTaskModal}
                onClose={() => setShowTaskModal(false)}
                title={editingTaskId ? 'Edit Task' : 'Add Task'}
                size="lg"
            >
                <form onSubmit={handleTaskSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Task Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={taskForm.title}
                            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                            className="input-field"
                            placeholder="Prepare design review"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={taskForm.description}
                            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                            className="input-field resize-none"
                            rows="3"
                            placeholder="Task details..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Assign To
                            </label>
                            <select
                                value={taskForm.assignedTo}
                                onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                                className="input-field"
                            >
                                <option value="">Unassigned</option>
                                {assignableUsers.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Priority
                            </label>
                            <select
                                value={taskForm.priority}
                                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                                className="input-field"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {editingTaskId && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={taskForm.status}
                                    onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="todo">Todo</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={taskForm.dueDate}
                                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                                className="input-field"
                            />
                        </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowTaskModal(false)}
                            className="btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn-primary flex-1 flex items-center justify-center space-x-2"
                        >
                            {submitting && <SmallSpinner size="sm" />}
                            <span>{submitting ? 'Saving...' : 'Save Task'}</span>
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
