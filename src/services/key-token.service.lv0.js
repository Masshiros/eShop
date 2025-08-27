const keyTokenModel = require("../models/key-token.model.lv0");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    // lv0-1
    // const token = await keyTokenModel.create({
    //   user: userId,
    //   publicKey,
    //   privateKey,
    // });
    // lv2-3-4-5
    const filter = { user: userId };
    const update = {
      publicKey,
      privateKey,
      refreshToken,
      refreshTokensUsed: [],
    };
    const options = { upsert: true, new: true };
    const token = await keyTokenModel.findOneAndUpdate(filter, update, options);
    return token ? token.publicKey : null;
  };
  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: userId });
  };
  static removeById = async (id) => {
    return await keyTokenModel.deleteOne({ _id: id });
  };
}
module.exports = KeyTokenService;
