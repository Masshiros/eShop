const express = require("express");
const asyncHandler = require("../../middlewares/errorUtils");

const { authentication } = require("../../middlewares/auth");
const discountController = require("../../controllers/discount.controller");

const router = express.Router();

// ====================== PUBLIC ROUTES ======================
// Lấy tất cả sản phẩm của 1 discount code (không cần auth)
router.get(
  "/list-products",
  asyncHandler(discountController.getAllProductOfDiscountCode)
);
// Lấy giá trị giảm giá cho 1 request cụ thể
router.post("/amount", asyncHandler(discountController.getDiscountAmount));
// ====================== AUTH ROUTES ======================
router.use(authentication);

// Tạo mã giảm giá
router.post("", asyncHandler(discountController.createDiscount));

// Lấy tất cả mã giảm giá của shop
router.get("/shop", asyncHandler(discountController.getAllDiscountCodeByShop));

// Xóa mã giảm giá
router.delete("", asyncHandler(discountController.deleteDiscount));

// Hủy mã giảm giá (cancel)
router.post("/cancel", asyncHandler(discountController.cancelDiscount));

module.exports = router;
