const paymentModel = require("../models/paymentModel");

class paymentDataServiceProvider {
  async addPayment(data) {
    return await paymentModel.create(data);
  }
  async getPayment(email) {
    return await paymentModel.findOne({ user_email: email });
  }
}

module.exports = new paymentDataServiceProvider();
