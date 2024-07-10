const pincodeModel = require("../models/pincodeModel");

class pincodeDataServiceProvider {
  async addPincode(data) {
    return await pincodeModel.create(data);
  }
  async getPincodeByPin(pin) {
    return await pincodeModel.findOne({ pincode: pin });
  }
  async getAllPincode(query,startIndex, limit, sort) {
    return await pincodeModel.find(query).skip(startIndex).limit(limit).sort(sort);
  }
  async deletePincode(pincodeId) {
    return await pincodeModel.deleteOne({ _id: pincodeId });
  }
  async count() {
    return await pincodeModel.countDocuments();
  }
}

module.exports = new pincodeDataServiceProvider();
