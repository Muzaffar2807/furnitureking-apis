const Razorpay = require("razorpay");
require("dotenv").config();
const orderDataServiceProvider = require("../services/orderDataServiceProvider");
const addressDataServiceProvider = require("../services/addressDataServiceProvider");
const cartItemDataServiceProvider = require('../services/cartItemDataServiceProvider')
const apiResponse = require("../helpers/apiResponse");
const shortid = require("shortid");
const crypto = require('crypto')

const instance = new Razorpay({
  key_id: process.env.RAZOR_PAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const order = async (req, res) => {
  try {
    const user = req.user._id;
    const userOrder = await cartItemDataServiceProvider.getCartOfUser(user);
    const userAddress = await addressDataServiceProvider.getAddressOfUser(user);

    let cartAmount = 0;
    userOrder.forEach((O) => {
      cartAmount += O.total_price;
    });

    var options = {
      amount: cartAmount * 100,
      currency: "INR",
      accept_partial: false,
      //first_min_partial_amount: 100,
      description: "Payment for order",
      customer: {
        name: req.user.name,
        email: req.user.email,
        contact: userAddress.mobile_number ? userAddress.mobile_number : "",
      },
      notify: {
        sms: false,
        email: false,
      },
      reminder_enable: true,
      notes: {
        order_id: shortid.generate(),
      },
      callback_url:
        process.env.CALLBACK_URL,
      callback_method: "get",
    };
    const paymentLink = await instance.paymentLink.create(options);
    paymentLink.amount = paymentLink.amount / 100
    if (paymentLink) {
      return apiResponse.successResponseWithData(
        res,
        "payment link generated",
        paymentLink
      );
    }
    return apiResponse.badRequestResponse(
      res,
      "failed to generate payment link"
    );
  } catch (error) {
    console.log(error);
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const verification = async (req, res) => {
  try {
    const secret = process.env.WEBHOOK_SECRET;

    const shasum = crypto.createHmac('sha256', secret)
    shasum.update(JSON.stringify(req.body))
    const digest = shasum.digest('hex')

    console.log(digest , req.headers['x-razorpay-signature'])
    if (digest === req.headers['x-razorpay-signature']) {
      console.log('request is legit')
      // process it
      require('fs').writeFileSync('payment2.json', JSON.stringify(req.body, null, 4))
    } else {
      // pass it
    }

    return res.status(200).json({ message: "ok" });
  } catch (error) {
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

module.exports = {
  order,
  verification,
};
