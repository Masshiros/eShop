const apiKeyModel = require("../models/api-key.model");
const crypto = require("crypto");
class ApiKeyService {
  static findByKey = async (key) => {
    // temp
    await apiKeyModel.create({
      key: crypto.randomBytes(64).toString("hex"),
      permissions: ["0000"],
    });
    return await apiKeyModel.findOne({ key, status: true }).lean();
  };
}
module.exports = ApiKeyService;
