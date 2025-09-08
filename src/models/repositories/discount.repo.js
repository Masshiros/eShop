const { getSelectData, getUnSelectData } = require("../../utils");
const discountModel = require("../discount.model");
const findAllDiscountsSelect = async ({
  limit,
  sort = "ctime",
  page,
  filter,
  select,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  const discounts = await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return discounts;
};
const findAllDiscountsUnSelect = async ({
  limit,
  sort = "ctime",
  page,
  filter,
  unselect,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  const discounts = await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unselect))
    .lean();

  return discounts;
};
const findOneDiscount = async ({ model, filter }) => {
  return await model.findOne(filter).lean();
};
module.exports = {
  findAllDiscountsSelect,
  findAllDiscountsUnSelect,
  findOneDiscount,
};
