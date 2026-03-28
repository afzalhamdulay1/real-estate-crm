import Lead from "../models/lead.model.js";

// Create a lead
export const createLeadService = async (data, userId) => {
  const lead = await Lead.create(data);

  return await lead.populate([
    { path: "assignedTo", select: "name email" },
    "notes",
    { path: "property", select: "title price type location" },
  ]);
};

// Get leads
export const getLeadsService = async (queryParams) => {
  const { search, status, assignedTo, page = 1, limit = 10 } = queryParams;

  let filter = {};

  // 🔍 SEARCH LOGIC
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } }, // name search
      { phone: { $regex: search, $options: "i" } }, // phone search
    ];
  }

  // 🎯 FILTERS
  if (status) filter.status = status;
  if (assignedTo) filter.assignedTo = assignedTo;

  // 📄 PAGINATION
  const skip = (page - 1) * limit;

  let leadsQuery = Lead.find(filter)
    .populate("assignedTo", "name email")
    .populate("notes")
    .populate("property", "title price type location")
    .skip(skip)
    .limit(parseInt(limit));

  let leads = await leadsQuery;

  // 🔥 PROPERTY SEARCH (important part)
  if (search) {
    leads = leads.filter((lead) =>
      lead.property?.title?.toLowerCase().includes(search.toLowerCase()),
    );
  }

  return leads;
};

// Update lead
export const updateLeadService = async (id, data) => {
  const updatedLead = await Lead.findByIdAndUpdate(id, data, { new: true })
    .populate("assignedTo", "name email")
    .populate("notes")
    .populate("property", "title price type location");

  return updatedLead;
};

// Delete lead
export const deleteLeadService = async (id) => {
  const deletedLead = await Lead.findByIdAndDelete(id);

  return deletedLead;
};
