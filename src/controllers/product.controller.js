const ProductService = require("../services/product.service");
const {
  OkResponse,
  CreatedResponse,
  SuccessResponse,
} = require("../core/success.response");

class ProductController {
  createProduct = async (req, res, next) => {
    return new SuccessResponse({
      message: "Create Product Success",
      metadata: await ProductService.createProduct({
        type: req.body.product_type,
        payload: { ...req.body, product_shop: req.session.userId },
      }),
    }).send(res);
  };
}
module.exports = new ProductController();
