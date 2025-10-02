const mongoose = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "notifications";
const COLLECTION_NAME = "notifications";

// Declare the Schema of the Mongo model
var notificationSchema = new mongoose.Schema(
  {
    noti_type: {
      type: String,
      enum: ["ORDER-001", "ORDER-002", "PROMOTION-001", "SHOP-001"],
      required: true,
    },
    noti_senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    noti_receivedId: { type: mongoose.Schema.Types.ObjectId, required: true },
    noti_content: { type: String, required: true },
    noti_options: { type: Object, default: {} },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, notificationSchema);
