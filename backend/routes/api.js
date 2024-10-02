const express = require("express");
const app = express();

const userRoutes = require("../routes/user");
const productRoutes = require("../routes/product");
const cartItemRoutes = require("../routes/cartItem");
const orderRoutes = require("../routes/order");
const addressRoutes = require("../routes/address");
const pincodeRoutes = require("../routes/pincode");
const paymentRoutes = require("../routes/payment");
const categoryRoutes = require('../routes/category')

app.use("/", userRoutes);
app.use("/", productRoutes);
app.use("/", cartItemRoutes);
app.use("/", orderRoutes);
app.use("/", addressRoutes);
app.use("/", pincodeRoutes);
app.use("/", paymentRoutes);
app.use("/", categoryRoutes)

module.exports = app;
