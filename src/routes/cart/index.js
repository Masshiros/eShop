const express = require("express");
const asyncHandler = require("../../middlewares/errorUtils");

const { authentication } = require("../../middlewares/auth");
const cartController = require("../../controllers/cart.controller");

const router = express.Router();

// auth route
router.use(authentication);
router.post("", asyncHandler(cartController.createCart));
router.patch("", asyncHandler(cartController.updateCart));
router.delete("/:productId", asyncHandler(cartController.removeCartItem));
router.get("", asyncHandler(cartController.getListUserCart));
module.exports = router;
