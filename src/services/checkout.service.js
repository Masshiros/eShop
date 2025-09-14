const { findCart } = require("../models/repositories/cart.repo");
const {
  NotFoundResponseError,
  BadRequestResponseError,
} = require("../core/error.response");
const { findProduct } = require("../models/repositories/product.repo");
// Lưu ý: chỉnh import tùy cách export thực tế của bạn
const DiscountService = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");
const orderModel = require("../models/order.model");
// hoặc: const { DiscountService } = require("./discount.service");

class CheckoutService {
  /**
   * Input shape:
   * {
   *   cartId,
   *   userId,
   *   shop_order_ids: [
   *     {
   *       shopId,
   *       shop_discounts: [{ shopId, discountId, code }],
   *       item_products: [{ productId, quantity, }]
   *     }
   *   ]
   * }
   */

  static async checkoutReview({ cartId, userId, shop_order_ids = [] }) {
    // 1) Cart tồn tại?
    const foundCart = await findCart({ _id: cartId });
    if (!foundCart) {
      throw new NotFoundResponseError({ message: "Cart does not exist" });
    }

    // 2) Tổng hợp kết quả
    const checkout_order = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };

    const item_products_result = [];

    // 3) Duyệt từng shop
    for (const shopOrder of shop_order_ids) {
      const { shopId, shop_discounts = [], item_products = [] } = shopOrder; // ✅ đúng: destructure từ phần tử

      if (!Array.isArray(item_products) || item_products.length === 0) {
        throw new BadRequestResponseError({
          message: "No products found in shop order",
        });
      }

      // 3.1) Lấy thông tin sản phẩm từ DB (server-trust)
      const products = await Promise.all(
        item_products.map(async ({ productId }) => {
          const product = await findProduct({ product_id: productId });
          if (!product) {
            throw new BadRequestResponseError({
              message: `Product ${productId} not found`,
            });
          }
          return product;
        })
      );

      // 3.2) Join theo productId để có {productId, quantity, product_price}
      const checkoutProducts = [];
      for (const ip of item_products) {
        const p = products.find((x) => x._id.toString() === ip.productId);
        if (p) {
          checkoutProducts.push({
            productId: p._id.toString(),
            price: p.product_price, // ✅ dùng giá DB
            quantity: ip.quantity,
          });
        }
      }

      if (checkoutProducts.length === 0) {
        throw new BadRequestResponseError({
          message: "Error while creating order (no matched products)",
        });
      }

      // 3.3) Tính tiền gốc shop
      const checkoutPrice = checkoutProducts.reduce(
        (sum, pr) => sum + pr.price * pr.quantity,
        0
      );

      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        // giữ lại dữ liệu đầu vào cho log/audit nếu cần:
        item_products,
      };

      // 3.4) Áp dụng discount theo shop (nếu có)
      if (shop_discounts.length > 0) {
        for (const d of shop_discounts) {
          // Chỉ truyền dữ liệu đã xác thực từ server
          const serverProductsForDiscount = checkoutProducts.map((p) => ({
            productId: p.productId,
            quantity: p.quantity,
            price: p.price,
          }));

          const { discount = 0 } = await DiscountService.getDiscountAmount({
            code: d.code,
            userId,
            shopId,
            products: serverProductsForDiscount,
          });
          console.log(discount);

          if (discount > 0) {
            checkout_order.totalDiscount += discount;
            itemCheckout.priceApplyDiscount = Math.max(
              0,
              itemCheckout.priceApplyDiscount - discount
            );
          }
        }
      }

      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      item_products_result.push(itemCheckout);
    }

    // 4) Trả kết quả cho controller
    return {
      summary: checkout_order,
      shop_orders: item_products_result,
    };
  }
  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { summary, shop_orders } = await this.checkoutReview({
      cartId,
      userId,
      shop_order_ids,
    });
    // check to test product's amount > inventory's amount
    const products = shop_orders.flatMap((order) => order.item_products);
    if (!products)
      throw new BadRequestResponseError({
        message: "You have not bought anything in your cart",
      });
    const acquireProduct = [];
    // get order's products' quantity and id
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }
    // check whether one product is out of stock
    if (acquireProduct.includes(false)) {
      throw new BadRequestResponseError({
        message: "Some product has been updated, please back to cart...",
      });
    }
    // create order
    const newOrder = await orderModel.create({
      order_userId: userId,
      order_checkout: summary,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_orders,
    });
    // if insert new order, remove product from user's cart
    if (newOrder) {
    }
    return newOrder;
  }
  /**
   * 1. Query Orders [User]
   *
   */
  static async getOrdersByUser() {}
  /**
   * 2. Query 1 Order  [User]
   *
   */
  static async getOrderByUser() {}
  /**
   * 3. Cancel Order  [User]
   *
   */
  static async cancelOrderByUser() {}
  /**
   * 4. Update Order Status [Admin/Shop]
   *
   */
  static async updateOrderByUser() {}
}

module.exports = CheckoutService;
