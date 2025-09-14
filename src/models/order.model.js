const mongoose = require("mongoose"); // Erase if already required
const { default: slugify } = require("slugify");
const DOCUMENT_NAME = "orders";
const COLLECTION_NAME = "orders";
// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    order_userId: { type: mongoose.Schema.ObjectId, ref: "shops" },
    order_checkout: { type: Object, default: {} },
    /**
     * order_checkout = {
     * totalPrice, totalApplyDiscount,feeShip
     * }
     */
    order_shipping: { type: Object, default: {} },
    /**
     * street,
     * city,
     * state,
     * country
     */
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, require: true },
    order_trackingNumber: { type: String, default: "#0000114092025" },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = {
  orderModel: mongoose.model(DOCUMENT_NAME, orderSchema),
};
