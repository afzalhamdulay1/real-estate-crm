import express from "express";
import {
  leadDashboard,
  activityDashboard,
} from "../controllers/dashboard.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Only admins & superadmins can view dashboard
router.use(protect);
router.use(authorizeRoles("admin", "superadmin"));

router.get("/leads", leadDashboard);
router.get("/activities", activityDashboard);

export default router;
