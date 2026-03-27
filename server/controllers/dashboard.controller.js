import {
  getLeadMetrics,
  getActivityMetrics,
} from "../services/dashboard.service.js";

export const leadDashboard = async (req, res) => {
  try {
    const data = await getLeadMetrics();
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const activityDashboard = async (req, res) => {
  try {
    const data = await getActivityMetrics();
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
