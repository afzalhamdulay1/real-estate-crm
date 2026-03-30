import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    type: {
      type: String,
      enum: ["Residential", "Commercial"],
      default: "Residential",
    },
    price: { type: Number, required: true },
    area: { type: String }, // e.g., "1200 sq.ft"
    beds: { type: Number, default: 0 },
    baths: { type: Number, default: 0 },
    location: {
      city: { type: String },
      address: { type: String },
    },
    status: {
      type: String,
      enum: ["Available", "Sold", "Rented"],
      default: "Available",
    },
    images: [{ type: String }], // URLs of property images
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const Property = mongoose.model("Property", propertySchema);
export default Property;
