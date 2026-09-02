import Lead from "../models/Lead.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import User from "../models/User.js";


// ==========================================
// Create Lead
// ==========================================

export const createLead = catchAsync(async (req, res, next) => {

    // Get lead data from request body
    const {
        name,
        email,
        phone,
        company,
        jobTitle,
        source,
        notes,
    } = req.body;


    // Validate required fields
    if (!name || !email) {
        return next(
            new ApiError(
                "Lead name and email are required",
                400
            )
        );
    }


    // Create lead
    const lead = await Lead.create({
        name,
        email,
        phone,
        company,
        jobTitle,
        source,
        notes,

        // Logged-in user becomes creator
        createdBy: req.user._id,
    });


    // Response
    res.status(201).json({
        success: true,
        message: "Lead created successfully",
        lead,
    });
});


// ==========================================
// Get All Leads
// ==========================================

export const getAllLeads = catchAsync(async (req, res, next) => {

    const {
        search,
        status,
        source,
        sort,
    } = req.query;


    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;


    // Base filter
    const filter = {};


    // ==========================================
    // Role Based Lead Access
    // ==========================================

    // Admin can see all leads
    // Sales user can only see assigned leads
    if (req.user.role !== "admin") {
        filter.assignedTo = req.user._id;
    }


    // ==========================================
    // Search
    // ==========================================

    if (search) {
        filter.$or = [
            {
                name: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                email: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                company: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                phone: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }


    // ==========================================
    // Status Filter
    // ==========================================

    if (status) {
        filter.status = status;
    }


    // ==========================================
    // Source Filter
    // ==========================================

    if (source) {
        filter.source = source;
    }


    // ==========================================
    // Allowed Sorting Fields
    // ==========================================

    const allowedSortFields = [
        "createdAt",
        "name",
        "email",
        "company",
        "status",
        "source",
    ];


    let sortBy = "-createdAt";


    if (sort) {

        const field = sort.startsWith("-")
            ? sort.slice(1)
            : sort;

        if (allowedSortFields.includes(field)) {
            sortBy = sort;
        }
    }


    // ==========================================
    // Total Leads
    // ==========================================

    const totalLeads = await Lead.countDocuments(filter);


    // ==========================================
    // Get Leads
    // ==========================================

    const leads = await Lead.find(filter)
        .populate(
            "createdBy",
            "name email"
        )
        .populate(
            "assignedTo",
            "name email"
        )
        .sort(sortBy)
        .skip(skip)
        .limit(limit);


    // ==========================================
    // Total Pages
    // ==========================================

    const totalPages = Math.ceil(
        totalLeads / limit
    );


    // ==========================================
    // Response
    // ==========================================

    res.status(200).json({
        success: true,
        totalLeads,
        totalPages,
        currentPage: page,
        limit,
        count: leads.length,
        leads,
    });
});


// ==========================================
// Get Single Lead
// ==========================================

export const getSingleLead = catchAsync(
    async (req, res, next) => {

        const lead = await Lead.findById(
            req.params.id
        )
            .populate(
                "createdBy",
                "name email"
            )
            .populate(
                "assignedTo",
                "name email"
            );


        if (!lead) {
            return next(
                new ApiError(
                    "Lead not found",
                    404
                )
            );
        }


        res.status(200).json({
            success: true,
            lead,
        });
    }
);


// ==========================================
// Update Lead
// ==========================================

export const updateLead = catchAsync(
    async (req, res, next) => {

        const {
            name,
            email,
            phone,
            company,
            jobTitle,
            source,
            status,
            notes,
        } = req.body;


        // Find lead
        const lead = await Lead.findById(
            req.params.id
        );


        if (!lead) {
            return next(
                new ApiError(
                    "Lead not found",
                    404
                )
            );
        }


        // Update only provided fields
        lead.name = name ?? lead.name;
        lead.email = email ?? lead.email;
        lead.phone = phone ?? lead.phone;
        lead.company = company ?? lead.company;
        lead.jobTitle = jobTitle ?? lead.jobTitle;
        lead.source = source ?? lead.source;
        lead.status = status ?? lead.status;
        lead.notes = notes ?? lead.notes;


        await lead.save();


        // Populate assigned user
        await lead.populate(
            "assignedTo",
            "name email"
        );


        res.status(200).json({
            success: true,
            message: "Lead updated successfully",
            lead,
        });
    }
);


// ==========================================
// Delete Lead
// ==========================================

export const deleteLead = catchAsync(
    async (req, res, next) => {

        const lead = await Lead.findById(
            req.params.id
        );


        if (!lead) {
            return next(
                new ApiError(
                    "Lead not found",
                    404
                )
            );
        }


        await lead.deleteOne();


        res.status(200).json({
            success: true,
            message: "Lead deleted successfully",
        });
    }
);


// ==========================================
// Assign Lead to User
// ==========================================

export const assignLead = catchAsync(
    async (req, res, next) => {

        const { userId } = req.body;


        // Validate user ID
        if (!userId) {
            return next(
                new ApiError(
                    "User ID is required",
                    400
                )
            );
        }


        // Find Lead
        const lead = await Lead.findById(
            req.params.id
        );


        if (!lead) {
            return next(
                new ApiError(
                    "Lead not found",
                    404
                )
            );
        }


        // Find User
        const user = await User.findById(
            userId
        );


        if (!user) {
            return next(
                new ApiError(
                    "User not found",
                    404
                )
            );
        }


        // Assign user
        lead.assignedTo = user._id;


        await lead.save();


        // Populate assigned user
        await lead.populate(
            "assignedTo",
            "name email"
        );


        res.status(200).json({
            success: true,
            message: "Lead assigned successfully",
            lead,
        });
    }
);


// ==========================================
// Unassign Lead
// ==========================================

export const unassignLead = catchAsync(
    async (req, res, next) => {

        // Find Lead
        const lead = await Lead.findById(
            req.params.id
        );


        // Check Lead Exists
        if (!lead) {
            return next(
                new ApiError(
                    "Lead not found",
                    404
                )
            );
        }


        // Remove assigned user
        lead.assignedTo = null;


        await lead.save();


        res.status(200).json({
            success: true,
            message: "Lead unassigned successfully",
            lead,
        });
    }
);


// ==========================================
// Set / Update Lead Follow-up
// ==========================================

export const setLeadFollowUp = catchAsync(
    async (req, res, next) => {

        const { id } = req.params;
        const { followUpDate } = req.body;


        // Check follow-up date
        if (!followUpDate) {
            return next(
                new ApiError(
                    "Follow-up date is required",
                    400
                )
            );
        }


        // Validate date
        const parsedDate = new Date(
            followUpDate
        );


        if (isNaN(parsedDate.getTime())) {
            return next(
                new ApiError(
                    "Invalid follow-up date",
                    400
                )
            );
        }


        // Find Lead
        const lead = await Lead.findById(id);


        if (!lead) {
            return next(
                new ApiError(
                    "Lead not found",
                    404
                )
            );
        }


        // Permission Check
        // Admin OR assigned sales user
        if (
            req.user.role !== "admin" &&
            lead.assignedTo?.toString() !==
                req.user._id.toString()
        ) {
            return next(
                new ApiError(
                    "You are not authorized to set follow-up for this lead",
                    403
                )
            );
        }


        // Update Follow-up
        lead.followUpDate = parsedDate;
        lead.followUpStatus = "pending";


        await lead.save();


        // Populate assigned user
        await lead.populate(
            "assignedTo",
            "name email"
        );


        res.status(200).json({
            success: true,
            message: "Lead follow-up set successfully",
            lead,
        });
    }
);


// ==========================================
// Get Today's Follow-ups
// ==========================================

export const getTodayFollowUps = catchAsync(
    async (req, res, next) => {

        // Start of today
        const startOfToday = new Date();

        startOfToday.setHours(
            0,
            0,
            0,
            0
        );


        // End of today
        const endOfToday = new Date();

        endOfToday.setHours(
            23,
            59,
            59,
            999
        );


        // Base filter
        const filter = {
            followUpDate: {
                $gte: startOfToday,
                $lte: endOfToday,
            },

            followUpStatus: "pending",
        };


        // Sales user can only see
        // their assigned leads
        if (req.user.role !== "admin") {
            filter.assignedTo = req.user._id;
        }


        // Get today's follow-ups
        const leads = await Lead.find(filter)
            .populate(
                "createdBy",
                "name email"
            )
            .populate(
                "assignedTo",
                "name email"
            )
            .sort("followUpDate");


        res.status(200).json({
            success: true,
            count: leads.length,
            leads,
        });
    }
);


// ==========================================
// Get Upcoming Follow-ups
// ==========================================

export const getUpcomingFollowUps = catchAsync(
    async (req, res, next) => {

        // End of today
        const endOfToday = new Date();

        endOfToday.setHours(
            23,
            59,
            59,
            999
        );


        // Base filter
        const filter = {
            followUpDate: {
                $gt: endOfToday,
            },

            followUpStatus: "pending",
        };


        // Sales user can only see
        // their assigned leads
        if (req.user.role !== "admin") {
            filter.assignedTo = req.user._id;
        }


        // Get upcoming follow-ups
        const leads = await Lead.find(filter)
            .populate(
                "createdBy",
                "name email"
            )
            .populate(
                "assignedTo",
                "name email"
            )
            .sort("followUpDate");


        res.status(200).json({
            success: true,
            count: leads.length,
            leads,
        });
    }
);


// ==========================================
// Complete Follow-up
// ==========================================

export const completeLeadFollowUp = catchAsync(
    async (req, res, next) => {

        const { id } = req.params;


        // Find Lead
        const lead = await Lead.findById(id);


        if (!lead) {
            return next(
                new ApiError(
                    "Lead not found",
                    404
                )
            );
        }


        // Permission Check
        if (
            req.user.role !== "admin" &&
            lead.assignedTo?.toString() !==
                req.user._id.toString()
        ) {
            return next(
                new ApiError(
                    "You are not authorized to complete this follow-up",
                    403
                )
            );
        }


        // Check follow-up exists
        if (!lead.followUpDate) {
            return next(
                new ApiError(
                    "No follow-up is scheduled for this lead",
                    400
                )
            );
        }


        // Complete follow-up
        lead.followUpStatus = "completed";


        await lead.save();


        // Populate assigned user
        await lead.populate(
            "assignedTo",
            "name email"
        );


        res.status(200).json({
            success: true,
            message:
                "Lead follow-up completed successfully",
            lead,
        });
    }
);


// ==========================================
// Cancel Follow-up
// ==========================================

export const cancelLeadFollowUp = catchAsync(
    async (req, res, next) => {

        const { id } = req.params;


        // Find Lead
        const lead = await Lead.findById(id);


        if (!lead) {
            return next(
                new ApiError(
                    "Lead not found",
                    404
                )
            );
        }


        // Permission Check
        if (
            req.user.role !== "admin" &&
            lead.assignedTo?.toString() !==
                req.user._id.toString()
        ) {
            return next(
                new ApiError(
                    "You are not authorized to cancel this follow-up",
                    403
                )
            );
        }


        // Check follow-up exists
        if (!lead.followUpDate) {
            return next(
                new ApiError(
                    "No follow-up is scheduled for this lead",
                    400
                )
            );
        }


        // Cancel follow-up
        lead.followUpStatus = "cancelled";


        await lead.save();


        // Populate assigned user
        await lead.populate(
            "assignedTo",
            "name email"
        );


        res.status(200).json({
            success: true,
            message:
                "Lead follow-up cancelled successfully",
            lead,
        });
    }
);