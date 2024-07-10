const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

class userDataServiceProvider {
  async findUser(email, password) {
    let match = false;
    const user = await userModel.findOne({
      email: email,
    });
    if (user) {
      match = await bcrypt.compare(password, user.password);
      return match ? user : null;
    }
    return user;
  }
  async userById(userId) {
    return await userModel.findById(userId);
  }
  async userByEmail(email) {
    return await userModel.findOne({ email: email });
  }
  async emailFind(email, google_id) {
    return await userModel.findOne({ email: email, google_id: google_id });
  }
  async getAllUsers(startIndex, limit, sort) {
    return await userModel
      .find({ role: "User" })
      .skip(startIndex)
      .limit(limit)
      .sort(sort);
  }
  async userCount() {
    return await userModel.countDocuments();
  }
  async createUser(data) {
    return await userModel.create(data);
  }
  async updateUser(userId, data) {
    return await userModel.updateOne({ _id: userId }, { $set: data });
  }
  async getUser(userId){
    return await userModel.findOne({_id: userId})
  }
}

module.exports = new userDataServiceProvider();
