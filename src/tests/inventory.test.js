const redisPubSubService = require("../services/redis-pub-sub.service");

class InventoryTestService {
  constructor() {
    // Lưu promise để nơi khác có thể chờ subscriber sẵn sàng
    this.ready = redisPubSubService.subscribe(
      "purchase_events",
      (_ch, message) => {
        console.log("Received message:", message);
        try {
          const data = JSON.parse(message); // parse JSON
          InventoryTestService.updateInventory(data);
        } catch (e) {
          console.error("JSON parse error:", e, "raw:", message);
        }
      }
    );
  }

  static updateInventory({ productId, quantity }) {
    console.log(`Updated inventory ${productId} with quantity ${quantity}`);
  }
}

module.exports = new InventoryTestService();
