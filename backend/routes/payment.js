const express = require("express");
const router = express.Router();
const paymentController = require("../controller/paymentController");
const GoogleUserMiddleware = require("../middleware/googleUserMiddleware");

router.post("/order", GoogleUserMiddleware, paymentController.order);
router.post("/verification", paymentController.verification)

module.exports = router;
