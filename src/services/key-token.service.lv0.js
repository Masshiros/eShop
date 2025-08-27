const keyTokenModel = require("../models/key-token.model.lv0");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    const token = await keyTokenModel.create({
      user: userId,
      publicKey,
      privateKey,
    });
    return token ? token.publicKey : null;
  };
}
module.exports = KeyTokenService;
