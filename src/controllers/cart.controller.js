const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  createCart = async (req, res, next) => {
    return new SuccessResponse({
      message: "Create Cart Success",
      metadata: await CartService.addProductToCart({
        userId: req.session.userId,
        product: req.body.product,
      }),
    }).send(res);
  };
  updateCart = async (req, res, next) => {
    return new SuccessResponse({
      message: "Update Cart Success",
      metadata: await CartService.updateCart({
        userId: req.session.userId,
        shop_order_ids: req.body.shop_order_ids,
      }),
    }).send(res);
  };
  removeCartItem = async (req, res, next) => {
    return new SuccessResponse({
      message: "Remove Cart Item Success",
      metadata: await CartService.removeCartItem({
        userId: req.session.userId,
        productId: req.params.productId,
      }),
    }).send(res);
  };
  getListUserCart = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get List User Cart Success",
      metadata: await CartService.getListUserCart({
        userId: req.session.userId,
      }),
    }).send(res);
  };
}
module.exports = new CartController();
