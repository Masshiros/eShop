const express = require("express");
const router = express.Router();
const accessRouter = require("./access");
const productRouter = require("./product");
const discountRouter = require("./discount");
const cartRouter = require("./cart");
const checkoutRouter = require("./checkout");
const inventoriesRouter = require("./inventory");
const { validateApiKey, validatePermission } = require("../middlewares/auth");
const { pushLogToDiscord } = require("../middlewares/logger");
// Khởi tạo services/tests
const pubsub = require("../services/redis-pub-sub.service");
const inventoryTest = require("../tests/inventory.test"); // có .ready
const productTest = require("../tests/product.test");

// Đảm bảo SUBSCRIBE xong rồi mới PUBLISH (tránh mất message)
(async () => {
  try {
    await pubsub.ready; // cả pub & sub đã connect
    await inventoryTest.ready; // đã subscribe "purchase_events"
    await productTest.purchaseProduct("product:0001", 10);
  } catch (e) {
    console.error("[bootstrap] pubsub/inventory setup failed:", e);
  }
})();

// middleware
router.use(pushLogToDiscord);
router.use(validateApiKey);
router.use(validatePermission("0000"));
router.use("/v1/api/products", productRouter);
router.use("/v1/api/discounts", discountRouter);
router.use("/v1/api/inventories", inventoriesRouter);
router.use("/v1/api/carts", cartRouter);
router.use("/v1/api/checkouts", checkoutRouter);
router.use("/v1/api", accessRouter);
module.exports = router;
