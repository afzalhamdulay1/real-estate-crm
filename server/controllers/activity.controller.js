import {
  createActivityService,
  getActivitiesService,
  updateActivityService,
  deleteActivityService,
} from "../services/activity.service.js";

// Create activity
export const createActivity = async (req, res) => {
  try {
    const activity = await createActivityService(req.body);
    res.status(201).json({ message: "Activity created", activity });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getActivities = async (req, res) => {
  try {
    const filters = {
      lead: req.query.lead,
      agent: req.query.agent,
      property: req.query.property,
      type: req.query.type,
      status: req.query.status,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const activities = await getActivitiesService(filters);
    res.json({ activities });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update activity
export const updateActivity = async (req, res) => {
  try {
    const activity = await updateActivityService(req.params.id, req.body);
    res.json({ message: "Activity updated", activity });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete activity
export const deleteActivity = async (req, res) => {
  try {
    const activity = await deleteActivityService(req.params.id);
    res.json({ message: "Activity deleted", activity });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
