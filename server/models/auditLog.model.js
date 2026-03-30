import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      enum: ["CREATE", "UPDATE", "DELETE"],
      required: true,
    },

    module: {
      type: String,
      enum: ["LEAD", "PROPERTY", "ACTIVITY", "USER"],
      required: true,
    },

    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    changes: {
      type: Object, // optional: store old/new values
    },
  },
  { timestamps: true },
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
