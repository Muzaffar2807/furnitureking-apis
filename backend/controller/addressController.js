const addressDataServiceProvider = require("../services/addressDataServiceProvider");
const apiResponse = require("../helpers/apiResponse");

const getAddressDetailsBasedOnUser = async (req, res) => {
  try {
    const address = await addressDataServiceProvider.getAddressOfUser(
      req.user._id
    );
    if (!address) {
      return apiResponse.ErrorResponse(res, "failed to retreive address data");
    }
    return apiResponse.successResponseWithData(
      res,
      "successfully retreived address data",
      address
    );
  } catch (error) {
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const updateAddressOfUser = async (req, res) => {
  try {
    const addressId = req.query.addressId;
    const userId = req.user._id;
    const address = await addressDataServiceProvider.updateAddress(
      addressId,
      userId,
      req.body
    );
    if (!address) {
      return apiResponse.ErrorResponse(res, "failed to update address");
    }
    return apiResponse.successResponseWithData(
      res,
      "successfully updated address",
      address
    );
  } catch (error) {
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

module.exports = {
  getAddressDetailsBasedOnUser,
  updateAddressOfUser,
};
