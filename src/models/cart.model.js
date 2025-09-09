const mongoose = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "carts";
const COLLECTION_NAME = "carts";
// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ["active", "completed", "pending", "failed"],
      default: "active",
    },
    cart_products: { type: Array, required: true, default: [] },
    cart_count_products: { type: Number, default: 0 },
    cart_userId: {
      type: mongoose.Types.ObjectId,
      ref: "shops",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, cartSchema);
