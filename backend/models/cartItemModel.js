const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const cartItem = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    product_id: {
      type: ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      required: false,
    },
    total_price: {
      type: Number,
      required: false
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default : "Active",
      required: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CartItem", cartItem, "cartItems");
