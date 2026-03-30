import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: String,
    phone: String,

    source: {
      type: String,
      enum: ["Website", "Referral", "Walk-in", "Other"],
      default: "Website",
    },

    status: {
      type: String,
      enum: ["New", "Contacted", "Interested", "Closed", "Lost"],
      default: "New",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Agent assigned
    },

    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity", // Linked activities
      },
    ],

    // Link lead to a property
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
    // Final Agreed Sales Price
    dealValue: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Lead = mongoose.model("Lead", leadSchema);
export default Lead;
