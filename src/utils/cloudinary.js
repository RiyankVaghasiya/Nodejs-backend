import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/user.model";
import fs from "fs";
import { ApiError } from "./ApiError";
import { response } from "express";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file path on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file has been uploaded successfully
    // console.log("file is uploaded on cloudinary", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

const deleteOldAvatarImage = async (userId) => {
  try {
    const user = await User.findById(userId);
    const oldImageTobeDeleted = await user.avatar;
    if (oldImageTobeDeleted) {
      const res = await cloudinary.uploader.destroy(oldImageTobeDeleted);
    }
  } catch (error) {
    throw new ApiError(501, "Error while removing avatarImage from cloudinary");
  }
};

export { uploadOnCloudinary, deleteOldAvatarImage };
