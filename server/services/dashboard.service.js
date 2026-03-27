// services/dashboard.service.js
import Lead from "../models/lead.model.js";
import Activity from "../models/activity.model.js";
import Property from "../models/property.model.js";
import User from "../models/user.model.js";

// Lead metrics
export const getLeadMetrics = async () => {
  const totalLeads = await Lead.countDocuments();

  const leadsPerProperty = await Lead.aggregate([
    { $group: { _id: "$property", count: { $sum: 1 } } },
    {
      $lookup: {
        from: "properties",
        localField: "_id",
        foreignField: "_id",
        as: "property",
      },
    },
    { $unwind: "$property" },
    { $project: { propertyName: "$property.name", count: 1 } },
  ]);

  const leadsPerAgent = await Lead.aggregate([
    { $group: { _id: "$assignedTo", count: { $sum: 1 } } },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "agent",
      },
    },
    { $unwind: "$agent" },
    { $project: { agentName: "$agent.name", count: 1 } },
  ]);

  const leadsByStatus = await Lead.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  return { totalLeads, leadsPerProperty, leadsPerAgent, leadsByStatus };
};

// Activity metrics
export const getActivityMetrics = async () => {
  const activitiesPerAgent = await Activity.aggregate([
    { $group: { _id: "$agent", count: { $sum: 1 } } },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "agent",
      },
    },
    { $unwind: "$agent" },
    { $project: { agentName: "$agent.name", count: 1 } },
  ]);

  const activitiesPerType = await Activity.aggregate([
    { $group: { _id: "$type", count: { $sum: 1 } } },
  ]);

  const activitiesPerProperty = await Activity.aggregate([
    {
      $lookup: {
        from: "leads",
        localField: "lead",
        foreignField: "_id",
        as: "lead",
      },
    },
    { $unwind: "$lead" },
    { $group: { _id: "$lead.property", count: { $sum: 1 } } },
    {
      $lookup: {
        from: "properties",
        localField: "_id",
        foreignField: "_id",
        as: "property",
      },
    },
    { $unwind: "$property" },
    { $project: { propertyName: "$property.name", count: 1 } },
  ]);

  return { activitiesPerAgent, activitiesPerType, activitiesPerProperty };
};
