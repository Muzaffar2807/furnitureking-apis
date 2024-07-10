const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const order = new mongoose.Schema(
  {
    order_id:{
      type: String,
      required: true
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    cart: {
      type: [ObjectId],
      ref: "CartItem",
      required: true,
    },
    shipping_charges:{
      type: Number,
      required: false
    },
    total_cart_amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: [
        "Inprogress",
        "Out For Delivery",
        "Delivered",
        "Completed",
        "Rejected",
      ],
      default: "Inprogress",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", order, "orders");
