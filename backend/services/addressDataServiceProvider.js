const addressModel = require("../models/addressModel");

class addressDataServiceProvider {
  async addAddress(data) {
    return await addressModel.create(data);
  }
  async getAddressOfUser(userId) {
    return await addressModel.findOne({ user: userId }).populate("pin_code");
  }
  async updateAddress(addressId, userId, data) {
    return await addressModel.updateOne(
      { _id: addressId, user: userId },
      { $set: data }
    );
  }
}

module.exports = new addressDataServiceProvider();
