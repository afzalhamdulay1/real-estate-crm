import Lead from "../models/lead.model.js";
import Property from "../models/property.model.js";

// Create a lead
export const createLeadService = async (data, userId) => {
  const lead = await Lead.create(data);

  return await lead.populate([
    { path: "assignedTo", select: "name email" },
    { path: "notes", populate: { path: "agent", select: "name" } },
    { path: "property", select: "title price type location" },
  ]);
};

// Get single lead by ID
export const getLeadService = async (id) => {
  const lead = await Lead.findById(id)
    .populate("assignedTo", "name email")
    .populate({ path: "notes", populate: { path: "agent", select: "name" } })
    .populate("property", "title price type location");
  
  if (!lead) {
    throw new Error("Lead not found");
  }
  
  return lead;
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
    .populate({ path: "notes", populate: { path: "agent", select: "name" } })
    .populate("property", "title price type location")
    .sort({ createdAt: -1 })
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
export const updateLeadService = async (id, data, userId) => {
  // 1. Fetch current lead state BEFORE update to check for status reversal
  const currentLead = await Lead.findById(id);
  if (!currentLead) throw new Error("Lead not found");

  const oldStatus = currentLead.status;

  // 2. Perform the update
  const updatedLead = await Lead.findByIdAndUpdate(id, data, { new: true })
    .populate("assignedTo", "name email")
    .populate({ path: "notes", populate: { path: "agent", select: "name" } })
    .populate("property", "title price type location");

  // 🔄 DEAL WIN SYNC: If moving TO Closed, mark property as Sold
  if (data.status === "Closed" && updatedLead.property) {
    await Property.findByIdAndUpdate(updatedLead.property._id, { status: "Sold" });
  }

  // 🚨 REVERSAL SYNC: If moving AWAY from Closed, mark property as Available again
  if (oldStatus === "Closed" && data.status && data.status !== "Closed" && updatedLead.property) {
    await Property.findByIdAndUpdate(updatedLead.property._id, { status: "Available" });
  }

  return updatedLead;
};

// Delete lead
export const deleteLeadService = async (id) => {
  const deletedLead = await Lead.findByIdAndDelete(id);

  return deletedLead;
};
