const express = require("express");
const router = express.Router();
const pincodeController = require("../controller/pincodeController");

router.post("/add_pincode", pincodeController.addPincode);

router.get("/get_all_pincode", pincodeController.getAllPinCode);

router.delete("/delete_pincode", pincodeController.deletePincode);

module.exports = router;
