const productModel = require("../models/productModel");

class ProductDataServiceProvider {
  async addProduct(data) {
    return await productModel.create(data);
  }
  async getAllProduct(query, startIndex, limit, sort) {
    return await productModel
      .find(query)
      .skip(startIndex)
      .limit(limit)
      .sort(sort);
  }
  async getOneProduct(productId) {
    return await productModel.findOne({ _id: productId });
  }
  async updateProduct(productId, data) {
    return await productModel.updateOne({ _id: productId }, { $set: data });
  }
  async deleteProduct(productId) {
    return await productModel.deleteOne({ _id: productId });
  }
  async getAllProductByStatus(status) {
    return await productModel.find({ status });
  }
  async count() {
    return await productModel.countDocuments();
  }
  async featureProducts() {
    return await productModel.find({ featured_product: true, status: "Active" });
  }
  async getProductByCategory(category) {
    return await productModel.find({ category: category });
  }
}

module.exports = new ProductDataServiceProvider();
