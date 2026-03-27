import { createAuditLog } from "../services/audit.service.js";

// Generic Audit Middleware
export const auditMiddleware = (action) => {
  return (req, res, next) => {
    const originalJson = res.json;

    res.json = async function (data) {
      try {
        if (req.user) {
          let documentId = null;
          let moduleName = null;

          // 1️⃣ Try to detect document and module from response keys
          if (data) {
            const keys = Object.keys(data); // e.g., ["lead"], ["property"], ["activity"], ["leads"]
            for (const key of keys) {
              // Skip generic keys like "message" or "error"
              if (!["message", "error"].includes(key) && data[key]?._id) {
                documentId = data[key]._id;
                moduleName = key.toUpperCase(); // lead → LEAD
                break;
              }
            }

            // If single object is returned directly (no key), use it
            if (!documentId && data?._id) {
              documentId = data._id;
              moduleName = "UNKNOWN";
            }
          }

          // Fallback to req.params.id
          if (!documentId && req.params.id) documentId = req.params.id;

          await createAuditLog({
            user: req.user._id,
            action,
            module: moduleName,
            documentId,
            changes: req.body,
          });
        }
      } catch (error) {
        console.error("Audit error:", error.message);
      }

      return originalJson.call(this, data);
    };

    next();
  };
};
