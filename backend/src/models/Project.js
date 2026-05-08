import mongoose from 'mongoose';
import { USER_ROLES } from '../config/constants.js';

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Project name is required'],
            trim: true,
            minlength: [3, 'Project name must be at least 3 characters'],
            maxlength: [100, 'Project name cannot exceed 100 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Project owner is required'],
        },
        teamMembers: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                role: {
                    type: String,
                    enum: Object.values(USER_ROLES),
                    default: USER_ROLES.MEMBER,
                },
                joinedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        status: {
            type: String,
            enum: ['active', 'archived'],
            default: 'active',
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
            default: null,
        },
        taskCount: {
            type: Number,
            default: 0,
        },
        completedTaskCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Virtual for populating team members
projectSchema.virtual('teamMembersPopulated', {
    ref: 'User',
    localField: 'teamMembers.user',
    foreignField: '_id',
});

// Middleware to populate team members
projectSchema.pre(/^find/, function (next) {
    if (this.options._recursed) {
        return next();
    }
    this.populate({
        path: 'owner',
        select: 'name email avatar role',
    });
    this.populate({
        path: 'teamMembers.user',
        select: 'name email avatar role',
    });
    next();
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
