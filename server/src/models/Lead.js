import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Lead name is required"],
            trim: true,
            minlength: [2, "Lead name must be at least 2 characters"],
            maxlength: [100, "Lead name cannot exceed 100 characters"],
        },

        email: {
            type: String,
            required: [true, "Lead email is required"],
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            trim: true,
            default: "",
        },

        company: {
            type: String,
            trim: true,
            default: "",
        },

        jobTitle: {
            type: String,
            trim: true,
            default: "",
        },

        source: {
            type: String,
            enum: [
                "website",
                "linkedin",
                "facebook",
                "instagram",
                "referral",
                "email",
                "cold-call",
                "other",
            ],
            default: "website",
        },

        status: {
            type: String,
            enum: [
                "new",
                "contacted",
                "qualified",
                "proposal",
                "converted",
                "lost",
            ],
            default: "new",
        },

        notes: {
            type: String,
            trim: true,
            default: "",
        },

        // Follow-up date
        followUpDate: {
            type: Date,
            default: null,
        },

        // Follow-up status
        followUpStatus: {
            type: String,
            enum: [
                "pending",
                "completed",
                "cancelled",
            ],
            default: "pending",
        },

        // Lead creator
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // Assigned sales user
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;