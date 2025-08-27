const shopModel = require("../models/shop.model");

const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./key-token.service.lv0");
const { createTokenPair } = require("../auth/authUtils.lv0");
const { getInfoData } = require("../utils");
const { BadRequestResponseError } = require("../core/error.response");

const RoleShop = {
  SHOP: "shop",
  ADMIN: "admin",
  BUYER: "buyer",
};
class AccessService {
  static signUp = async ({ name, email, password }) => {
    // check user
    const user = await shopModel.findOne({ email }).lean();
    console.log(user);
    if (user) {
      throw new BadRequestResponseError({ message: "Shop already exist" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create shop
    const createdShop = await shopModel.create({
      name,
      email,
      password: hashedPassword,
      roles: [RoleShop.SHOP],
    });
    // rsa key
    if (createdShop) {
      const publicKey = crypto.randomBytes(64).toString("hex");
      const privateKey = crypto.randomBytes(64).toString("hex");
      console.log({ publicKey, privateKey });
      // store public key - use to verify
      const publicKeyStr = await KeyTokenService.createKeyToken({
        userId: createdShop._id,
        publicKey,
        privateKey,
      });
      if (!publicKeyStr) {
        throw new BadRequestResponseError({ message: "Public key error" });
      }

      // create tokens
      const tokens = await createTokenPair(
        {
          userId: createdShop._id,
          email,
        },
        publicKeyStr,
        privateKey
      );
      return {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: createdShop,
        }),
        tokens,
      };
    }
    return null;
  };
}

module.exports = AccessService;
