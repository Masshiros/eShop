const express = require("express");
const asyncHandler = require("../../middlewares/errorUtils");

const { authentication } = require("../../middlewares/auth");
const inventoryController = require("../../controllers/inventory.controller");

const router = express.Router();

// auth route
router.use(authentication);
router.post("", asyncHandler(inventoryController.createInventory));
module.exports = router;
