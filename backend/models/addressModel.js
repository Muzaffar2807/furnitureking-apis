const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const address = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    mobile_number: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    street_address: {
      type: String,
      required: true,
    },
    pin_code: {
      type: ObjectId,
      ref: "PinCode",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Address", address, "addressess");
