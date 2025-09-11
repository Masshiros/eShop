const {
  BadRequestResponseError,
  NotFoundResponseError,
} = require("../core/error.response");
const discountModel = require("../models/discount.model");
const {
  findAllDiscountsUnSelect,
  findOneDiscount,
} = require("../models/repositories/discount.repo");
const { convertToObjectIdMongodb } = require("../utils");
const { findAllProducts } = require("./product.service");

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      name,
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      description,
      type,
      value,
      users_used,
      max_uses,
      used_count,
      max_uses_per_user,
    } = payload;
    if (new Date() > new Date(end_date)) {
      throw new BadRequestResponseError({
        message: "Discount has been expired",
      });
    }
    if (new Date(start_date) > new Date(end_date)) {
      throw new BadRequestResponseError({
        message: "Start date is greater than end date",
      });
    }

    const discount = await findOneDiscount({
      model: discountModel,
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });
    if (discount && discount.discount_is_active) {
      throw new BadRequestResponseError({ message: "Discount already exist" });
    }
    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_code: code,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_uses: max_uses,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_used_count: used_count,
      discount_users_used: users_used || [],
      discount_shopId: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applied_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });
    return newDiscount;
  }
  static async getAllProductOfDiscountCode({ code, shopId, limit, page }) {
    // validate discount

    const discount = await findOneDiscount({
      model: discountModel,
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!discount || !discount.discount_is_active) {
      throw new NotFoundResponseError({ message: "Discount is not exist" });
    }
    // get discount apply to who
    const { discount_applied_to, discount_product_ids } = discount;
    let products;

    if (discount_applied_to === "all") {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublish: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_applied_to === "specific") {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublish: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    console.log(products);
    return products;
  }
  static async getAllDiscountCodeByShop({ shopId, limit, page }) {
    return await findAllDiscountsUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true,
      },
      unselect: ["__v", "discount_shopId"],
      model: discountModel,
    });
  }
  static async getDiscountAmount({ code, userId, shopId, products }) {
    // check discount exist
    const discount = await findOneDiscount({
      model: discountModel,
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });
    if (!discount || !discount.discount_is_active) {
      throw new NotFoundResponseError({ message: "Discount is not exist" });
    }
    // check discount active - max uses - dates
    if (!discount.discount_is_active) {
      throw new BadRequestResponseError({
        message: "Discount has been expired",
      });
    }

    if (discount.discount_max_uses === 0) {
      throw new BadRequestResponseError({ message: "Discount unavailable" });
    }
    const {
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_users_used,
      discount_type,
      discount_value,
      discount_start_date,
      discount_end_date,
    } = discount;
    if (new Date() > new Date(discount_end_date)) {
      throw new BadRequestResponseError({
        message: "Discount has been expired",
      });
    }

    let totalOrder = 0;
    if (discount_min_order_value >= 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new BadRequestResponseError({
          message: `Discount requires a minimum order value of ${discount_min_order_value}`,
        });
      }
    }
    // check discount max_uses_per_user

    if (discount_max_uses_per_user > 0) {
      for (let i = 0; i < discount_users_used.length; i++) {
        if (discount_users_used[userId]) {
          discount_max_uses_per_user--;
        }
      }
    }
    if (discount_max_uses_per_user < 0) {
      throw new BadRequestResponseError({
        message: "You have used this discount",
      });
    }
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : (totalOrder * discount_value) / 100;
    return {
      totalOrder,
      discount: amount,
      finalPrice: totalOrder - amount,
    };
  }
  static async deleteDiscount({ code, shopId }) {
    const discount = await findOneDiscount({
      model: discountModel,
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });
    if (!discount) {
      throw new BadRequestResponseError({ message: "Discount is not exist" });
    } else {
      // check discount already use in cart or sth
    }
    const deleted = await discountModel.findOneAndDelete({
      discount_code: code,
      discount_shopId: convertToObjectIdMongodb(shopId),
    });
    return deleted;
  }
  // cancel discount
  static async cancelDiscount({ code, shopId, userId }) {
    const discount = await findOneDiscount({
      model: discountModel,
      filter: {
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });
    if (!discount) {
      throw new BadRequestResponseError({ message: "Discount is not exist" });
    }
    const updated = await discountModel.findByIdAndUpdate(discount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_used_count: -1,
      },
    });
    return updated;
  }
}
module.exports = DiscountService;
