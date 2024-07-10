const cartItemDataServiceProvider = require("../services/cartItemDataServiceProvider");
const apiResponse = require("../helpers/apiResponse");
const productDataServiceProvider = require("../services/productDataServiceProvider");
const userDataServiceProvider = require("../services/userDataServiceProvider");

const addToCart = async (req, res) => {
  try {
    const { product_id } = req.body;
    const user = req.user._id;
    const product = await productDataServiceProvider.getOneProduct(product_id);

    const cartData = {
      user,
      product_id,
      total_price: product.offer_price,
    };

    const cart = await cartItemDataServiceProvider.addToCart(cartData);
    if (!cart) {
      return apiResponse.ErrorResponse(res, "failed to add to cart");
    }
    return apiResponse.successResponseWithData(
      res,
      "successfully added to cart",
      cart
    );
  } catch (error) {
    console.log(error);
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const getCartOfUser = async (req, res) => {
  try {
    const user = req.user._id;
    let amountPayableByUser = 0;
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

    const total = await cartItemDataServiceProvider.count();
    const cart = await cartItemDataServiceProvider.getCart(
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
    if (!cart) {
      return apiResponse.ErrorResponse(res, "failed to retreive cart");
    }
    cart.forEach(async (C) => {
      amountPayableByUser += C.total_price;
    });
    return apiResponse.successResponseWithDataPagination(
      res,
      "successfully retreived cart data",
      {
        cart,
        totalCartAmount: amountPayableByUser,
      },
      cart.length,
      pagination
    );
  } catch (error) {
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const deleteCart = async (req, res) => {
  try {
    const cart = await cartItemDataServiceProvider.deleteCart(req.query.cartId);
    if (!cart) {
      return apiResponse.ErrorResponse(res, "Failed to delete cart");
    }
    return apiResponse.successResponse(res, "successfully deleted cart");
  } catch (error) {
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const updateCart = async (req, res) => {
  try {
    const { quantity, cartId } = req.body;
    const user = req.user._id;
    const getCart = await cartItemDataServiceProvider.getC(cartId);
    const productCost = getCart.product_id.offer_price;
    const totalprice = productCost * quantity;
    if (quantity < getCart.product_id.quantity) {
      const updatedCart = await cartItemDataServiceProvider.updateCart(
        cartId,
        user,
        { total_price: totalprice, quantity: quantity }
      );
      return apiResponse.successResponseWithData(
        res,
        "successfully updated cart",
        updatedCart
      );
    }else{
      return apiResponse.conflictResponse(
        res,
        "Apologies required quantity is greater than available quantity"
      );
    }
  } catch (error) {
    console.log(error);
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

module.exports = {
  addToCart,
  getCartOfUser,
  deleteCart,
  updateCart,
};
