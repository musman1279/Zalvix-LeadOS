import express from "express";

import {
    createLead,
    getAllLeads,
    getSingleLead,
    updateLead,
    deleteLead,
    assignLead,
    unassignLead,
    setLeadFollowUp,
    getTodayFollowUps,
    getUpcomingFollowUps,
    completeLeadFollowUp,
    cancelLeadFollowUp,
} from "../controllers/leadController.js";

import {
    protect,
    authorizeRoles,
} from "../middlewares/authMiddleware.js";

const router = express.Router();


// ==========================================
// Basic Lead Routes
// ==========================================

// Create Lead
router.post(
    "/",
    protect,
    createLead
);

// Get All Leads
router.get(
    "/",
    protect,
    getAllLeads
);


// ==========================================
// Follow-up Listing Routes
// IMPORTANT:
// These routes must come before /:id
// ==========================================

// Today's Follow-ups
router.get(
    "/follow-ups/today",
    protect,
    getTodayFollowUps
);

// Upcoming Follow-ups
router.get(
    "/follow-ups/upcoming",
    protect,
    getUpcomingFollowUps
);


// ==========================================
// Single Lead Routes
// ==========================================

// Get Single Lead
router.get(
    "/:id",
    protect,
    getSingleLead
);

// Update Lead
router.put(
    "/:id",
    protect,
    updateLead
);

// Delete Lead - Admin Only
router.delete(
    "/:id",
    protect,
    authorizeRoles("admin"),
    deleteLead
);


// ==========================================
// Lead Assignment Routes
// ==========================================

// Assign Lead - Admin Only
router.patch(
    "/:id/assign",
    protect,
    authorizeRoles("admin"),
    assignLead
);

// Unassign Lead - Admin Only
router.patch(
    "/:id/unassign",
    protect,
    authorizeRoles("admin"),
    unassignLead
);


// ==========================================
// Lead Follow-up Action Routes
// ==========================================

// Set / Update Follow-up
router.patch(
    "/:id/follow-up",
    protect,
    setLeadFollowUp
);

// Complete Follow-up
router.patch(
    "/:id/follow-up/complete",
    protect,
    completeLeadFollowUp
);

// Cancel Follow-up
router.patch(
    "/:id/follow-up/cancel",
    protect,
    cancelLeadFollowUp
);


export default router;