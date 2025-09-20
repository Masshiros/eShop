const redis = require("redis");
const { promisify } = require("util");
const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");

const redisClient = redis.createClient({
  url: "redis://localhost:6379", 
});


redisClient.on("connect", () => {
  console.log("Redis client connecting...");
});

redisClient.on("ready", () => {
  console.log("Redis client ready!");
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

redisClient.on("end", () => {
  console.log("Redis client closed");
});

// Connect tới Redis server
(async () => {
  try {
    await redisClient.connect(); // Bắt buộc trong v4
    const pong = await redisClient.ping();
    console.log("Ping response:", pong);
  } catch (err) {
    console.error("Redis connection failed:", err);
  }
})();

const expire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);
const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2025_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000;
  for (let i = 0; i < retryTimes.length; i++) {
    const result = await setnxAsync(key, expireTime);
    if (result === 1) {
      const isReservation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });
      if (isReservation.modifiedCount) {
        await expire(key, expireTime);
        return key;
      }
      return key;
    } else {
      return new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};
const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};
module.exports = {
  acquireLock,
  releaseLock,
};
