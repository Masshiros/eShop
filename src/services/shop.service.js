const shopModel = require("../models/shop.model");
class ShopService {
  static findByEmail = async ({
    email,
    select = { _id: 1, name: 1, email: 1, status: 1, roles: 1, password: 2 },
  }) => {
    return await shopModel.findOne({ email }).select(select).lean();
  };
}
module.exports = ShopService;
