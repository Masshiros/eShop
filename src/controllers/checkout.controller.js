const { SuccessResponse } = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");
class CheckoutController {
  checkoutReview = async (req, res, next) => {
    new SuccessResponse({
      message: "Checkout Review Success",
      metadata: await CheckoutService.checkoutReview({
        ...req.body,
        userId: req.session.userId,
      }),
    }).send(res);
  };
}
module.exports = new CheckoutController();
