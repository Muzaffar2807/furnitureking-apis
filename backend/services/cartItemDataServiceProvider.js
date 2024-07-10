const cartItemModel = require("../models/cartItemModel");
const productModel = require("../models/productModel");

class cartItemDataServiceProvider {
  async addToCart(data) { 
    const cartItem = await cartItemModel.create(data);
    return await cartItem.populate("product_id")
  }
  async getCart(userid, startIndex, limit, sort) {
    return await cartItemModel
      .find({ user: userid, status: "active" })
      .skip(startIndex)
      .limit(limit)
      .sort(sort)
      .populate("product_id");
  }
  async getCartOfUser(userId) {
    return await cartItemModel
      .find({ user: userId, status: "active" })
      .populate("product_id");
  }
  async getCartByProductId(productId, userid) {
    return await cartItemModel.findOne({ product_id: productId, user: userid });
  }
  async count() {
    return await cartItemModel.countDocuments();
  }
  async deleteCart(cartId) {
    return await cartItemModel.deleteOne({ _id: cartId });
  }
  async deleteAllCartByProductId(productId) {
    return await cartItemModel.deleteMany({ product_id: productId });
  }
  async updateCart(cartId, userId, data) {
    return await cartItemModel.updateOne(
      { _id: cartId, user: userId },
      { $set: data }
    );
  }
  async getC(cartId) {
    return await cartItemModel.findOne({ _id: cartId }).populate("product_id");
  }
}

module.exports = new cartItemDataServiceProvider();
