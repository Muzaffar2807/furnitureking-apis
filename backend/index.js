const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const basicAuth = require("express-basic-auth");
var path = require("path");
var cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
var logger = require("morgan");
const indexRouter = require("./routes/index");
const apiRoutes = require("./routes/api");
const main = require("./seeder/adminSeeder");
const apiResponse = require("./helpers/apiResponse")

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


app.use(
  cors({
    origin: "https://hindwala.netlify.app",
    credentials: true,
  })
); 
/* app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
); */
app.use("/", indexRouter);
app.use("/api/", apiRoutes);

var MONGODB_URL = process.env.MONGODB_URL;
var mongoose = require("mongoose");
let dbOptions = { };

mongoose.set("debug", true);
mongoose
  .connect(MONGODB_URL, dbOptions)
  .then(() => {
      console.log("Connected to DATABASE");
      console.log("App is running ... \n");
      console.log("Press CTRL + C to stop the process. \n");
  })
  .catch((err) => {
    console.error("App starting error:", err.message);w
    process.exit(1);
  });

var db = mongoose.connection;

if (process.env.NODE_ENV !== "test") {
  app.use(logger("dev"));
}
// throw 404 if URL not found
app.all("*", function (req, res) {
  return apiResponse.notFoundResponse(res, "Page not found");
});
app.use((err, req, res) => {
  if (err.name == "UnauthorizedError") {
    return apiResponse.unauthorizedResponse(res, err.message);
  }
});

module.exports = app;
