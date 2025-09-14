const express = require("express");
const router = express.Router();
const accessRouter = require("./access");
const productRouter = require("./product");
const discountRouter = require("./discount");
const cartRouter = require("./cart");
const checkoutRouter = require("./checkout");
const inventoriesRouter = require("./inventory");
const { validateApiKey, validatePermission } = require("../middlewares/auth");
// middleware
router.use(validateApiKey);
router.use(validatePermission("0000"));
router.use("/v1/api/products", productRouter);
router.use("/v1/api/discounts", discountRouter);
router.use("/v1/api/inventories", inventoriesRouter);
router.use("/v1/api/carts", cartRouter);
router.use("/v1/api/checkouts", checkoutRouter);
router.use("/v1/api", accessRouter);
module.exports = router;
