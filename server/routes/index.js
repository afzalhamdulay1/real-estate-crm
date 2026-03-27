import express from "express";
import authRoutes from "./auth.routes.js";
import leadRoutes from "./lead.routes.js";
import activityRoutes from "./activity.routes.js";
import propertyRoutes from "./property.routes.js";
import auditRoutes from "./audit.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/leads", leadRoutes);
router.use("/activities", activityRoutes);
router.use("/audit-logs", auditRoutes);
router.use("/properties", propertyRoutes);

export default router;
