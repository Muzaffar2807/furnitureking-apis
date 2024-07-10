const orderDataServiceProvider = require("../services/orderDataServiceProvider");
const apiResponse = require("../helpers/apiResponse");
const addressDataServiceProvider = require("../services/addressDataServiceProvider");
const cartItemDataServiceProvider = require("../services/cartItemDataServiceProvider");
const { getNextOrderId } = require("../helpers/orderIdGenerate");
const bcrypt = require("bcrypt");
const userDataServiceProvider = require("../services/userDataServiceProvider");
const productDataServiceProvider = require("../services/productDataServiceProvider");

const placeOrder = async (req, res) => {
  try {
    const data = req.body;
    data.user = req.user._id;
    let totalCartAmount = 0;
    let cart = data.cart;

    const userAddress = await addressDataServiceProvider.getAddressOfUser(
      data.user
    );
    if (!userAddress) {
      const addressDoc = {
        user: data.user,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        mobile_number: data.mobile_number,
        city: data.city,
        state: data.state,
        street_address: data.street_address,
        pin_code: data.pin_code,
      };
      await addressDataServiceProvider.addAddress(addressDoc);
      await userDataServiceProvider.updateUser(data.user, { is_address: true });
    }

    const getCart = await cartItemDataServiceProvider.getCartOfUser(data.user);
    await getCart.forEach(async (e) => {
      totalCartAmount += e.total_price;
    });
    data.total_cart_amount = totalCartAmount;
    const orderId = await getNextOrderId();
    data.order_id = orderId;

    const order = await orderDataServiceProvider.placeOrder(data);
    if (!order) {
      return apiResponse.ErrorResponse(res, "failed to place order");
    }
    await cart.forEach(async (cart) => {
      const cartItem = await cartItemDataServiceProvider.getC(cart);
      const getProduct = await productDataServiceProvider.getOneProduct(
        cartItem.product_id._id
      );
      const productQuantity = getProduct.quantity;
      const cartQuantity = cartItem.quantity;
      const finalQuantity = productQuantity - cartQuantity;
      if (finalQuantity === 0) {
        await productDataServiceProvider.updateProduct(
          cartItem.product_id._id,
          {
            status: "Inactive",
          }
        );
      }
      if (cartQuantity > productQuantity) {
        return apiResponse.ErrorResponse(
          res,
          "cart quantity cannot be greater than product quantity"
        );
      } else {
        await cartItemDataServiceProvider.updateCart(cart, data.user, {
          status: "inactive",
        });
        await productDataServiceProvider.updateProduct(
          cartItem.product_id._id,
          {
            quantity: finalQuantity,
          }
        );
        return apiResponse.successResponseWithData(
          res,
          "successfully placed order",
          order
        );
      }
    });
  } catch (error) {
    console.log(error);
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await orderDataServiceProvider.getOrderDetails(
      req.query.orderId
    );
    if (!order) {
      return apiResponse.ErrorResponse(res, "failed to retreive order details");
    }
    return apiResponse.successResponseWithData(
      res,
      "successfully retreived order details",
      order
    );
  } catch (error) {
    console.log(error);
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const getStatsOfAllStatus = async (req, res) => {
  try {
    const order = await orderDataServiceProvider.getStatsBasedOnStatus();

    if (!order) {
      return apiResponse.ErrorResponse(res, "failed to retreive order stats");
    }
    return apiResponse.successResponseWithData(
      res,
      "successfully retreived order stats",
      order
    );
  } catch (error) {
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const getAllOrdersBasedOnUser = async (req, res) => {
  try {
    let totalUserOrderAmount = 0;
    const sort = {};
    const orderBy = req.query.order_by;
    const orderType = req.query.order_type;
    if (orderBy) {
      sort[`${orderBy}`] = orderType === "desc" ? -1 : 1;
    } else {
      sort["createdAt"] = -1;
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const user = req.user._id;
    const total = await orderDataServiceProvider.count();
    const order = await orderDataServiceProvider.getAllOrdersBasedOnUser(
      user,
      startIndex,
      limit,
      sort
    );
    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }
    if (!order) {
      return apiResponse.ErrorResponse(
        res,
        "failed to retreive user based order"
      );
    }
    order.forEach((O) => {
      totalUserOrderAmount += O.total_cart_amount;
    });
    return apiResponse.successResponseWithDataPagination(
      res,
      "successfully retreived order data",
      { order, totalUserOrderAmount },
      order.length,
      pagination
    );
  } catch (error) {
    console.log(error);
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const getTotalSalesAmountOfAllOrders = async (req, res) => {
  try {
    const query = {};
    let salesAmount = 0;
    query.status = "Completed";
    const sales = await orderDataServiceProvider.getTotalSales(query);
    if (!sales) {
      return apiResponse.ErrorResponse(res, "failed to retreive sales amount");
    }
    sales.forEach((S) => {
      salesAmount += S.total_cart_amount;
    });
    return apiResponse.successResponseWithData(
      res,
      "successfully retreived sales amount",
      salesAmount
    );
  } catch (error) {
    console.log(error);
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const getAllOrder = async (req, res) => {
  try {
    const sort = {};
    const orderBy = req.query.order_by;
    const orderType = req.query.order_type;
    if (orderBy) {
      sort[`${orderBy}`] = orderType === "desc" ? -1 : 1;
    } else {
      sort["createdAt"] = -1;
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let query = {};
    if (req.query.orderId) {
      const regex = new RegExp(req.query.orderId, "i");
      query.order_id = { $regex: regex };
    }
    if (req.query.status) {
      query.status = req.query.status;
    }
    const total = await orderDataServiceProvider.count();
    const orders = await orderDataServiceProvider.getAllOrders(
      query,
      startIndex,
      limit,
      sort
    );

    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }
    if (!orders) {
      return apiResponse.ErrorResponse(res, "failed to retreive all orders");
    }
    return apiResponse.successResponseWithDataPagination(
      res,
      "successfully retreived orders",
      orders,
      orders.length,
      pagination,
      total
    );
  } catch (error) {
    console.log(error);
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { password, status, orderId } = req.body;
    const userId = req.user._id;

    const admin = await userDataServiceProvider.userById(userId);
    const passwordCheck = await bcrypt.compare(password, admin.password);
    if (passwordCheck === false) {
      return apiResponse.ErrorResponse(
        res,
        "Authentication failed or wrong password"
      );
    }

    const order = await orderDataServiceProvider.updateOrderStatus(
      orderId,
      status
    );
    if (!order) {
      return apiResponse.ErrorResponse(res, "Failed to update Order");
    }
    return apiResponse.successResponseWithData(
      res,
      "successfully updated order",
      order
    );
  } catch (error) {
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const getAdminOrderById = async (req, res) => {
  try {
    const order = await orderDataServiceProvider.getOrderDetails(
      req.query.orderId
    );
    if (!order) {
      return apiResponse.ErrorResponse(res, "failed to retreive order details");
    }
    const orderUser = order.user;
    const userAddress = await addressDataServiceProvider.getAddressOfUser(
      orderUser
    );

    return apiResponse.successResponseWithData(
      res,
      "successfully retreived order details",
      { order, userAddress }
    );
  } catch (error) {
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const getMonthlySales = async (req, res) => {
  try {
    const salesStats = await orderDataServiceProvider.getTotalSalesByMonth();
    if (!salesStats) {
      return apiResponse.ErrorResponse(res, "failed to load monthly stats");
    }
    return apiResponse.successResponseWithData(
      res,
      "Total sales by month retrieved successfully",
      salesStats
    );
  } catch (error) {
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const getYearlySales = async (req, res) => {
  try {
    const salesStats = await orderDataServiceProvider.getTotalSalesByYear();
    if (!salesStats) {
      return apiResponse.ErrorResponse(res, "failed to load yearly stats");
    }
    return apiResponse.successResponseWithData(
      res,
      "Total sales by year retrieved successfully",
      salesStats
    );
  } catch (error) {
    console.log(error)
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

module.exports = {
  placeOrder,
  getOrder,
  getStatsOfAllStatus,
  getAllOrdersBasedOnUser,
  getTotalSalesAmountOfAllOrders,
  getAllOrder,
  updateOrderStatus,
  getAdminOrderById,
  getMonthlySales,
  getYearlySales,
};
