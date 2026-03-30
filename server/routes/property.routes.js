import express from "express";
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../controllers/property.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { auditMiddleware } from "../middleware/audit.middleware.js";

const router = express.Router();
router.use(protect);

// Only admin/superadmin can create, update, delete properties
router.post(
  "/",
  authorizeRoles("admin", "superadmin"),
  auditMiddleware("CREATE", "PROPERTY"),
  createProperty,
);
router.put(
  "/:id",
  authorizeRoles("admin", "superadmin"),
  auditMiddleware("UPDATE", "PROPERTY"),
  updateProperty,
);
router.delete(
  "/:id",
  authorizeRoles("admin", "superadmin"),
  auditMiddleware("DELETE", "PROPERTY"),
  deleteProperty,
);

// All logged-in users can view properties
router.get("/", getProperties);
router.get("/:id", getPropertyById);

export default router;
