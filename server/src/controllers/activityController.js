import Activity from "../models/Activity.js";
import Lead from "../models/Lead.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";

// =====================================================
// Create Activity
// =====================================================
export const createActivity = catchAsync(
    async (req, res, next) => {
        const { leadId } = req.params;
        const { type, description } = req.body;

        // Check if Lead exists
        const lead = await Lead.findById(leadId);

        if (!lead) {
            return next(
                new ApiError(
                    "Lead not found",
                    404
                )
            );
        }

        // Admin can access any lead
        // Sales user can access only assigned lead
        if (
            req.user.role !== "admin" &&
            lead.assignedTo?.toString() !==
                req.user._id.toString()
        ) {
            return next(
                new ApiError(
                    "You are not authorized to add activity to this lead",
                    403
                )
            );
        }

        // Create Activity
        const activity = await Activity.create({
            lead: leadId,
            type,
            description,
            createdBy: req.user._id,
        });

        // Populate creator information
        await activity.populate(
            "createdBy",
            "name email"
        );

        res.status(201).json({
            success: true,
            message:
                "Activity created successfully",
            activity,
        });
    }
);

// =====================================================
// Get Activities By Lead
// =====================================================
export const getLeadActivities = catchAsync(
    async (req, res, next) => {
        const { leadId } = req.params;

        // Check if Lead exists
        const lead = await Lead.findById(
            leadId
        );

        if (!lead) {
            return next(
                new ApiError(
                    "Lead not found",
                    404
                )
            );
        }

        // Admin can view any lead
        // Sales user can view only assigned lead
        if (
            req.user.role !== "admin" &&
            lead.assignedTo?.toString() !==
                req.user._id.toString()
        ) {
            return next(
                new ApiError(
                    "You are not authorized to view activities of this lead",
                    403
                )
            );
        }

        // Get Activities
        const activities =
            await Activity.find({
                lead: leadId,
            })
                .populate(
                    "createdBy",
                    "name email"
                )
                .sort("-createdAt");

        res.status(200).json({
            success: true,
            count: activities.length,
            activities,
        });
    }
);

// =====================================================
// Update Activity
// =====================================================
export const updateActivity = catchAsync(
    async (req, res, next) => {
        const { activityId } = req.params;
        const {
            type,
            description,
        } = req.body;

        // Find Activity
        const activity =
            await Activity.findById(
                activityId
            );

        if (!activity) {
            return next(
                new ApiError(
                    "Activity not found",
                    404
                )
            );
        }

        // Permission Check
        // Admin can update any activity
        // Normal user can update only
        // their own activity
        if (
            req.user.role !== "admin" &&
            activity.createdBy.toString() !==
                req.user._id.toString()
        ) {
            return next(
                new ApiError(
                    "You are not authorized to update this activity",
                    403
                )
            );
        }

        // Update only provided fields
        if (type !== undefined) {
            activity.type = type;
        }

        if (description !== undefined) {
            activity.description =
                description;
        }

        await activity.save();

        // Populate creator
        await activity.populate(
            "createdBy",
            "name email"
        );

        res.status(200).json({
            success: true,
            message:
                "Activity updated successfully",
            activity,
        });
    }
);

// =====================================================
// Delete Activity
// =====================================================
export const deleteActivity = catchAsync(
    async (req, res, next) => {
        const { activityId } = req.params;

        // Find Activity
        const activity =
            await Activity.findById(
                activityId
            );

        if (!activity) {
            return next(
                new ApiError(
                    "Activity not found",
                    404
                )
            );
        }

        // Admin can delete any activity
        // Normal user can delete only
        // their own activity
        if (
            req.user.role !== "admin" &&
            activity.createdBy.toString() !==
                req.user._id.toString()
        ) {
            return next(
                new ApiError(
                    "You are not authorized to delete this activity",
                    403
                )
            );
        }

        // Delete Activity
        await activity.deleteOne();

        res.status(200).json({
            success: true,
            message:
                "Activity deleted successfully",
        });
    }
);