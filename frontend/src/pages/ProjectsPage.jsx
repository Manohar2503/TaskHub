import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService.js';
import { LoadingSpinner, SmallSpinner } from '../components/LoadingSpinner.jsx';
import { Modal } from '../components/Modal.jsx';
import { Plus, Trash2, Edit2, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProjectsPage = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
    });
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await projectService.getMyProjects();
            if (response.success) {
                setProjects(response.data.projects);
            }
        } catch (error) {
            toast.error('Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (project = null) => {
        if (project) {
            setEditingId(project._id);
            setFormData({
                name: project.name,
                description: project.description || '',
                startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
                endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
            });
        } else {
            setEditingId(null);
            setFormData({
                name: '',
                description: '',
                startDate: '',
                endDate: '',
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editingId) {
                const response = await projectService.updateProject(
                    editingId,
                    formData.name,
                    formData.description,
                    undefined,
                    formData.startDate,
                    formData.endDate
                );
                if (response.success) {
                    setProjects(projects.map((p) =>
                        p._id === editingId ? response.data.project : p
                    ));
                    toast.success('Project updated successfully');
                }
            } else {
                const response = await projectService.createProject(
                    formData.name,
                    formData.description,
                    formData.startDate,
                    formData.endDate
                );
                if (response.success) {
                    setProjects([...projects, response.data.project]);
                    toast.success('Project created successfully');
                }
            }
            setShowModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save project');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (projectId) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;

        try {
            const response = await projectService.deleteProject(projectId);
            if (response.success) {
                setProjects(projects.filter((p) => p._id !== projectId));
                toast.success('Project deleted successfully');
            }
        } catch (error) {
            toast.error('Failed to delete project');
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                        <p className="text-gray-600 mt-2">Manage your projects</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <Plus size={20} />
                        <span>New Project</span>
                    </button>
                </div>

                {/* Projects Grid */}
                {projects.length === 0 ? (
                    <div className="card p-12 text-center">
                        <p className="text-gray-600 text-lg">No projects yet. Create your first project!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project._id}
                                className="card p-6 hover:shadow-md transition cursor-pointer"
                                onClick={() => navigate(`/projects/${project._id}`)}
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                                            {project.name}
                                        </h3>
                                        {project.description && (
                                            <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                                                {project.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex space-x-2 ml-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenModal(project);
                                            }}
                                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(project._id);
                                            }}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tasks:</span>
                                        <span className="font-medium text-gray-900">{project.taskCount || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Completed:</span>
                                        <span className="font-medium text-green-600">{project.completedTaskCount || 0}</span>
                                    </div>
                                </div>

                                {/* Team Members */}
                                <div className="flex items-center space-x-2">
                                    <Users size={16} className="text-gray-500" />
                                    <span className="text-sm text-gray-600">
                                        {project.teamMembers?.length || 0} members
                                    </span>
                                </div>

                                {/* Status Badge */}
                                <div className="mt-4">
                                    <span className={`badge ${project.status === 'active'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingId ? 'Edit Project' : 'Create New Project'}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input-field"
                            placeholder="My Project"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input-field resize-none"
                            rows="3"
                            placeholder="Project description..."
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="input-field"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
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
                            <span>{submitting ? 'Saving...' : 'Save Project'}</span>
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
