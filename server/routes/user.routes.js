import express from "express";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  createUser,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { auditMiddleware } from "../middleware/audit.middleware.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("admin", "superadmin")); // Entire module restricted to admins

// User management routes
router.post(
  "/",
  auditMiddleware("CREATE", "USER"),
  createUser,
);

router.get("/", getAllUsers);

router.put(
  "/:id/role",
  auditMiddleware("UPDATE", "USER"),
  updateUserRole,
);

router.delete(
  "/:id",
  auditMiddleware("DELETE", "USER"),
  deleteUser,
);

export default router;
