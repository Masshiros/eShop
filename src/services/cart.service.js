const {
  NotFoundResponseError,
  BadRequestResponseError,
} = require("../core/error.response");
const {
  findCart,
  createUserCart,
  updateUserCartQuantity,
} = require("../models/repositories/cart.repo");
const { findProduct } = require("../models/repositories/product.repo");

/**
 * 1. Add product to cart [User]
 * 2. Update cart (increase/decrease/delete cart item)
 * 3. Get Cart[User]
 * 4. Delete cart [User]

 */
class CartService {
  static async addProductToCart({ userId, product }) {
    // cart no exist
    const userCart = await findCart({ cart_userId: userId });
    if (!userCart) {
      return await createUserCart({ userId, product });
    }

    // cart exist but no product
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }
    // product already exist in cart
    const existingProduct = userCart.cart_products.find(
      (e) => e.product.productId === product.productId
    );
    // product no exist
    if (existingProduct) {
      return await updateUserCartQuantity({ userId, products: [product] });
    }
    userCart.cart_products.push(product);
    return await userCart.save();
  }
  // update cart
  /**
   * shop_order_ids: [
   *  {
   *    shopId,
   *    item_products:[
   *      {
   *        quantity,
   *        price,
   *        shopId,
   *        old_quantity,
   *        productId
   *      }
   *    ]
   *    version
   *  }
   * ]
   */
  static async updateCart({ userId, shop_order_ids }) {
    const updatedProducts = [];
    const removedProducts = [];
    for (let shop_order_id of shop_order_ids) {
      const { item_products, shopId } = shop_order_id;
      for (let item of item_products) {
        const { productId, quantity, old_quantity } = item;
        // find product
        const foundProduct = await findProduct({ product_id: productId });
        if (!foundProduct)
          throw new NotFoundResponseError({ message: "Product not found" });
        // validate product belong to shop
        if (foundProduct.product_shop !== shopId) {
          throw new BadRequestResponseError({
            message: "Product not belong to shop",
          });
        }
        // quantity = 0  --> remove cart item
        if (quantity === 0) {
          removedProducts.push(productId);
        } else {
          updatedProducts.push({
            productId,
            quantity: quantity - old_quantity,
          });
        }
      }
    }
    if (removedProducts.length > 0) {
      //remove cart item
    }
    if (updatedProducts.length > 0) {
      return await updateUserCartQuantity({ userId, updatedProducts });
    }
  }
}
module.export = CartService;
