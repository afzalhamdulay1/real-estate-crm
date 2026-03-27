import express from "express";
import { getAuditLogs } from "../controllers/audit.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Only admin & superadmin can access logs
router.use(protect);
router.use(authorizeRoles("admin", "superadmin"));

router.get("/", getAuditLogs);

export default router;
