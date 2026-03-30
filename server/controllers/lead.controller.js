import {
  createLeadService,
  getLeadsService,
  getLeadService,
  updateLeadService,
  deleteLeadService,
} from "../services/lead.service.js";

// Create Lead
export const createLead = async (req, res) => {
  try {
    const lead = await createLeadService(req.body, req.user._id);
    res.status(201).json({ message: "Lead created", lead });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Leads
export const getLeads = async (req, res) => {
  try {
    const leads = await getLeadsService(req.query);
    res.json({ leads });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Single Lead
export const getLead = async (req, res) => {
  try {
    const lead = await getLeadService(req.params.id);
    res.json({ lead });
  } catch (error) {
    res.status(error.message === "Lead not found" ? 404 : 400).json({ message: error.message });
  }
};

// Update Lead
export const updateLead = async (req, res) => {
  try {
    const lead = await updateLeadService(req.params.id, req.body, req.user._id);
    res.json({ message: "Lead updated", lead });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Lead
export const deleteLead = async (req, res) => {
  try {
    const lead = await deleteLeadService(req.params.id, req.user._id);
    res.json({ message: "Lead deleted", lead });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
