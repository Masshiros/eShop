const keyTokenModel = require("../models/key-token.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey }) => {
    const publicKeyStr = publicKey.toString();
    const token = await keyTokenModel.create({
      user: userId,
      publicKey: publicKeyStr,
    });
    return token ? token.publicKey : null;
  };
}
module.exports = KeyTokenService;
