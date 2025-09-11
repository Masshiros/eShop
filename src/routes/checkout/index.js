const express = require("express");
const asyncHandler = require("../../middlewares/errorUtils");

const { authentication } = require("../../middlewares/auth");
const checkoutController = require("../../controllers/checkout.controller");
const router = express.Router();

// auth route
router.use(authentication);
router.post("/review", asyncHandler(checkoutController.checkoutReview));
module.exports = router;
