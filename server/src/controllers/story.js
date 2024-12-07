import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../config/cloudinary.js";
import Story from "../models/story.js";
import User from "../models/user.js";
import Notification from "../models/notification.js";
import createHttpError from "http-errors";

export const createStory = async (req, res, next) => {
  let uploadResults;
  try {
    const { media, caption } = req.body;
    const { id: userId } = req.user;
    if (!media) {
      throw createHttpError(400, "Media is required");
    }
    const user = await User.findById(userId);
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    if (!user.isVerified) {
      return next(
        createHttpError(403, "Please verify your email to create a story")
      );
    }

    const uploadPromises = media.map((image) =>
      uploadToCloudinary(image, {
        folder: "instapics/stories",
        resource_type: "image",
      })
    );

    uploadResults = await Promise.all(uploadPromises);

    const story = await Story.create({
      user: userId,
      media: uploadResults.map((result) => result.url),
      mediaIds: uploadResults.map((result) => result.public_id),
      caption,
    });

    res.status(201).json({
      success: true,
      message: "Story created successfully",
      story,
    });
  } catch (error) {
    if (uploadResults?.length > 0) {
      await Promise.all(
        uploadResults
          .filter((result) => result && result.public_id)
          .map((result) => deleteFromCloudinary(result.public_id))
      );
    }
    next(error);
  }
};

export const getUserStories = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const stories = await Story.find({ user: userId })
      .populate("user", "username profilePicture")
      .sort("-createdAt");

    res.json({
      success: true,
      stories,
    });
  } catch (error) {
    next(error);
  }
};

export const getFollowingStories = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    const stories = await Story.find({
      user: { $in: [...user.following, userId] },
    })
      .populate("user", "username profilePicture")
      .sort("-createdAt");

    res.json({
      success: true,
      stories,
    });
  } catch (error) {
    next(error);
  }
};

export const viewStory = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const userId = req.user.id;

    const story = await Story.findById(storyId).populate(
      "user",
      "username profilePicture"
    );

    if (!story) {
      throw createHttpError(404, "Story not found");
    }

    // Check if the story is public or if the user is the owner
    if (!story.isPublic && story.user._id.toString() !== userId) {
      throw createHttpError(403, "This story is private");
    }

    // Check if user has already viewed this story
    if (story.viewers.includes(userId)) {
      return res.json({
        success: true,
        message: "Story already viewed",
        story,
        hasViewed: true,
      });
    }

    // Add user to viewers and save
    story.viewers.push(userId);
    await story.save();

    // Create notification if the story is not by the same user
    if (story.user.toString() !== userId) {
      await Notification.create({
        recipient: story.user,
        sender: userId,
        type: "story_view",
        story: story._id
      });
    }

    res.json({
      success: true,
      message: "Story viewed",
      story,
      hasViewed: false,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStory = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const userId = req.user.id;

    const story = await Story.findById(storyId);

    if (!story) {
      throw createHttpError(404, "Story not found");
    }

    if (story.user.toString() !== userId) {
      throw createHttpError(403, "Not authorized to delete this story");
    }

    // Delete media from Cloudinary
    if (story.mediaIds && story.mediaIds.length > 0) {
      const deletePromises = story.mediaIds.map((mediaId) =>
        deleteFromCloudinary(mediaId)
      );
      await Promise.all(deletePromises);
    }

    await story.deleteOne();

    res.json({
      success: true,
      message: "Story deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const likeStory = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const userId = req.user.id;

    const story = await Story.findById(storyId);

    if (!story) {
      throw createHttpError(404, "Story not found");
    }

    // Check if user has already liked this story
    if (story.likes.includes(userId)) {
      return res.json({
        success: true,
        message: "Story already liked",
        story,
        hasLiked: true,
      });
    }
    // Add user to likes and save
    story.likes.push(userId);
    await story.save();

    res.json({
      success: true,
      message: "Story liked",
      story,
      hasLiked: false,
    });
  } catch (error) {
    next(error);
  }
};
