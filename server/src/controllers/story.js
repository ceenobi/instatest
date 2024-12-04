import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../config/cloudinary.js";
import Story from "../models/story.js";
import User from "../models/user.js";
import createHttpError from "http-errors";

export const createStory = async (req, res, next) => {
  try {
    const { images } = req.body;
    const { id: userId } = req.user;
    if (!images || !Array.isArray(images) || images.length === 0) {
      throw createHttpError(400, "At least one image is required");
    }
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    if (!user.isVerified) {
      return next(
        createHttpError(403, "Please verify your email to create stories")
      );
    }
    // Upload images to Cloudinary
    const uploadPromises = images.map((image) =>
      uploadToCloudinary(image, {
        folder: "instapics/stories",
        resource_type: "image",
      })
    );

    const uploadResults = await Promise.all(uploadPromises);
    const newStory = await Story.create({
      images: uploadResults.map((result) => result.url),
      imageIds: uploadResults.map((result) => result.public_id),
      user: userId,
    });
    res.status(201).json({
      success: true,
      message: "Story created successfully",
      story: newStory,
    });
  } catch (error) {
    if (error && uploadResults) {
      await Promise.all(
        uploadResults
          .filter((result) => result && result.public_id)
          .map((result) => deleteFromCloudinary(result.public_id))
      );
    }
    next(error);
  }
};
