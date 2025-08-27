const ApiKeyService = require("../services/api-key.service");

// headers
const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};
// validate api key
const validateApiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Resource",
      });
    }
    const apiKey = await ApiKeyService.findByKey(key);
    if (!apiKey) {
      return res.status(403).json({
        message: "Forbidden Resource",
      });
    }
    req.apiKey = apiKey;
    return next();
  } catch (error) {
    throw error;
  }
};

// validate permission
const validatePermission = (permission) => {
  return (req, res, next) => {
    try {
      if (!req.apiKey?.permissions) {
        return res.status(403).json({
          message: "Forbidden Resource",
        });
      }
      const isValid = req.apiKey?.permissions.includes(permission);
      if (!isValid) {
        return res.status(403).json({
          message: "Forbidden Resource",
        });
      }
      return next();
    } catch (error) {
      throw error;
    }
  };
};
module.exports = {
  validateApiKey,
  validatePermission,
};
