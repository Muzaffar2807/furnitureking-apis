const userDataServiceProvider = require("../services/userDataServiceProvider");
const apiResponse = require("../helpers/apiResponse");
const config = require("../config/app");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

const userSignIn = async (req, res) => {
  try {
    const data = {
      email: req.body.email,
      password: req.body.password,
    };

    let userData = await userDataServiceProvider.findUser(
      data.email,
      data.password
    );
    if (!userData) {
      return apiResponse.ErrorResponse(res, "Invalid Credentials");
    }
    userData = userData.toObject();
    const tokenSecret = config.jwt.token_secret + userData.password;
    const refreshTokenSecret =
      config.jwt.refresh_token_secret + userData.password;

    const token = jwt.sign(userData, tokenSecret, {
      expiresIn: config.jwt.token_life,
    });
    const refreshToken = jwt.sign(userData, refreshTokenSecret, {
      expiresIn: config.jwt.refresh_token_life,
    });
    userData.access_token = token;
    userData.refresh_token = refreshToken;
    delete userData.password;

    return apiResponse.successResponseWithData(
      res,
      "Login Successful",
      userData
    );
  } catch (error) {
    console.log(error);
    return apiResponse.ErrorResponse(res, "error occured while logging in");
  }
};

const signOut = async (req, res) => {
  try {
    return apiResponse.successResponse(res, "signed out successfully");
  } catch (error) {
    return apiResponse.ErrorResponse(res, "error occured while signing out");
  }
};

const getUserCount = async (req, res) => {
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

    const total = await userDataServiceProvider.userCount();
    const user = await userDataServiceProvider.getAllUsers(
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
    if (!user) {
      return apiResponse.ErrorResponse("failed to retreive user count");
    }
    return apiResponse.successResponseWithDataPagination(
      res,
      "successfully retreived user count",
      user,
      user.length,
      pagination,
      total
    );
  } catch (error) {
    console.log(error);
    return apiResponse.ErrorResponse(
      res,
      "error occured while getting user count"
    );
  }
};

const addUser = async (req, res) => {
  try {
    const { token } = req.body;
    console.log("token", token);
    const userDetails = jwt.decode(token);

    const data = {
      name: userDetails.name,
      google_id: userDetails.sub,
      email: userDetails.email,
      profile_picture: userDetails.picture,
    };
    const user = await userDataServiceProvider.emailFind(
      data.email,
      data.google_id
    );
    if (user === null) {
      const newuser = await userDataServiceProvider.createUser(data);
      if (!newuser) {
        return apiResponse.ErrorResponse(res, "failed to add user");
      }
      console.log("user 1", newuser);
      return apiResponse.successResponseWithData(
        res,
        "successful user authentication",
        newuser
      );
    }
    console.log("user 2", user);
    return apiResponse.successResponseWithData(
      res,
      "successful user authenticaion",
      user
    );
  } catch (error) {
    console.log(error);
    return apiResponse.ErrorResponse(res, "Error occured while adding user");
  }
};

const updateAdminPassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const email = req.user.email;
    const { oldPassword, newPassword } = req.body;

    const userData = await userDataServiceProvider.findUser(email, oldPassword);

    if (!userData || userData === null) {
      return apiResponse.ErrorResponse(res, "Invalid Credentials");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await userModel.findById(userId);

    user.password = hashedPassword;
    await user.save();
    return apiResponse.successResponse(
      res,
      "successfully updated admin password"
    );
  } catch (error) {
    console.log(error);
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const getUser = async (req, res) => {
  try {
    const user = req.user._id;
    const User = await userDataServiceProvider.getUser(user);
    if (!User) {
      return apiResponse.ErrorResponse(res, "failed to retreive the user");
    }
    return apiResponse.successResponseWithData(
      res,
      "successfully retreived the user data",
      User
    );
  } catch (error) {
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

module.exports = {
  userSignIn,
  signOut,
  getUserCount,
  addUser,
  updateAdminPassword,
  getUser,
};
