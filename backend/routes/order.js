const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const GoogleUserMiddleware = require("../middleware/googleUserMiddleware");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");

router.post("/place_order", GoogleUserMiddleware, orderController.placeOrder);

router.get("/get_order", GoogleUserMiddleware, orderController.getOrder);

router.get(
  "/get_stats_of_all_order_status",
  [userAuthMiddleware.checkAuthHeader, userAuthMiddleware.validateAccessToken],
  orderController.getStatsOfAllStatus
);

router.get(
  "/get_orders_based_on_user",
  GoogleUserMiddleware,
  orderController.getAllOrdersBasedOnUser
);

router.get(
  "/get_total_sales_amount",
  [userAuthMiddleware.checkAuthHeader, userAuthMiddleware.validateAccessToken],
  orderController.getTotalSalesAmountOfAllOrders
);

router.get(
  "/get_all_order",
  [userAuthMiddleware.checkAuthHeader, userAuthMiddleware.validateAccessToken],
  orderController.getAllOrder
);

router.post(
  "/update_order_status",
  [userAuthMiddleware.checkAuthHeader, userAuthMiddleware.validateAccessToken],
  orderController.updateOrderStatus
);

router.get(
  "/get_admin_order",
  [userAuthMiddleware.checkAuthHeader, userAuthMiddleware.validateAccessToken],
  orderController.getAdminOrderById
);

router.get(
  "/get_monthly_sales",
  [userAuthMiddleware.checkAuthHeader, userAuthMiddleware.validateAccessToken],
  orderController.getMonthlySales
);

router.get(
  "/get_yearly_sales",
  [userAuthMiddleware.checkAuthHeader, userAuthMiddleware.validateAccessToken],
  orderController.getYearlySales
);

module.exports = router;
