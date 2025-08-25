const shopModel = require("../models/shop.model");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const RoleShop = {
  SHOP: "shop",
  ADMIN: "admin",
  BUYER: "buyer",
};
class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // check user
      const user = await shopModel.findOne({ email }).lean();
      if (_.isEmpty(user)) {
        return {
          code: "xxx",
          message: "Shop already exist",
        };
      }
      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      // create shop
      const createdShop = await shopModel.create({
        name,
        email,
        hashedPassword,
        roles: [RoleShop.SHOP],
      });
      // rsa key
      if (!_.isEmpty(createdShop)) {
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
        });
      }
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
