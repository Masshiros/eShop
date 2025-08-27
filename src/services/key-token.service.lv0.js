
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
  static removeByUserId = async (userId) => {
    return await keyTokenModel.deleteOne({ user: userId });
  };
  static findByRefreshTokensUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({
      refreshTokensUsed: { $in: [refreshToken] },
    });
  };
  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken });
  };
  static updateKeyToken = async ({ keyToken, update = {} }) => {
    await keyTokenModel.updateOne(keyToken, update);
  };
}
module.exports = KeyTokenService;
