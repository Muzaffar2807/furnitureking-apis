const productController = require("../controller/productController");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
const upload = require("../middleware/multer.middleware");
const express = require("express");
const router = express();

router.post(
  "/add_product",
  [userAuthMiddleware.checkAuthHeader, userAuthMiddleware.validateAccessToken],
  upload.array("files", 5),
  productController.addProduct
);
router.get(
  "/get_product",
  productController.getAllProduct
);
router.get(
  "/get_product_by_admin",
  [userAuthMiddleware.checkAuthHeader, userAuthMiddleware.validateAccessToken],
  productController.getAllProductByAdmin
);
router.get(
  "/get_product_by_product_id",
  productController.getProductByProductId
);
router.post(
  "/update_product",
  [userAuthMiddleware.checkAuthHeader, userAuthMiddleware.validateAccessToken],
  productController.updateProduct
);
router.post(
  "/delete_product",
  [userAuthMiddleware.checkAuthHeader, userAuthMiddleware.validateAccessToken],
  productController.deleteProduct
);
router.get(
  "/get_stats_of_product_by_status",
  [userAuthMiddleware.checkAuthHeader, userAuthMiddleware.validateAccessToken],
  productController.getStatsOfProductsBasedOnStatus
);
router.get(
  "/get_featured_product",
  productController.getListOfFeaturedProduct
);

module.exports = router;
