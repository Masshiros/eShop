const mongoose = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "comments";
const COLLECTION_NAME = "comments";
// Declare the Schema of the Mongo model
var commentSchema = new mongoose.Schema(
  {
    comment_productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
    comment_userId: { type: mongoose.Schema.Types.ObjectId, ref: "shops" },
    comment_content: { type: String, default: "text" },
    comment_left: { type: Number, default: 0 },
    comment_right: { type: Number, default: 0 },
    comment_parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DOCUMENT_NAME,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, commentSchema);
