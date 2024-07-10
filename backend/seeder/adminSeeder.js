const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const saltRounds = 12;

const main = async (req, res) => {
  try {
    let admin = {
      name: "Admin",
      email: "Admin@furnitureking.com",
      role: "Admin",
      password: await bcrypt.hash("123123", saltRounds),
    };
    const adminExst = await userModel.findOne({ role: "Admin" });
    if (adminExst != null) {
      let message = "Admin already exists";
      return message;
    } else {
      await userModel.create(admin);
      console.log("Restored Admin");
    }
  } catch (error) {
    console.log("admin seeder error", error);
  }
};

module.exports = main();
