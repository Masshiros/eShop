const { UnauthorizedResponseError } = require("../core/error.response");
const JWT = require("jsonwebtoken");
const ApiKeyService = require("../services/api-key.service");
const KeyTokenService = require("../services/key-token.service.lv0");
const asyncHandler = require("./errorUtils");

// headers
const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  CLIENT_ID: "x-client-id",
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
const authentication = asyncHandler(async (req, res, next) => {
  // get userId
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new UnauthorizedResponseError({ message: "Authentication failed" });
  }
  // get session
  const session = await KeyTokenService.findByUserId(userId);
  if (!session) {
    throw new UnauthorizedResponseError({ message: "Authentication failed" });
  }
  // get at
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new UnauthorizedResponseError({ message: "Authentication failed" });
  }
  // decode token
  const decodedUser = JWT.verify(accessToken, session.publicKey);
  if (!decodedUser) {
    throw new UnauthorizedResponseError({ message: "Authentication failed" });
  }
  if (decodedUser.userId !== userId) {
    throw new UnauthorizedResponseError({ message: "Authentication failed" });
  }
  req.session = session;
  return next();
});
module.exports = {
  validateApiKey,
  validatePermission,
  authentication,
};
