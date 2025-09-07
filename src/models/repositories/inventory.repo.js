const inventoriesModel = require("../inventories.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknown",
}) => {
  return await inventoriesModel.create({
    inventory_productId: productId,
    inventory_shopId: shopId,
    inventory_stock: stock,
    inventory_location: location,
  });
};
module.exports = {
  insertInventory,
};
