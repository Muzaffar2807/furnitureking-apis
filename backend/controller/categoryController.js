const categoryDataServiceProvider = require("../services/categoryDataServiceProvider");
const apiResponse = require("../helpers/apiResponse");
const uploadToCloudinary = require("../utils/cloudinary");
const cloudinary = require("../config/cloudinary");

const addCategory = async (req, res) => {
  try {
    const data = req.body;
    data.user = req.user._id;
    const file = req.file;
    if (!file) {
      return apiResponse.ErrorResponse(res, "No files uploaded");
    }
    const cloudinaryResponse = await uploadToCloudinary(file);
    if (!cloudinaryResponse) {
      return apiResponse.ErrorResponse(
        res,
        "Failed to upload image to Cloudinary"
      );
    }
    data.image = cloudinaryResponse.secure_url;
    const category = await categoryDataServiceProvider.addCategory(data);
    if (!category) {
      return apiResponse.ErrorResponse(res, "failed to add category");
    }
    return apiResponse.successResponseWithData(
      res,
      "successfully added category",
      category
    );
  } catch (error) {
    console.log(error);
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const getAllCategory = async (req, res) => {
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

    if (req.query.categoryName) {
      const regex = new RegExp(req.query.categoryName, "i");
      query.categoryName = { $regex: regex };
    }
    const total = await categoryDataServiceProvider.count();
    const category = await categoryDataServiceProvider.getAllCategory(
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
    if (!category) {
      return apiResponse.ErrorResponse(res, "failed to retreive all categorys");
    }
    return apiResponse.successResponseWithDataPagination(
      res,
      "successfully retreived categorys",
      category,
      category.length,
      pagination,
      total
    );
  } catch (error) {
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const deleteCategory = async (req, res) => {
  try {
    const getCategory = await categoryDataServiceProvider.getOneCategory(
      req.query.categoryId
    );
    if (!getCategory) {
      return apiResponse.ErrorResponse(res, "category not found");
    }
    if (getCategory.image) {
      const publicId = getCategory?.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }
    const category = await categoryDataServiceProvider.deleteCategory(
      req.query.categoryId
    );
    if (!category) {
      return apiResponse.ErrorResponse(res, "failed to delete category data");
    }
    return apiResponse.successResponse(res, "succesfully deleted category");
  } catch (error) {
    console.log(error)
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

module.exports = {
  addCategory,
  getAllCategory,
  deleteCategory,
};
