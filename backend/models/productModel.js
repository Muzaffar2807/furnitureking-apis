const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const product = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    offer_price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: false,
    },
    images: {
      type: [String],
      required: true,
    },
    banner_image: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Sofas",
        "Chairs",
        "Beds",
        "Tables",
        "Dining Tables",
        "Mattress",
        "Bean Bags",
        "Wardrobes",
        "Tea Tables",
        "Bedsheets",
        "Curtains",
        "Wallpapers",
        "Others",
      ],
    },
    featured_product: {
      type: Boolean,
      default: false,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Out Of Stock"],
      default: "Active",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", product, "products");
