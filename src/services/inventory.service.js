const { BadRequestResponseError } = require("../core/error.response");
const inventoriesModel = require("../models/inventories.model");
const { findProduct } = require("../models/repositories/product.repo");

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "abc",
  }) {
    const product = await findProduct({ product_id: productId });
    if (!product)
      throw new BadRequestResponseError({
        message: "The product does not exists",
      });
    const query = { inventory_shopId: shopId, inventory_productId: productId },
      updateSet = {
        $inc: {
          inventory_stock: stock,
        },
        $set: {
          inventory_location: location,
        },
      },
      options = { upsert: true, new: true };
    return await inventoriesModel.findOneAndUpdate(query, updateSet, options);
  }
}
module.exports = InventoryService;
