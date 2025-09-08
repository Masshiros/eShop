const {
  OkResponse,
  CreatedResponse,
  SuccessResponse,
} = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  createDiscount = async (req, res, next) => {
    return new SuccessResponse({
      message: "Create Discount Success",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.session.userId,
      }),
    }).send(res);
  };
  getAllProductOfDiscountCode = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get List Product of Discount Success",
      metadata: await DiscountService.getAllProductOfDiscountCode({
        ...req.query,
      }),
    }).send(res);
  };
  getAllDiscountCodeByShop = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get all discount code by shop Success",
      metadata: await DiscountService.getAllDiscountCodeByShop({
        ...req.query,
        shopId: req.session.userId,
      }),
    }).send(res);
  };
  getDiscountAmount = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get Discount Amount Success",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };
  deleteDiscount = async (req, res, next) => {
    return new SuccessResponse({
      message: "Delete Discount success",
      metadata: await DiscountService.deleteDiscount({
        ...req.query,
        shopId: req.session.userId,
      }),
    }).send(res);
  };
  cancelDiscount = async (req, res, next) => {
    return new SuccessResponse({
      message: "Cancel discount success",
      metadata: await DiscountService.cancelDiscount({
        ...req.query,
        userId: req.session.userId,
      }),
    }).send(res);
  };
}
module.exports = new DiscountController();
