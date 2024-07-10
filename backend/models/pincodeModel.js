const mongoose = require("mongoose");

const pincode = new mongoose.Schema(
  {
    pincode: {
      type: String,
      required: true,
    },
    // amount: {
    //   type: Number,
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PinCode", pincode, "pincodes");
