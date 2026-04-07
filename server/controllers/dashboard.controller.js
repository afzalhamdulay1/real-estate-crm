import Lead from "../models/lead.model.js";
import Property from "../models/property.model.js";
import Activity from "../models/activity.model.js";
import AuditLog from "../models/auditLog.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const { period = "monthly" } = req.query;
    const totalLeads = await Lead.countDocuments();

    const activeProperties = await Property.countDocuments({ status: "Available" });

    const closedLeads = await Lead.countDocuments({ status: "Closed" });
    const closingRate = totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(1) : 0;

    const revenueData = await Lead.aggregate([
      { $match: { status: "Closed", dealValue: { $exists: true, $ne: null } } },
      { $group: { _id: null, total: { $sum: "$dealValue" } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;


    const recentActivities = await AuditLog.find()
      .populate("user", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(5);

    const topPropertyData = await Lead.aggregate([
      { $match: { property: { $exists: true, $ne: null } } },
      { $group: { _id: "$property", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    let topProperty = null;
    if (topPropertyData.length > 0) {
      topProperty = await Property.findById(topPropertyData[0]._id).select("title price location type");
    }

    // Dynamic Market Pulse Calculation
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 30);
    const recentLeadsCount = await Lead.countDocuments({ createdAt: { $gte: sixtyDaysAgo } });
    const buyerInterest = totalLeads > 0 ? Math.min(100, Math.round((recentLeadsCount / totalLeads) * 100)) : 0;

    const totalProperties = await Property.countDocuments();
    const nonAvailableProperties = await Property.countDocuments({ status: { $in: ["Sold", "Rented"] } });
    const listingVelocity = totalProperties > 0 ? Math.round((nonAvailableProperties / totalProperties) * 100) : 0;

    // Pipeline Breakdown (Lead Statuses)
    const leadStatusData = await Lead.aggregate([
      { $group: { _id: "$status", value: { $sum: 1 } } },
      { $project: { name: "$_id", value: 1, _id: 0 } }
    ]);

    // Portfolio Breakdown (Property Types)
    const propertyTypeData = await Property.aggregate([
      { $group: { _id: "$type", value: { $sum: 1 } } },
      { $project: { name: "$_id", value: 1, _id: 0 } }
    ]);

    // Multi-Series Performance Trajectory (Captured vs Closed, New vs Moved)
    const trajectoryData = [];
    const inventoryTrajectory = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const refDate = new Date();

    const iterations = period === "daily" ? 7 : 6;

    for (let i = iterations - 1; i >= 0; i--) {
      let startD, endD, label;

      if (period === "daily") {
        startD = new Date(refDate);
        startD.setDate(refDate.getDate() - i);
        startD.setHours(0, 0, 0, 0);

        endD = new Date(startD);
        endD.setHours(23, 59, 59, 999);

        label = days[startD.getDay()];
      } else {
        const d = new Date(refDate.getFullYear(), refDate.getMonth() - i, 1);
        startD = new Date(d.getFullYear(), d.getMonth(), 1);
        endD = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        endD.setHours(23, 59, 59, 999);

        label = months[startD.getMonth()];
      }

      // Lead Metrics
      const revenueBatch = await Lead.aggregate([
        { $match: { status: "Closed", updatedAt: { $gte: startD, $lte: endD } } },
        { $group: { _id: null, total: { $sum: "$dealValue" } } }
      ]);
      const captured = await Lead.countDocuments({ createdAt: { $gte: startD, $lte: endD } });
      const closed = await Lead.countDocuments({ status: "Closed", updatedAt: { $gte: startD, $lte: endD } });

      // Inventory Metrics
      const added = await Property.countDocuments({ createdAt: { $gte: startD, $lte: endD } });
      const moved = await Property.countDocuments({ status: { $in: ["Sold", "Rented"] }, updatedAt: { $gte: startD, $lte: endD } });

      trajectoryData.push({
        name: label,
        revenue: revenueBatch.length > 0 ? revenueBatch[0].total : 0,
        captured,
        closed
      });

      inventoryTrajectory.push({
        name: label,
        added,
        moved
      });
    }

    res.status(200).json({
      success: true,
      stats: {
        totalLeads,
        activeProperties,
        closingRate: `${closingRate}%`,
        totalRevenue: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(totalRevenue),
        buyerInterest,
        listingVelocity,
        closingProbability: parseFloat(closingRate) || 0
      },
      recentActivities,
      topProperty,
      trajectoryData,
      inventoryTrajectory,
      leadStatusData,
      propertyTypeData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTrajectoryData = async (req, res) => {
  try {
    const { period = "monthly" } = req.query;
    const trajectoryData = [];
    const inventoryTrajectory = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const refDate = new Date();

    const iterations = period === "daily" ? 7 : 6;

    for (let i = iterations - 1; i >= 0; i--) {
      let startD, endD, label;

      if (period === "daily") {
        startD = new Date(refDate);
        startD.setDate(refDate.getDate() - i);
        startD.setHours(0, 0, 0, 0);
        endD = new Date(startD);
        endD.setHours(23, 59, 59, 999);
        label = days[startD.getDay()];
      } else {
        const d = new Date(refDate.getFullYear(), refDate.getMonth() - i, 1);
        startD = new Date(d.getFullYear(), d.getMonth(), 1);
        endD = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        endD.setHours(23, 59, 59, 999);
        label = months[startD.getMonth()];
      }

      const revenueBatch = await Lead.aggregate([
        { $match: { status: "Closed", updatedAt: { $gte: startD, $lte: endD } } },
        { $group: { _id: null, total: { $sum: "$dealValue" } } }
      ]);
      const captured = await Lead.countDocuments({ createdAt: { $gte: startD, $lte: endD } });
      const closed = await Lead.countDocuments({ status: "Closed", updatedAt: { $gte: startD, $lte: endD } });
      const added = await Property.countDocuments({ createdAt: { $gte: startD, $lte: endD } });
      const moved = await Property.countDocuments({ status: { $in: ["Sold", "Rented"] }, updatedAt: { $gte: startD, $lte: endD } });

      trajectoryData.push({ name: label, revenue: revenueBatch.length > 0 ? revenueBatch[0].total : 0, captured, closed });
      inventoryTrajectory.push({ name: label, added, moved });
    }

    res.status(200).json({ success: true, trajectoryData, inventoryTrajectory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
