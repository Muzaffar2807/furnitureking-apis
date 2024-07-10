const pincodeDataServiceProvider = require("../services/pincodeDataServiceProvider");
const apiResponse = require("../helpers/apiResponse");

const addPincode = async (req, res) => {
  try {
    const data = req.body;
    const pin = await pincodeDataServiceProvider.addPincode(data);
    if (!pin) {
      return apiResponse.ErrorResponse(res, "Failed to add pincode");
    }
    return apiResponse.successResponseWithData(
      res,
      "successfully added pincode",
      pin
    );
  } catch (error) {
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const getAllPinCode = async (req, res) => {
  try {
    let query = {};
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

    if (req.query.pincode) {
      const pincode = req.query.pincode.toString()
      const regex = new RegExp(pincode, "i");
      query.pincode = { $regex: regex };
    }
    const total = await pincodeDataServiceProvider.count();
    const product = await pincodeDataServiceProvider.getAllPincode(
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
    console.log(error)
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const deletePincode = async (req, res) => {
  try {
    const pin = await pincodeDataServiceProvider.deletePincode(
      req.query.pincodeId
    );
    if (!pin) {
      return apiResponse.ErrorResponse(res, "failed to delete pincode data");
    }
    return apiResponse.successResponse(res, "succesfully deleted pincode");
  } catch (error) {
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

module.exports = {
  addPincode,
  getAllPinCode,
  deletePincode,
};
