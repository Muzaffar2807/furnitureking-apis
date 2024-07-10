const jwt = require("jsonwebtoken");
const userDataServiceProvider = require("../services/userDataServiceProvider");
const config = require("../config/app");

class UserAuthMiddleware {
  checkAuthHeader(req, res, next) {
    if (!req.headers.authorization) {
      const resData = {
        success: false,
        message: "ACCESS DENIED",
      };
      return res.status(403).json(resData);
    }
    next();
  }
  async validateAccessToken(req, res, next) {
    try {
      const accessToken = req.headers.authorization
      const user = jwt.decode(accessToken);
      let userDetails = {};
      userDetails = await userDataServiceProvider.userById(user._id)

      const tokenSecret = config.jwt.token_secret + userDetails.password
      try {
        jwt.verify(accessToken, tokenSecret)
        req.user = userDetails
        next()
      } catch (error) {
        console.log(error)
        let resData = {
          success:false,
          message: error.message,
          error:error
        }
        return res.status(401).json(resData)
      }
    } catch (error) {
      let resData = {
        success: false,
        message: "Invalid Access Token",
      };
      return res.status(401).json(resData);
    }
  }
}
module.exports = new UserAuthMiddleware();
