// src/services/redis-pub-sub.service.js
const redis = require("redis");

class RedisPubSubService {
  constructor(url = process.env.REDIS_URL || "redis://127.0.0.1:6379") {
    this.subscriber = redis.createClient({ url });
    this.publisher = redis.createClient({ url });

    this.subscriber.on("error", (e) => console.error("[redis:sub] error:", e));
    this.publisher.on("error", (e) => console.error("[redis:pub] error:", e));

    // Mọi method sẽ chờ promise này để chắc chắn đã connect
    this.ready = (async () => {
      await Promise.all([this.subscriber.connect(), this.publisher.connect()]);
      console.log("[redis] Pub/Sub clients ready");
    })();
  }

  async publish(channel, message) {
    await this.ready; // đảm bảo đã connect
    // publish trả về số subscriber nhận được
    return this.publisher.publish(channel, message);
  }

  async subscribe(channel, handler) {
    await this.ready; // đảm bảo đã connect
    // Trả promise resolve sau khi SUBSCRIBE thành công
    await this.subscriber.subscribe(channel, (msg) => {
      handler(channel, msg); // callback(msg) gốc chỉ có message; ta đưa thêm channel
    });
    console.log(`[redis] Subscribed to ${channel}`);
  }

  async disconnect() {
    await Promise.allSettled([this.subscriber.quit(), this.publisher.quit()]);
  }
}

module.exports = new RedisPubSubService();
