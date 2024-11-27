import Post from "../models/post.js";
import createHttpError from "http-errors";
import User from "../models/user.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";

export const createPost = async (req, res, next) => {
  const { title, description, images, tags } = req.body;
  const { id: userId } = req.user;
  try {
    // Validate required fields
    if (!title || !description || !images) {
      throw createHttpError(400, "All fields are required");
    }

    if (!Array.isArray(images) || images.length === 0) {
      throw createHttpError(400, "At least one image is required");
    }

    // Check user exists and is verified
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    if (!user.isVerified) {
      return next(
        createHttpError(403, "Please verify your email to create posts")
      );
    }

    // Upload images to Cloudinary
    const uploadPromises = images.map((image) =>
      uploadToCloudinary(image, {
        folder: "instapics/posts",
        resource_type: "image",
      })
    );

    const uploadResults = await Promise.all(uploadPromises);

    // Create new post
    const newPost = await Post.create({
      title,
      description,
      images: uploadResults.map((result) => result.url),
      imageIds: uploadResults.map((result) => result.public_id),
      tags,
      user: user._id,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    // If there's an error, we should clean up any uploaded images
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

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("user", "username profilePicture")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts,
    });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  const { id: postId } = req.params;
  const { id: userId } = req.user;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return next(createHttpError(404, "Post not found"));
    }
    if (post.likes.map((id) => id.toString()).includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    res.status(200).json({
      success: true,
      message: "Post liked successfully",
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const unlikePost = async (req, res, next) => {
  const { id: postId } = req.params;
  const { id: userId } = req.user;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return next(createHttpError(404, "Post not found"));
    }
    if (post.likes.map((id) => id.toString()).includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    }
    await post.save();
    res.status(200).json({
      success: true,
      message: "Post unliked successfully",
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const seeWhoLiked = async (req, res, next) => {
  const { id: postId } = req.params;
  try {
    const post = await Post.findById(postId).sort({ createdAt: -1 });
    if (!post) {
      return next(createHttpError(404, "Post not found"));
    }
    const getUserPromises = post.likes.map((id) =>
      User.findById(id).select(
        "id username profilePicture fullname followers following"
      )
    );
    const users = await Promise.all(getUserPromises);
    res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      users,
    });
  } catch (error) {
    next(error);
  }
};


