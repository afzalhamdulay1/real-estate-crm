import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["Call", "Email", "Meeting", "Site Visit", "Other"],
      default: "Other",
    },
    notes: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    // Optional: status of the activity
    status: {
      type: String,
      enum: ["Pending", "Completed", "Follow-up"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;
