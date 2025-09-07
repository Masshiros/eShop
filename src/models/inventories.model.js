const mongoose = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "inventories";
const COLLECTION_NAME = "inventories";
// Declare the Schema of the Mongo model
var inventorySchema = new mongoose.Schema(
  {
    inventory_productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
    inventory_location: { type: String, default: "unknown" },
    inventory_stock: { type: Number, required: true },
    inventory_shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shops",
    },
    inventory_reservations: { type: Array, default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, inventorySchema);
