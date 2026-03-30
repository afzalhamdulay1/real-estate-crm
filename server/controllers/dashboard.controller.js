import Lead from "../models/lead.model.js";
import Property from "../models/property.model.js";
import Activity from "../models/activity.model.js";
import AuditLog from "../models/auditLog.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Leads
    const totalLeads = await Lead.countDocuments();

    // 2. Active Listings (Available properties)
    const activeProperties = await Property.countDocuments({ status: "Available" });

    // 3. Closing Rate (Closed Leads / Total Leads)
    const closedLeads = await Lead.countDocuments({ status: "Closed" });
    const closingRate = totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(1) : 0;

    // 4. Total Revenue (Sum of dealValue from Closed leads)
    const revenueData = await Lead.aggregate([
      { $match: { status: "Closed", dealValue: { $exists: true, $ne: null } } },
      { $group: { _id: null, total: { $sum: "$dealValue" } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // 5. Recent Activity (Latest Audit Logs or Activities)
    // We'll prioritize AuditLogs for a detailed historical feed
    const recentActivities = await AuditLog.find()
      .populate("user", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(5);

    // 6. Top Property (Most leads linked to one property)
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

    // 7. Dynamic Market Pulse Calculation
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 30);
    const recentLeadsCount = await Lead.countDocuments({ createdAt: { $gte: sixtyDaysAgo } });
    const buyerInterest = totalLeads > 0 ? Math.min(100, Math.round((recentLeadsCount / totalLeads) * 100)) : 0;

    const totalProperties = await Property.countDocuments();
    const nonAvailableProperties = await Property.countDocuments({ status: { $in: ["Sold", "Rented"] } });
    const listingVelocity = totalProperties > 0 ? Math.round((nonAvailableProperties / totalProperties) * 100) : 0;

    // 8. Pipeline Breakdown (Lead Statuses)
    const leadStatusData = await Lead.aggregate([
      { $group: { _id: "$status", value: { $sum: 1 } } },
      { $project: { name: "$_id", value: 1, _id: 0 } }
    ]);

    // 9. Portfolio Breakdown (Property Types)
    const propertyTypeData = await Property.aggregate([
      { $group: { _id: "$type", value: { $sum: 1 } } },
      { $project: { name: "$_id", value: 1, _id: 0 } }
    ]);

    // 10. Multi-Series Performance Trajectory (Captured vs Closed, New vs Moved)
    const trajectoryData = [];
    const inventoryTrajectory = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const refDate = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(refDate.getFullYear(), refDate.getMonth() - i, 1);
      const startD = new Date(d.getFullYear(), d.getMonth(), 1);
      const endD = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      
      // Lead Metrics
      const revenue = await Lead.aggregate([
        { $match: { status: "Closed", createdAt: { $gte: startD, $lte: endD } } },
        { $group: { _id: null, total: { $sum: "$dealValue" } } }
      ]);
      const captured = await Lead.countDocuments({ createdAt: { $gte: startD, $lte: endD } });
      const closed = await Lead.countDocuments({ status: "Closed", updatedAt: { $gte: startD, $lte: endD } });
      
      // Inventory Metrics
      const added = await Property.countDocuments({ createdAt: { $gte: startD, $lte: endD } });
      const moved = await Property.countDocuments({ status: { $in: ["Sold", "Rented"] }, updatedAt: { $gte: startD, $lte: endD } });

      trajectoryData.push({
        name: months[startD.getMonth()],
        revenue: revenue.length > 0 ? revenue[0].total : 0,
        captured,
        closed
      });

      inventoryTrajectory.push({
        name: months[startD.getMonth()],
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
