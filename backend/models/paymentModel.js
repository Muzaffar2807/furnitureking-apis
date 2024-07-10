const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const payment = new mongoose.Schema(
  {
    user_email: {
      type: String,
      required: true,
    },
    payment_id: {
      type: String,
      required: true,
    },
    order_id: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      requried: true,
    },
    event: {
      type: String,
      requried: true,
    },
    method: {
      type: String,
      required: true,
    },
    card: {
      type: Object,
      required: false,
    },
    bank: {
      type: String,
      requried: false,
    },
    vpa: {
      type: String,
      requried: false,
    },
    payment_contact: {
      type: String,
      required: false,
    },
    error_description: {
      type: String,
      requried: false,
    },
    error_source: {
      type: String,
      requried: false,
    },
    error_step: {
      type: String,
      requried: false,
    },
    error_reason: {
      type: String,
      requried: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", payment, "payments");
