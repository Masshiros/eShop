const cartModel = require("../cart.model");

const createUserCart = async ({ userId, product }) => {
  const query = { cart_userId: userId, cart_state: "active" };
  const updateOrInsert = {
    $addToSet: {
      cart_products: product,
    },
  };
  const options = { upsert: true, new: true };
  return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
};
const updateUserCartQuantity = async ({ userId, products }) => {
  for (let { productId, quantity } of products) {
    await cartModel.updateOne(
      {
        cart_userId: userId,
        cart_state: "active",
        "cart_products.productId": productId,
      },
      { $inc: { "cart_products.$.quantity": quantity } }
    );
  }
};
const findCart = async (query) => {
  return await cartModel.findOne(query).lean();
};
const removeCartItem = async ({ userId, productIds = [] }) => {
  await cartModel.updateOne(
    { cart_userId: userId, cart_state: "active" },
    { $pull: { cart_products: { productId: { $in: productIds } } } }
  );
};
module.exports = {
  createUserCart,
  updateUserCartQuantity,
  findCart,
  removeCartItem,
};
