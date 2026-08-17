import express from "express";
import { adminDashboard } from "../controllers/adminController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
    "/dashboard",
    protect,
    authorizeRoles("admin"),
    adminDashboard
);

export default router;