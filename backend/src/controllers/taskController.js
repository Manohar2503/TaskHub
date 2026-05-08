import Task from '../models/Task.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/helpers.js';
import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES, TASK_STATUS, USER_ROLES } from '../config/constants.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const getMemberId = (member) => member.user?._id || member.user;

const isProjectMember = (project, userId) => (
    project.owner.equals(userId) ||
    project.teamMembers.some((member) => getMemberId(member).equals(userId))
);

const addAssigneeToProject = async (project, assignedTo) => {
    if (!assignedTo || isProjectMember(project, assignedTo)) {
        return;
    }

    const assignee = await User.findOne({ _id: assignedTo, isActive: true });

    if (!assignee) {
        throw new Error('Assignee must be an active registered user');
    }

    project.teamMembers.push({
        user: assignedTo,
        role: USER_ROLES.MEMBER,
    });
};

/**
 * Create Task
 */
export const createTask = asyncHandler(async (req, res) => {
    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;

    // Check if project exists and user has access
    const project = await Project.findById(projectId);

    if (!project) {
        return sendError(res, 'Project not found', HTTP_STATUS.NOT_FOUND);
    }

    const isMember = isProjectMember(project, req.userId);

    if (!isMember && req.userRole !== USER_ROLES.ADMIN) {
        return sendError(res, ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
    }

    try {
        await addAssigneeToProject(project, assignedTo);
    } catch (error) {
        return sendError(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }

    const task = new Task({
        title,
        description,
        project: projectId,
        assignedTo: assignedTo || null,
        createdBy: req.userId,
        priority,
        dueDate,
    });

    await task.save();
    await task.populate([
        { path: 'assignedTo', select: 'name email avatar' },
        { path: 'createdBy', select: 'name email avatar' },
        { path: 'project', select: 'name' },
    ]);

    // Update project task count
    project.taskCount += 1;
    await project.save();

    return sendSuccess(res, SUCCESS_MESSAGES.TASK_CREATED, { task }, HTTP_STATUS.CREATED);
});

/**
 * Get Tasks by Project
 */
export const getTasksByProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { status, priority, assignedTo } = req.query;

    // Check if project exists and user has access
    const project = await Project.findById(projectId);

    if (!project) {
        return sendError(res, 'Project not found', HTTP_STATUS.NOT_FOUND);
    }

    const isMember = isProjectMember(project, req.userId);

    if (!isMember && req.userRole !== USER_ROLES.ADMIN) {
        return sendError(res, ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
    }

    // Build filter
    const filter = { project: projectId };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter).sort({ dueDate: 1, priority: -1 });

    return sendSuccess(res, 'Tasks fetched successfully', { tasks });
});

/**
 * Get Task by ID
 */
export const getTaskById = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
        return sendError(res, ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Check if user has access to the project
    const project = await Project.findById(task.project);

    const isMember = isProjectMember(project, req.userId);

    if (!isMember && req.userRole !== USER_ROLES.ADMIN) {
        return sendError(res, ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
    }

    return sendSuccess(res, 'Task fetched successfully', { task });
});

/**
 * Update Task
 */
export const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { title, description, status, priority, assignedTo, dueDate } = req.body;

    let task = await Task.findById(taskId);

    if (!task) {
        return sendError(res, ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Check authorization
    const project = await Project.findById(task.project);

    const isMember = isProjectMember(project, req.userId);

    if (!isMember && req.userRole !== USER_ROLES.ADMIN) {
        return sendError(res, ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
    }

    try {
        await addAssigneeToProject(project, assignedTo);
    } catch (error) {
        return sendError(res, error.message, HTTP_STATUS.BAD_REQUEST);
    }

    const wasCompleted = task.status === TASK_STATUS.COMPLETED;

    // Update fields
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) {
        task.status = status;
        if (status === TASK_STATUS.COMPLETED && !wasCompleted) {
            task.completedAt = new Date();
            project.completedTaskCount += 1;
        } else if (status !== TASK_STATUS.COMPLETED && wasCompleted) {
            task.completedAt = null;
            project.completedTaskCount -= 1;
        }
    }
    if (priority) task.priority = priority;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
    if (dueDate !== undefined) task.dueDate = dueDate || null;

    // Check if task is overdue
    if (task.dueDate && task.status !== TASK_STATUS.COMPLETED && new Date() > new Date(task.dueDate)) {
        task.isOverdue = true;
    } else {
        task.isOverdue = false;
    }

    await task.save();
    await project.save();
    await task.populate([
        { path: 'assignedTo', select: 'name email avatar' },
        { path: 'createdBy', select: 'name email avatar' },
        { path: 'project', select: 'name' },
    ]);

    return sendSuccess(res, SUCCESS_MESSAGES.TASK_UPDATED, { task });
});

/**
 * Delete Task
 */
export const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
        return sendError(res, ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Check authorization
    const project = await Project.findById(task.project);

    const isOwner = task.createdBy.equals(req.userId);
    const isProjectOwner = project.owner.equals(req.userId);

    if (!isOwner && !isProjectOwner && req.userRole !== USER_ROLES.ADMIN) {
        return sendError(res, ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
    }

    // Update project task count
    if (task.status === TASK_STATUS.COMPLETED) {
        project.completedTaskCount -= 1;
    }
    project.taskCount -= 1;

    await Task.findByIdAndDelete(taskId);
    await project.save();

    return sendSuccess(res, SUCCESS_MESSAGES.TASK_DELETED, { taskId });
});

/**
 * Get Dashboard Stats
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
    // Get all projects where user is owner or member
    const projects = await Project.find({
        $or: [
            { owner: req.userId },
            { 'teamMembers.user': req.userId },
        ],
    });

    const projectIds = projects.map((p) => p._id);

    // Get task statistics
    const totalTasks = await Task.countDocuments({ project: { $in: projectIds } });
    const completedTasks = await Task.countDocuments({
        project: { $in: projectIds },
        status: TASK_STATUS.COMPLETED,
    });
    const pendingTasks = await Task.countDocuments({
        project: { $in: projectIds },
        status: { $ne: TASK_STATUS.COMPLETED },
    });
    const overdueTasks = await Task.countDocuments({
        project: { $in: projectIds },
        dueDate: { $lt: new Date() },
        status: { $ne: TASK_STATUS.COMPLETED },
    });

    // Get tasks by status
    const tasksByStatus = await Task.aggregate([
        { $match: { project: { $in: projectIds } } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Get tasks by priority
    const tasksByPriority = await Task.aggregate([
        { $match: { project: { $in: projectIds } } },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    return sendSuccess(res, 'Dashboard stats fetched successfully', {
        stats: {
            totalProjects: projects.length,
            totalTasks,
            completedTasks,
            pendingTasks,
            overdueTasks,
            completionPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        },
        tasksByStatus,
        tasksByPriority,
    });
});

/**
 * Add Comment to Task
 */
export const addComment = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
        return sendError(res, 'Comment text is required', HTTP_STATUS.BAD_REQUEST);
    }

    let task = await Task.findById(taskId);

    if (!task) {
        return sendError(res, ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Check authorization
    const project = await Project.findById(task.project);

    const isMember = isProjectMember(project, req.userId);

    if (!isMember && req.userRole !== USER_ROLES.ADMIN) {
        return sendError(res, ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
    }

    task.comments.push({
        user: req.userId,
        text,
    });

    await task.save();
    await task.populate({
        path: 'comments.user',
        select: 'name avatar',
    });

    return sendSuccess(res, 'Comment added successfully', { task }, HTTP_STATUS.CREATED);
});

/**
 * Get My Assigned Tasks
 */
export const getMyAssignedTasks = asyncHandler(async (req, res) => {
    const { status } = req.query;

    const filter = { assignedTo: req.userId };

    if (status) filter.status = status;

    const tasks = await Task.find(filter).sort({ dueDate: 1, priority: -1 });

    return sendSuccess(res, 'Your tasks fetched successfully', { tasks });
});
