const userController = require("../controller/userController");
const express = require("express");
const router = express.Router();
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
const GoogleUserMiddleware = require('../middleware/googleUserMiddleware')

router.post("/login", userController.userSignIn);
router.post("/logout", userController.signOut);
router.get("/get_user_count", userController.getUserCount);
router.post("/add_user", userController.addUser);
router.post(
  "/update_password",
  [userAuthMiddleware.checkAuthHeader, userAuthMiddleware.validateAccessToken],
  userController.updateAdminPassword
);
router.get('/get_user',GoogleUserMiddleware, userController.getUser)
module.exports = router;
