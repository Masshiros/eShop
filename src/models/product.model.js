const mongoose = require("mongoose"); // Erase if already required
const { default: slugify } = require("slugify");
const DOCUMENT_NAME = "products";
const COLLECTION_NAME = "products";
// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
    },
    product_slug: {
      type: String,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: String,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Furniture"],
    },
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shops",
    },
    product_attributes: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    product_averageRatings: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be under 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublish: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
productSchema.index({ product_name: "text", product_description: "text" });
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});
// clothing
const clothingSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shops",
    },
  },
  {
    collection: "clothes",
    timestamps: true,
  }
);
// electronics
const electronicSchema = new mongoose.Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shops",
    },
  },
  {
    collection: "electronics",
    timestamps: true,
  }
);
// furniture
const furnitureSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shops",
    },
  },
  {
    collection: "furnitures",
    timestamps: true,
  }
);

//Export the model
module.exports = {
  productModel: mongoose.model(DOCUMENT_NAME, productSchema),
  electronicModel: mongoose.model("electronics", electronicSchema),
  clothingModel: mongoose.model("clothings", clothingSchema),
  furnitureModel: mongoose.model("furnitures", furnitureSchema),
};
