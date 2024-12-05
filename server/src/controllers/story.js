import Story from "../models/story.js";
import User from "../models/user.js";
import createHttpError from "http-errors";

export const createStory = async (req, res, next) => {
  try {
    const { media, caption } = req.body;
    const userId = req.user.id;

    if (!media) {
      throw createHttpError(400, "Media is required");
    }

    const story = await Story.create({
      user: userId,
      media,
      caption,
    });

    res.status(201).json({
      success: true,
      message: "Story created successfully",
      story,
    });
  } catch (error) {
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

    const story = await Story.findById(storyId);
    
    if (!story) {
      throw createHttpError(404, "Story not found");
    }

    if (!story.viewers.includes(userId)) {
      story.viewers.push(userId);
      await story.save();
    }

    res.json({
      success: true,
      message: "Story viewed",
      story,
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

    await story.deleteOne();

    res.json({
      success: true,
      message: "Story deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
