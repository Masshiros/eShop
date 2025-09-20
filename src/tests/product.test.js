// src/tests/product.test.js
const redisPubSubService = require("../services/redis-pub-sub.service");

class ProductTestService {
  async purchaseProduct(productId, quantity) {
    const order = { productId, quantity };
    const n = await redisPubSubService.publish(
      "purchase_events",
      JSON.stringify(order)
    );
    console.log(`Published to purchase_events → ${n} subscriber(s)`);
  }
}
module.exports = new ProductTestService();
