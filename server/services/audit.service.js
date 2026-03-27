import AuditLog from "../models/auditLog.model.js";

// Create audit log (used internally by other services)
export const createAuditLog = async ({
  user,
  action,
  module,
  documentId,
  changes,
}) => {
  try {
    await AuditLog.create({
      user,
      action,
      module,
      documentId,
      changes,
    });
  } catch (error) {
    console.error("Audit log error:", error.message);
  }
};

// Get audit logs with optional filters + pagination
export const getAuditLogsService = async (filters = {}, options = {}) => {
  const query = {};

  // Filters
  if (filters.user) query.user = filters.user;
  if (filters.module) query.module = filters.module;
  if (filters.action) query.action = filters.action;

  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
    if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
  }

  // Pagination
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await AuditLog.countDocuments(query);

  const logs = await AuditLog.find(query)
    .populate("user", "name email role")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    logs,
  };
};
