import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/helpers.js';
import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES, USER_ROLES } from '../config/constants.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * Create Project
 */
export const createProject = asyncHandler(async (req, res) => {
    const { name, description, startDate, endDate } = req.body;

    const project = new Project({
        name,
        description,
        startDate,
        endDate,
        owner: req.userId,
        teamMembers: [
            {
                user: req.userId,
                role: USER_ROLES.ADMIN,
            },
        ],
    });

    await project.save();
    await project.populate([
        { path: 'owner', select: 'name email avatar' },
        { path: 'teamMembers.user', select: 'name email avatar' },
    ]);

    return sendSuccess(res, SUCCESS_MESSAGES.PROJECT_CREATED, { project }, HTTP_STATUS.CREATED);
});

/**
 * Get All Projects of Current User
 */
export const getMyProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({
        $or: [
            { owner: req.userId },
            { 'teamMembers.user': req.userId },
        ],
    }).sort({ createdAt: -1 });

    return sendSuccess(res, 'Projects fetched successfully', { projects });
});

/**
 * Get Project by ID
 */
export const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
        return sendError(res, ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Check if user is part of the project
    const isMember = project.owner.equals(req.userId) ||
        project.teamMembers.some((m) => m.user.equals(req.userId));

    if (!isMember && req.userRole !== USER_ROLES.ADMIN) {
        return sendError(res, ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
    }

    return sendSuccess(res, 'Project fetched successfully', { project });
});

/**
 * Update Project
 */
export const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { name, description, status, startDate, endDate } = req.body;

    let project = await Project.findById(projectId);

    if (!project) {
        return sendError(res, ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Check authorization
    const isOwner = project.owner.equals(req.userId);
    if (!isOwner && req.userRole !== USER_ROLES.ADMIN) {
        return sendError(res, ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
    }

    // Update fields
    if (name) project.name = name;
    if (description) project.description = description;
    if (status) project.status = status;
    if (startDate) project.startDate = startDate;
    if (endDate) project.endDate = endDate;

    await project.save();

    return sendSuccess(res, SUCCESS_MESSAGES.PROJECT_UPDATED, { project });
});

/**
 * Delete Project
 */
export const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
        return sendError(res, ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Check authorization
    const isOwner = project.owner.equals(req.userId);
    if (!isOwner && req.userRole !== USER_ROLES.ADMIN) {
        return sendError(res, ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
    }

    // Delete all tasks in the project
    await Task.deleteMany({ project: projectId });

    // Delete project
    await Project.findByIdAndDelete(projectId);

    return sendSuccess(res, SUCCESS_MESSAGES.PROJECT_DELETED, { projectId });
});

/**
 * Add Team Member
 */
export const addTeamMember = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { userId, role } = req.body;

    let project = await Project.findById(projectId);

    if (!project) {
        return sendError(res, ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Check authorization
    const isOwner = project.owner.equals(req.userId);
    if (!isOwner && req.userRole !== USER_ROLES.ADMIN) {
        return sendError(res, ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        return sendError(res, 'User not found', HTTP_STATUS.NOT_FOUND);
    }

    // Check if already a member
    const alreadyMember = project.teamMembers.some((m) => m.user.equals(userId));
    if (alreadyMember) {
        return sendError(res, 'User is already a member', HTTP_STATUS.CONFLICT);
    }

    // Add member
    project.teamMembers.push({
        user: userId,
        role: role || USER_ROLES.MEMBER,
    });

    await project.save();
    await project.populate([
        { path: 'owner', select: 'name email avatar' },
        { path: 'teamMembers.user', select: 'name email avatar' },
    ]);

    return sendSuccess(res, 'Team member added successfully', { project }, HTTP_STATUS.CREATED);
});

/**
 * Remove Team Member
 */
export const removeTeamMember = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.params;

    let project = await Project.findById(projectId);

    if (!project) {
        return sendError(res, ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Check authorization
    const isOwner = project.owner.equals(req.userId);
    if (!isOwner && req.userRole !== USER_ROLES.ADMIN) {
        return sendError(res, ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
    }

    // Don't allow removing owner
    if (project.owner.equals(userId)) {
        return sendError(res, 'Cannot remove project owner', HTTP_STATUS.BAD_REQUEST);
    }

    // Remove member
    project.teamMembers = project.teamMembers.filter(
        (m) => !m.user.equals(userId)
    );

    await project.save();

    return sendSuccess(res, 'Team member removed successfully', { project });
});

/**
 * Update Team Member Role
 */
export const updateTeamMemberRole = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.params;
    const { role } = req.body;

    let project = await Project.findById(projectId);

    if (!project) {
        return sendError(res, ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Check authorization
    const isOwner = project.owner.equals(req.userId);
    if (!isOwner && req.userRole !== USER_ROLES.ADMIN) {
        return sendError(res, ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
    }

    // Find and update member
    const member = project.teamMembers.find((m) => m.user.equals(userId));

    if (!member) {
        return sendError(res, 'Member not found in project', HTTP_STATUS.NOT_FOUND);
    }

    member.role = role;
    await project.save();

    return sendSuccess(res, 'Member role updated successfully', { project });
});
