const express = require("express");
const router = express.Router();
const accessRouter = require("./access");
const productRouter = require("./product");
const { validateApiKey, validatePermission } = require("../middlewares/auth");
// middleware
router.use(validateApiKey);
router.use(validatePermission("0000"));
router.use("/v1/api", accessRouter);
router.use("/v1/api/product", productRouter);
module.exports = router;
