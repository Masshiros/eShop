const express = require("express");
const asyncHandler = require("../../middlewares/errorUtils");

const { authentication } = require("../../middlewares/auth");
const productController = require("../../controllers/product.controller");
const router = express.Router();
router.get("/search/:keySearch", asyncHandler(productController.searchProduct));
router.get("", asyncHandler(productController.findAllProducts));
router.get("/:productId", asyncHandler(productController.findProduct));
// auth route
router.use(authentication);
router.post("", asyncHandler(productController.createProduct));
router.post(
  "/publish/:productId",
  asyncHandler(productController.publishProduct)
);
router.post(
  "/unpublish/:productId",
  asyncHandler(productController.unpublishProduct)
);
router.get("/drafts/all", asyncHandler(productController.findAllDraftProducts));
router.get(
  "/published/all",
  asyncHandler(productController.findAllPublishedProducts)
);
module.exports = router;
