const express = require("express");
const router = express.Router();
const addressController = require("../controller/addressController");
const GoogleAuthMiddlware = require('../middleware/googleUserMiddleware')

router.get(
  "/get_address_by_user",
  GoogleAuthMiddlware,
  addressController.getAddressDetailsBasedOnUser
);
router.post(
  "/update_address_by_user",
  GoogleAuthMiddlware,
  addressController.updateAddressOfUser
)

module.exports = router;
