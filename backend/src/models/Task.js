import mongoose from 'mongoose';
import { TASK_STATUS, TASK_PRIORITY } from '../config/constants.js';

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
            minlength: [3, 'Task title must be at least 3 characters'],
            maxlength: [100, 'Task title cannot exceed 100 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, 'Description cannot exceed 1000 characters'],
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: [true, 'Task must belong to a project'],
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Task creator is required'],
        },
        status: {
            type: String,
            enum: Object.values(TASK_STATUS),
            default: TASK_STATUS.TODO,
        },
        priority: {
            type: String,
            enum: Object.values(TASK_PRIORITY),
            default: TASK_PRIORITY.MEDIUM,
        },
        dueDate: {
            type: Date,
            default: null,
        },
        isOverdue: {
            type: Boolean,
            default: false,
        },
        completedAt: {
            type: Date,
            default: null,
        },
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                text: String,
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Middleware to populate related fields
taskSchema.pre(/^find/, function (next) {
    if (this.options._recursed) {
        return next();
    }
    this.populate({
        path: 'assignedTo',
        select: 'name email avatar',
    })
        .populate({
            path: 'createdBy',
            select: 'name email avatar',
        })
        .populate({
            path: 'project',
            select: 'name',
        })
        .populate({
            path: 'comments.user',
            select: 'name avatar',
        });
    next();
});

// Virtual for checking if task is overdue
taskSchema.virtual('isTaskOverdue').get(function () {
    if (this.dueDate && this.status !== TASK_STATUS.COMPLETED) {
        return new Date() > this.dueDate;
    }
    return false;
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
