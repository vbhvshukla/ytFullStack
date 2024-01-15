//Let's assume we have our file on our own servers locally.

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Method which takes url of locally stored file on our server and push it as parameter and push it to cloudinary server.

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", //detects if file is image or video.
    });
    //file has been upoaded successfully
    fs.unlinkSync(localFilePath); //delete the file after the uplpoad has completed
    return response;
    
  } catch (error) {
    fs.unlinkSync(localFilePath); //Remove the locally saved temporary file as the upload operation got failed.
    return null;
  }
};

export { uploadOnCloudinary };
