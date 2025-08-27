const shopModel = require("../models/shop.model");

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./key-token.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

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
      console.log(user);
      if (user) {
        return {
          code: "xxx",
          message: "Shop already exist",
        };
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);
      // create shop
      const createdShop = await shopModel.create({
        name,
        email,
        password: hashedPassword,
        roles: [RoleShop.SHOP],
      });
      // rsa key
      if (createdShop) {
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1", // hoặc "spki"
            format: "pem", // định dạng xuất ra
          },
          privateKeyEncoding: {
            type: "pkcs1", // hoặc "pkcs8"
            format: "pem", // định dạng xuất ra
          },
        });
        // store public key - use to verify
        const publicKeyStr = await KeyTokenService.createKeyToken({
          userId: createdShop._id,
          publicKey,
        });
        if (!publicKeyStr) {
          return {
            code: "xxxx",
            message: "Public key error",
          };
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
          code: 201,
          metadata: {
            shop: getInfoData({
              fields: ["_id", "name", "email"],
              object: createdShop,
            }),
            tokens,
          },
        };
      }
      return {
        code: 200,
        metadata: null,
      };
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
