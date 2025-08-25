const mongoose = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "keys";
const COLLECTION_NAME = "keys";
// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "shops",
    },
    publicKey: {
      type: String,
      required: true,
    },
    refreshTokens: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);
