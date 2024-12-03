import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import { log } from "console";
import { join } from "path";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: "154256173138431",
  api_secret: "nBQkstTN7OU69oL64PylP_UR0BQ",
});

const uploadOnCloudinary = async (localFilePath) => {
  try {    
    const response = await cloudinary.uploader.upload(localFilePath, {
      public_id: "Youtube",
    });
    fs.unlinkSync(localFilePath);
    return response.secure_url;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
