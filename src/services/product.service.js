const {
  productModel,
  electronicModel,
  clothingModel,
  furnitureModel,
} = require("../models/product.model");
const { BadRequestResponseError } = require("../core/error.response");
const {
  publishProduct,
  unpublishProduct,
  findAllDraftProduct,
  findAllPublishedProduct,
  searchProductByKeySearch,
  findProduct,
  findAllProducts,
} = require("../models/repositories/product.repo");
class ProductFactory {
  static productRegistry = {};
  static registerProductType(name, classRef) {
    ProductFactory.productRegistry[name] = classRef;
  }
  static async createProduct({ type, payload }) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestResponseError({
        message: "Product type not existed",
      });
    }
    return new productClass(payload).createProduct();
  }
  static async publishProduct({ product_id, product_shop }) {
    return await publishProduct({ product_shop, product_id });
  }
  static async unpublishProduct({ product_id, product_shop }) {
    return await unpublishProduct({ product_shop, product_id });
  }
  static async findAllDraftProduct({ product_shop, limit = 50, skip = 0 }) {
    return await findAllDraftProduct({
      query: { product_shop, isDraft: true },
      limit,
      skip,
    });
  }
  static async findAllPublishedProduct({ product_shop, limit = 50, skip = 0 }) {
    return await findAllPublishedProduct({
      query: { product_shop, isPublish: true },
      limit,
      skip,
    });
  }
  static async searchProduct({ keySearch }) {
    return await searchProductByKeySearch({ keySearch });
  }
  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublish: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }
  static async findProduct({ product_id }) {
    return await findProduct({
      product_id,
      unSelect: ["__v", "updatedAt", "createdAt"],
    });
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_type,
    product_shop,
    product_attributes,
    product_quantity,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
    this.product_quantity = product_quantity;
  }
  async createProduct(product_id) {
    return await productModel.create({ ...this, _id: product_id });
  }
}
class Electronics extends Product {
  async createProduct() {
    const electronic = await electronicModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!electronic)
      throw new BadRequestResponseError({ message: "Create Furniture Error" });
    const product = await super.createProduct(electronic._id);
    if (!product)
      throw new BadRequestResponseError({ message: "Create Product Error" });
    return product;
  }
}
class Clothings extends Product {
  async createProduct() {
    const clothing = await clothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!clothing)
      throw new BadRequestResponseError({ message: "Create Clothing Error" });
    const product = await super.createProduct(clothing._id);
    if (!product)
      throw new BadRequestResponseError({ message: "Create Product Error" });
    return product;
  }
}
class Furniture extends Product {
  async createProduct() {
    const furniture = await furnitureModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!furniture)
      throw new BadRequestResponseError({ message: "Create Furniture Error" });
    const product = await super.createProduct(furniture._id);
    if (!product)
      throw new BadRequestResponseError({ message: "Create Product Error" });
    return product;
  }
}
// register type
ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Clothing", Clothings);
ProductFactory.registerProductType("Furniture", Furniture);
//
module.exports = ProductFactory;
