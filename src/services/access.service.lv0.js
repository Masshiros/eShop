const shopModel = require("../models/shop.model");

const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./key-token.service.lv0");
const { createTokenPair } = require("../auth/authUtils.lv0");
const { getInfoData } = require("../utils");
const {
  BadRequestResponseError,
  UnauthorizedResponseError,
} = require("../core/error.response");
const ShopService = require("./shop.service");

const RoleShop = {
  SHOP: "shop",
  ADMIN: "admin",
  BUYER: "buyer",
};
class AccessService {
  static signOut = async ({ session }) => {
    return await KeyTokenService.removeById(session._id);
  };
  static signIn = async ({ email, password, refreshToken }) => {
    // existed?
    const shop = await ShopService.findByEmail({ email });
    if (!shop) {
      throw new BadRequestResponseError({ message: "Shop not registered" });
    }
    // match password?
    const match = bcrypt.compare(password, shop.password);
    if (!match) {
      throw new UnauthorizedResponseError({ message: "Authorization failed" });
    }
    // pub & pri keys
    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");
    // create tokens
    const tokens = await createTokenPair(
      {
        userId: shop._id,
        email,
      },
      publicKey,
      privateKey
    );
    // store public key - use to verify
    await KeyTokenService.createKeyToken({
      userId: shop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });
    return {
      tokens,
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: createdShop,
      }),
    };
  };
  static signUp = async ({ name, email, password }) => {
    // check user
    const shop = await ShopService.findByEmail(email);

    if (shop) {
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
      // create tokens
      const tokens = await createTokenPair(
        {
          userId: createdShop._id,
          email,
        },
        publicKey,
        privateKey
      );
      // store public key - use to verify
      const publicKeyStr = await KeyTokenService.createKeyToken({
        userId: createdShop._id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken,
      });
      if (!publicKeyStr) {
        throw new BadRequestResponseError({ message: "Public key error" });
      }

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
  store;
}

module.exports = AccessService;
