import createHttpError from "http-errors";
import User from "../models/user.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../config/cloudinary.js";

export const getAUser = async (req, res, next) => {
  const { username } = req.params;
  try {
    if (!username) {
      throw createHttpError(400, "Username is required");
    }
    const user = await User.findOne({ username });
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const changeProfilePhoto = async (req, res, next) => {
  const { id: userId } = req.user;
  const { photo } = req.body;

  try {
    if (!photo) {
      throw createHttpError(400, "No photo provided");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    // Delete old profile photo if it exists
    if (user.profilePhotoId) {
      await deleteFromCloudinary(user.profilePhotoId);
    }

    // Upload new profile photo
    const uploadResult = await uploadToCloudinary(photo, {
      folder: "instapics/profiles",
      transformation: [
        { width: 500, height: 500, crop: "fill" },
        { quality: "auto" },
        { fetch_format: "auto" }
      ]
    });

    // Update user profile
    user.profilePicture = uploadResult.url;
    user.profilePhotoId = uploadResult.public_id;
    await user.save();

    res.status(200).json({
      message: "Profile photo updated successfully",
      profilePicture: user.profilePicture
    });
  } catch (error) {
    next(error);
  }
};
