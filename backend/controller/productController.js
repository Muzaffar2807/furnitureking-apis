const productDataServiceProvider = require("../services/productDataServiceProvider");
const apiResponse = require("../helpers/apiResponse");
const uploadToCloudinary = require("../utils/cloudinary");
const cloudinary = require("../config/cloudinary");
const cartItemDataServiceProvider = require("../services/cartItemDataServiceProvider");

const addProduct = async (req, res) => {
  try {
    const data = req.body;
    data.user = req?.user?._id;
    const files = req.files;
    const cloudinaryResponses = [];
    if (!req.files || req.files.length === 0) {
      return apiResponse.ErrorResponse(res, "No files uploaded");
    }

    const uploadTasks = files.map(async (file) => {
      const cloudinaryResponse = await uploadToCloudinary(file);
      if (cloudinaryResponse) {
        cloudinaryResponses.push(cloudinaryResponse.secure_url);
      } else {
        return apiResponse.ErrorResponse(
          res,
          "Failed to upload images to Cloudinary"
        );
      }

      data.images = cloudinaryResponses;
    })

    await Promise.all(uploadTasks);
    const price = data.price;
    const offerPrice = data.offer_price;

    const discountPercentage = ((price - offerPrice) / price) * 100;
    data.discount = Math.floor(discountPercentage);
    const product = await productDataServiceProvider.addProduct(data);
    if (!product) {
      return apiResponse.ErrorResponse(res, "Failed To Add Product");
    }
    return apiResponse.successResponseWithData(
      res,
      "Successfully Added Product",
      product
    );
  } catch (error) {
    console.log(error);
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const getAllProduct = async (req, res) => {
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
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.productName) {
      const regex = new RegExp(req.query.productName, "i");
      query.name = { $regex: regex };
    }
    query.status = 'Active'
    const total = await productDataServiceProvider.count();
    const product = await productDataServiceProvider.getAllProduct(
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
    if (!product) {
      return apiResponse.ErrorResponse(res, "failed to retreive all products");
    }
    return apiResponse.successResponseWithDataPagination(
      res,
      "successfully retreived products",
      product,
      product.length,
      pagination,
      total
    );
  } catch (error) {
    console.log(error);
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const getAllProductByAdmin = async (req, res) => {
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
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.productName) {
      const regex = new RegExp(req.query.productName, "i");
      query.name = { $regex: regex };
    }
    const total = await productDataServiceProvider.count();
    const product = await productDataServiceProvider.getAllProduct(
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
    if (!product) {
      return apiResponse.ErrorResponse(res, "failed to retreive all products");
    }
    return apiResponse.successResponseWithDataPagination(
      res,
      "successfully retreived products",
      product,
      product.length,
      pagination,
      total
    );
  } catch (error) {
    console.log(error);
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const getProductByProductId = async (req, res) => {
  try {
    const query = req.query.productId;
    const product = await productDataServiceProvider.getOneProduct(query);
    if (!product) {
      return apiResponse.ErrorResponse(res, "failed to retreive product");
    }
    return apiResponse.successResponseWithData(
      res,
      "successfully retreived products",
      product
    );
  } catch (error) {
    console.log(error);
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const updateProduct = async (req, res) => {
  try {
    const data = req.body;
    const price = data.price;
    const offerPrice = data.offer_price;

    const discountPercentage = ((price - offerPrice) / price) * 100;
    data.discount = Math.floor(discountPercentage);
    if (data.quantity > 0) {
      data.status = "Active"
    }

    const product = await productDataServiceProvider.updateProduct(
      req.query.productId,
      data
    );
    if (!product) {
      return apiResponse.ErrorResponse(res, "failed to update product");
    }
    return apiResponse.successResponseWithData(
      res,
      "successfully updated product",
      product
    );
  } catch (error) {
    console.log(error);
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const deleteProduct = async (req, res) => {
  try {
    const getProduct = await productDataServiceProvider.getOneProduct(
      req.query.productId
    );
    if (!getProduct) {
      return apiResponse.ErrorResponse(res, "Product not found");
    }
    for (const imageUrl of getProduct.images) {
      const publicId = imageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    const product = await productDataServiceProvider.deleteProduct(
      req.query.productId
    );
    if (!product) {
      return apiResponse.ErrorResponse(res, "failed to delete product");
    }
    const cart = await cartItemDataServiceProvider.deleteAllCartByProductId(
      req.query.productId
    );
    if (!cart) {
      return apiResponse.ErrorResponse(res, "failed to delete cart");
    }

    return apiResponse.successResponseWithData(
      res,
      "successfully deleted product status"
    );
  } catch (error) {
    console.log(error);
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const getStatsOfProductsBasedOnStatus = async (req, res) => {
  try {
    const { status } = req.query;
    let product;
    if (status) {
      product = await productDataServiceProvider.getAllProductByStatus(status);
    } else {
      product = await productDataServiceProvider.getAllProduct();
    }
    if (!product) {
      return apiResponse.ErrorResponse(res, "failed to get stats of product");
    }
    return apiResponse.successResponseWithData(
      res,
      "successfully retreived product stats",
      { count: product.length }
    );
  } catch (error) {
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const getListOfFeaturedProduct = async (req, res) => {
  try {
    const product = await productDataServiceProvider.featureProducts();
    if (!product) {
      return apiResponse.ErrorResponse(
        res,
        "failed to get the feature products"
      );
    }
    return apiResponse.successResponseWithData(
      res,
      "successfully retreived featured products",
      product
    );
  } catch (error) {
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

module.exports = {
  addProduct,
  getAllProduct,
  getProductByProductId,
  updateProduct,
  deleteProduct,
  getStatsOfProductsBasedOnStatus,
  getListOfFeaturedProduct,
  getAllProductByAdmin
};
