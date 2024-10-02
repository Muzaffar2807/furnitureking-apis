const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const fs = require("fs");
const net = require("net");

// Critical line of code.
net.setDefaultAutoSelectFamily(false);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadToCloudinary = async (localFilePath) => {
  try {
    console.log(localFilePath);
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath.path, {
      resource_type: "auto",
    });
    console.log("file is uploaded on cloudinary");
    fs.unlinkSync(localFilePath.path);
    return response;
  } catch (error) {
    if (fs.existsSync(localFilePath.path)) {
      fs.unlinkSync(localFilePath.path);
    }
    console.log("Cloudinary error: ", error);
    // to remove the local file saved in server
    // go ahead
    throw new Error("Error uploading file to Cloudinary");
  }
};

module.exports = uploadToCloudinary;
