const mongoose = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "discounts";
const COLLECTION_NAME = "discounts";
// Declare the Schema of the Mongo model
var discountSchema = new mongoose.Schema(
  {
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: "fixed_amount" }, //percentage
    discount_value: { type: Number, required: true }, // 10000,10%
    discount_code: { type: String, required: true, index: true }, // discountCode
    discount_start_date: { type: Date, required: true }, // start date
    discount_end_date: { type: Date, required: true }, // end date
    discount_max_uses: { type: Number, required: true }, // number of discount can be used
    discount_used_count: { type: Number, required: true }, // number of discount have been used
    discount_users_used: { type: Array, default: [] }, // whos used discount
    discount_max_uses_per_user: { type: Number, required: true }, // the number each user can use maximum
    discount_min_order_value: { type: Number, required: true },
    discount_shopId: { type: mongoose.Schema.Types.ObjectId, ref: "shops" },
    discount_is_active: { type: Boolean, default: true },
    discount_applied_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: { type: Array, default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, discountSchema);
