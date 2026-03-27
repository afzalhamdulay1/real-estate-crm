import { getAuditLogsService } from "../services/audit.service.js";

// Get audit logs
export const getAuditLogs = async (req, res) => {
  try {
    const filters = {
      user: req.query.user,
      module: req.query.module,
      action: req.query.action,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const options = {
      page: req.query.page,
      limit: req.query.limit,
    };

    const result = await getAuditLogsService(filters, options);

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
