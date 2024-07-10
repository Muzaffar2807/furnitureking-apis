const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    profile_picture: {
      type: String,
      required: false,
    },
    google_id: {
      type: String,
      required: false
    },
    role: {
      type: String,
      enum: ["User", "Admin" ],
      required: true,
      default: "User"
    },
    is_address:{
      type: Boolean,
      default: false,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userModel, 'users')