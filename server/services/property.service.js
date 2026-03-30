import Property from "../models/property.model.js";

// Create a property
export const createPropertyService = async (data) => {
  const property = await Property.create(data);
  return property;
};

// Get all properties
export const getPropertiesService = async (queryParams = {}) => {
  const { search } = queryParams;
  let filter = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { "location.address": { $regex: search, $options: "i" } },
      { "location.city": { $regex: search, $options: "i" } },
    ];
  }

  const properties = await Property.find(filter).populate(
    "assignedAgent",
    "name email",
  );
  return properties;
};

// Get a property by ID
export const getPropertyByIdService = async (id) => {
  const property = await Property.findById(id).populate(
    "assignedAgent",
    "name email",
  );
  return property;
};

// Update a property
export const updatePropertyService = async (id, data) => {
  const property = await Property.findByIdAndUpdate(id, data, { new: true });
  return property;
};

// Delete a property
export const deletePropertyService = async (id) => {
  await Property.findByIdAndDelete(id);
  return true;
};
