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
  publishProduct = async (req, res, next) => {
    return new SuccessResponse({
      message: "Publish Product Success",
      metadata: await ProductService.publishProduct({
        product_id: req.params.productId,
        product_shop: req.session.userId,
      }),
    }).send(res);
  };
  unpublishProduct = async (req, res, next) => {
    return new SuccessResponse({
      message: "Unpublish Product Success",
      metadata: await ProductService.unpublishProduct({
        product_id: req.params.productId,
        product_shop: req.session.userId,
      }),
    }).send(res);
  };
  findAllDraftProducts = async (req, res, next) => {
    return new SuccessResponse({
      message: "Find all draft product Success",
      metadata: await ProductService.findAllDraftProduct({
        product_shop: req.session.userId,
        limit: req.query.limit,
        skip: (req.query.page - 1) * req.query.limit,
      }),
    }).send(res);
  };
  findAllPublishedProducts = async (req, res, next) => {
    return new SuccessResponse({
      message: "Find all publish product Success",
      metadata: await ProductService.findAllPublishedProduct({
        product_shop: req.session.userId,
        limit: req.query.limit,
        skip: (req.query.page - 1) * req.query.limit,
      }),
    }).send(res);
  };
  searchProduct = async (req, res, next) => {
    return new SuccessResponse({
      message: "Search product Success",
      metadata: await ProductService.searchProduct(req.params),
    }).send(res);
  };
}
module.exports = new ProductController();
