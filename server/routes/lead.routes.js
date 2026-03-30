import express from "express";
import {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
} from "../controllers/lead.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { auditMiddleware } from "../middleware/audit.middleware.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// Get all leads (agents can see their leads, admins see all)
router.get("/", getLeads);

// Get single lead
router.get("/:id", getLead);

// Create lead (agent/admin/superadmin)
router.post(
  "/",
  authorizeRoles("agent", "admin", "superadmin"),
  auditMiddleware("CREATE", "LEAD"),
  createLead,
);

// Update lead (admin/superadmin only)
router.put(
  "/:id",
  authorizeRoles("admin", "superadmin"),
  auditMiddleware("UPDATE", "LEAD"),
  updateLead,
);

// Delete lead (admin/superadmin only)
router.delete(
  "/:id",
  authorizeRoles("admin", "superadmin"),
  auditMiddleware("DELETE", "LEAD"),
  deleteLead,
);

export default router;
