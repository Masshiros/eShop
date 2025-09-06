const { getSelectData, getUnSelectData } = require("../../utils");
const { productModel } = require("../product.model");

const queryProduct = async ({ query, limit, skip }) => {
  return await productModel
    .find(query)
    .populate("product_shop", "name _id email")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};
const findAllDraftProduct = async ({ query, limit, skip = 0 }) => {
  return await queryProduct({ query, limit, skip });
};
const findAllPublishedProduct = async ({ query, limit, skip = 0 }) => {
  return await queryProduct({ query, limit, skip });
};
const searchProductByKeySearch = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const result = await productModel
    .find(
      {
        isPublish: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return result;
};
const publishProduct = async ({ product_shop, product_id }) => {
  const product = await productModel.findOne({
    _id: product_id,
    product_shop: product_shop,
  });
  if (!product) return null;

  return await productModel.updateOne(product, {
    $set: { isPublish: true, isDraft: false },
  });
};
const unpublishProduct = async ({ product_shop, product_id }) => {
  const product = await productModel.findOne({
    _id: product_id,
    product_shop: product_shop,
  });
  if (!product) return null;
  return await productModel.updateOne(product, {
    $set: { isPublish: false, isDraft: true },
  });
};
const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  const products = await productModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  console.log(products);
  return products;
};
const findProduct = async ({ product_id, unSelect }) => {
  return await productModel
    .findOne({ _id: product_id })
    .select(getUnSelectData(unSelect));
};
module.exports = {
  publishProduct,
  unpublishProduct,
  searchProductByKeySearch,
  findAllDraftProduct,
  findAllPublishedProduct,
  findAllProducts,
  findProduct,
};
