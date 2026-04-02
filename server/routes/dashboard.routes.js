import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getDashboardStats, getTrajectoryData } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/stats", protect, getDashboardStats);
router.get("/trajectory", protect, getTrajectoryData);

export default router;
