const categoryModel = require("../models/categoryModel");

class categoryDataServiceProvider {
  async addCategory(data) {
    return await categoryModel.create(data);
  }
  async getAllCategory(query, startIndex, limit, sort) {
    return await categoryModel
      .find(query)
      .skip(startIndex)
      .limit(limit)
      .sort(sort);
  }
  async deleteCategory(categoryId) {
    return await categoryModel.deleteOne({ _id: categoryId });
  }
  async count() {
    return await categoryModel.countDocuments();
  }
  async getOneCategory(categoryId){
    return await categoryModel.findOne({_id: categoryId})
  }
}

module.exports = new categoryDataServiceProvider();
