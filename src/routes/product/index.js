const express = require("express");
const asyncHandler = require("../../middlewares/errorUtils");

const { authentication } = require("../../middlewares/auth");
const productController = require("../../controllers/product.controller");
const router = express.Router();

// auth route
router.use(authentication);
router.post("", asyncHandler(productController.createProduct));
module.exports = router;
