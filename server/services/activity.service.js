import Activity from "../models/activity.model.js";
import Lead from "../models/lead.model.js";

// Create Activity
export const createActivityService = async (data) => {
  const activity = await Activity.create(data);

  // Add this activity to lead's notes
  await Lead.findByIdAndUpdate(data.lead, {
    $push: { notes: activity._id },
  });

  return activity
    .populate("lead", "name email phone property")
    .populate("agent", "name email");
};

export const getActivitiesService = async (filters = {}, options = {}) => {
  const query = {};

  // === Filters ===
  if (filters.lead) query.lead = filters.lead;
  if (filters.agent) query.agent = filters.agent;
  if (filters.type) query.type = filters.type;
  if (filters.status) query.status = filters.status;

  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) query.date.$gte = new Date(filters.startDate);
    if (filters.endDate) query.date.$lte = new Date(filters.endDate);
  }

  if (filters.property) {
    const leads = await Lead.find({ property: filters.property }, "_id");
    const propertyLeadIds = leads.map((l) => l._id);
    query.lead = propertyLeadIds;
  }

  // === Pagination & Sorting ===
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;

  const sortField = options.sortField || "date";
  const sortOrder = options.sortOrder === "asc" ? 1 : -1;

  const total = await Activity.countDocuments(query);
  const activities = await Activity.find(query)
    .populate("lead", "name email phone property")
    .populate("agent", "name email")
    .sort({ [sortField]: sortOrder })
    .skip(skip)
    .limit(limit);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    activities,
  };
};

// Update Activity
export const updateActivityService = async (id, data) => {
  const activity = await Activity.findByIdAndUpdate(id, data, { new: true })
    .populate("lead", "name email phone property")
    .populate("agent", "name email");
  return activity;
};

// Delete Activity
export const deleteActivityService = async (id) => {
  const activity = await Activity.findByIdAndDelete(id);

  // Remove activity reference from lead
  if (activity) {
    await Lead.findByIdAndUpdate(activity.lead, {
      $pull: { notes: activity._id },
    });
  }

  return activity;
};
