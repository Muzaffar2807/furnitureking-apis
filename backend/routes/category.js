const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");
const upload = require("../middleware/multer.middleware");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");

router.post(
  "/add_category",
  [userAuthMiddleware.checkAuthHeader, userAuthMiddleware.validateAccessToken],
  upload.single("file"),
  categoryController.addCategory
);

router.get(
  "/get_all_category",
  categoryController.getAllCategory
);

router.delete(
  "/delete_category",
  [userAuthMiddleware.checkAuthHeader, userAuthMiddleware.validateAccessToken],
  categoryController.deleteCategory
);

module.exports = router;
