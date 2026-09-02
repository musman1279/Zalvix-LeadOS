import express from "express";

import {
    createActivity,
    getLeadActivities,
    updateActivity,
    deleteActivity,
} from "../controllers/activityController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create Activity
router.post(
    "/leads/:leadId/activities",
    protect,
    createActivity
);

// Get Lead Activities
router.get(
    "/leads/:leadId/activities",
    protect,
    getLeadActivities
);

// Update Activity
router.patch(
    "/activities/:activityId",
    protect,
    updateActivity
);

// Delete Activity
router.delete(
    "/activities/:activityId",
    protect,
    deleteActivity
);

export default router;