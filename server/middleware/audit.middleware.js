import { createAuditLog } from "../services/audit.service.js";

// Generic Audit Middleware
export const auditMiddleware = (action, module) => {
  return (req, res, next) => {
    const originalJson = res.json;

    res.json = async function (data) {
      try {
        if (req.user) {
          let documentId = null;
          let moduleName = module; // Use provided module name first

          // 1️⃣ Try to detect document and module if not provided
          if (data) {
            const keys = Object.keys(data);
            for (const key of keys) {
              if (!["message", "error"].includes(key) && data[key]?._id) {
                documentId = data[key]._id;
                if (!moduleName) moduleName = key.toUpperCase();
                break;
              }
            }

            if (!documentId && data?._id) {
              documentId = data._id;
              if (!moduleName) moduleName = "UNKNOWN";
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
