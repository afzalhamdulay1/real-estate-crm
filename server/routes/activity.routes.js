import express from "express";
import {
  createActivity,
  getActivities,
  updateActivity,
  deleteActivity,
} from "../controllers/activity.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// Create activity (any logged-in user can create)
router.post("/", createActivity);

// Get all activities
router.get("/", getActivities);

// Update activity (admin/superadmin)
router.put("/:id", authorizeRoles("admin", "superadmin"), updateActivity);

// Delete activity (admin/superadmin)
router.delete("/:id", authorizeRoles("admin", "superadmin"), deleteActivity);

export default router;
