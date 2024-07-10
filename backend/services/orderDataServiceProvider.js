const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartItemModel");
const productModel = require("../models/productModel");

class orderDataServiceProvider {
  async placeOrder(data) {
    return await orderModel.create(data);
  }
  async getOrderDetails(orderId) {
    return await orderModel
      .findOne({ _id: orderId })
      .populate("user")
      .populate({
        path: "cart",
        populate: {
          path: "product_id",
          model: productModel,
        },
      });
  }
  async getStatsBasedOnStatus() {
    const stats = await orderModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
    ]);
    return stats;
  }
  async getTotalSales(query) {
    return await orderModel.find(query);
  }
  async getAllOrdersBasedOnUser(user, startIndex, limit, sort) {
    return await orderModel
      .find({ user })
      .skip(startIndex)
      .limit(limit)
      .sort(sort)
      .populate({
        path: "cart",
        populate: {
          path: "product_id",
          model: productModel,
        },
      });
  }
  async count() {
    return await orderModel.countDocuments();
  }
  async getAllOrders(query, startIndex, limit, sort) {
    return await orderModel
      .find(query)
      .skip(startIndex)
      .limit(limit)
      .sort(sort)
      .populate("user")
      .populate({
        path: "cart",
        populate: {
          path: "product_id",
          model: productModel,
        },
      });
  }
  async updateOrderStatus(orderId, status) {
    return await orderModel.updateOne({ _id: orderId }, { status: status });
  }
  async getTotalSalesByMonth() {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const sales = await orderModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalSales: { $sum: "$total_cart_amount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          totalSales: 1,
        },
      },
    ]);
    const mappedSalesStats = sales.map((stat) => ({
      totalSales: stat.totalSales,
      month: monthNames[stat.month - 1],
      year: stat.year,
    }));

    return mappedSalesStats;
  }

  async getTotalSalesByYear() {
    const salesStats = await orderModel.aggregate([
      {
        $group: {
          _id: { year: { $year: "$createdAt" } },
          totalSales: { $sum: "$total_cart_amount" },
        },
      },
      {
        $sort: { "_id.year": 1 },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          totalSales: 1,
        },
      },
    ]);

    return salesStats;
  }

  async userOrder(user) {
    return await orderModel.find({ user });
  }
}
module.exports = new orderDataServiceProvider();
