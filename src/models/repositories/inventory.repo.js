const { convertToObjectIdMongodb } = require("../../utils");
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
const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      inventory_productId: convertToObjectIdMongodb(productId),
      inventory_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: {
        inventory_stock: -quantity,
      },
      $push: {
        inventory_reservations: {
          quantity,
          cartId,
          createOn: new Date(),
        },
      },
    },
    options = { upsert: true, new: true };
  return await inventoriesModel.updateOne(query, updateSet, options);
};
module.exports = {
  insertInventory,
  reservationInventory
};
