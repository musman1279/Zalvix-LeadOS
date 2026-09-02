import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
    {
        // Lead associated with this activity
        lead: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lead",
            required: [
                true,
                "Lead is required",
            ],
        },

        // Activity type
        type: {
            type: String,
            enum: [
                "call",
                "email",
                "meeting",
                "note",
                "follow-up",
            ],
            required: [
                true,
                "Activity type is required",
            ],
        },

        // Activity details
        description: {
            type: String,
            required: [
                true,
                "Activity description is required",
            ],
            trim: true,
            minlength: [
                2,
                "Description must be at least 2 characters",
            ],
            maxlength: [
                1000,
                "Description cannot exceed 1000 characters",
            ],
        },

        // User who created the activity
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [
                true,
                "Activity creator is required",
            ],
        },
    },
    {
        timestamps: true,
    }
);

const Activity = mongoose.model(
    "Activity",
    activitySchema
);

export default Activity;