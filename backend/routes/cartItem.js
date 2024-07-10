const cartItemController = require("../controller/cartItemController");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
const GoogleUserMiddleware = require('../middleware/googleUserMiddleware')
const express = require("express");
const router = express();

router.post(
  "/add_cart_item",
  GoogleUserMiddleware,
  cartItemController.addToCart
);
router.get(
  "/get_cart_item",
  GoogleUserMiddleware,
  cartItemController.getCartOfUser
);
router.post(
  "/delete_cart_item",
  GoogleUserMiddleware,
  cartItemController.deleteCart
);
router.post(
  "/update_cart_item",
  GoogleUserMiddleware,
  cartItemController.updateCart
);


module.exports = router;
