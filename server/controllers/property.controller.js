import {
  createPropertyService,
  getPropertiesService,
  getPropertyByIdService,
  updatePropertyService,
  deletePropertyService,
} from "../services/property.service.js";

// Create property
export const createProperty = async (req, res) => {
  try {
    const property = await createPropertyService(req.body);
    res.status(201).json({ message: "Property created", property });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all properties
export const getProperties = async (req, res) => {
  try {
    const properties = await getPropertiesService();
    res.json({ properties });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get single property
export const getPropertyById = async (req, res) => {
  try {
    const property = await getPropertyByIdService(req.params.id);
    res.json({ property });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update property
export const updateProperty = async (req, res) => {
  try {
    const property = await updatePropertyService(req.params.id, req.body);
    res.json({ message: "Property updated", property });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete property
export const deleteProperty = async (req, res) => {
  try {
    await deletePropertyService(req.params.id);
    res.json({ message: "Property deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
