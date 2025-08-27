const mongoose = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "keys-lv0";
const COLLECTION_NAME = "keys-lv0";
// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "shops",
    },
    // public for AT secret-key
    publicKey: {
      type: String,
      required: true,
    },
      // private for RT secret-key
    privateKey: {
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
