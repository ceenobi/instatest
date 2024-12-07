import Post from "../models/post.js";
import createHttpError from "http-errors";
import User from "../models/user.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";
import Comment from "../models/comment.js";
import Notification from "../models/notification.js";

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

    // Populate user details and include all necessary post fields
    const populatedPost = await Post.findById(newPost._id)
      .populate({
        path: "user",
        select: "username profilePicture",
      })
      .select(
        "title description images tags likes savedBy createdAt updatedAt"
      );

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatedPost,
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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  try {
    const posts = await Post.find()
      .populate("user", "username profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalCount = await Post.countDocuments();
    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalPosts: totalCount,
        hasMore: skip + posts.length < totalCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const handleLikePost = async (req, res, next) => {
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
      // Create notification if the post is not by the same user
      if (post.user.toString() !== userId) {
        await Notification.create({
          recipient: post.user,
          sender: userId,
          type: "like",
          post: post._id,
        });
      }
    }
    await post.save();

    // Populate user field before sending response
    const populatedPost = await Post.findById(post._id).populate(
      "user",
      "username profilePicture"
    );

    res.status(200).json({
      success: true,
      message: populatedPost.likes.map((id) => id.toString()).includes(userId)
        ? "Post liked successfully"
        : "Post unliked successfully",
      post: populatedPost,
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

export const handleSavePost = async (req, res, next) => {
  const { id: postId } = req.params;
  const { id: userId } = req.user;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return next(createHttpError(404, "Post not found"));
    }
    if (post.savedBy.map((id) => id.toString()).includes(userId)) {
      post.savedBy = post.savedBy.filter((id) => id.toString() !== userId);
    } else {
      post.savedBy.push(userId);
    }
    await post.save();

    // Populate user field before sending response
    const populatedPost = await Post.findById(post._id).populate(
      "user",
      "username profilePicture"
    );

    res.status(200).json({
      success: true,
      message: populatedPost.savedBy.map((id) => id.toString()).includes(userId)
        ? "Post saved successfully"
        : "Post unsaved successfully",
      post: populatedPost,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserPosts = async (req, res, next) => {
  const { id: userId } = req.params;
  try {
    const posts = await Post.find({ user: userId })
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

export const deletePost = async (req, res, next) => {
  const { id: postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return next(createHttpError(404, "Post not found"));
    }

    // Delete images from Cloudinary
    if (post.imageIds && post.imageIds.length > 0) {
      const deletePromises = post.imageIds.map((imageId) =>
        deleteFromCloudinary(imageId)
      );
      await Promise.all(deletePromises);
    }

    // Delete post and associated comments
    await Post.findByIdAndDelete(postId);
    await Comment.deleteMany({ post: postId });

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSavedPosts = async (req, res, next) => {
  const { id: userId } = req.params;
  const { id: currentUserId } = req.user;
  try {
    const posts = await Post.find({ savedBy: userId })
      .populate("user", "username profilePicture")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts,
      currentUserId,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  const { id: postId } = req.params;
  const { id: userId } = req.user;
  const { title, description, tags } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return next(createHttpError(404, "Post not found"));
    }

    // Check if user owns the post
    if (post.user.toString() !== userId) {
      return next(createHttpError(403, "You can only edit your own posts"));
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, description, tags },
      { new: true }
    ).populate("user", "username profilePicture");

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

export const getRandomPosts = async (req, res, next) => {
  const { id: userId } = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    // First get all tags used by the logged in user
    const userPosts = await Post.find({ user: userId });
    const userTags = [...new Set(userPosts.flatMap((post) => post.tags))];

    // Base query to exclude user's own posts
    const excludeUserQuery = {
      user: {
        $ne: userId, // Exclude posts where user is the current user
        $exists: true, // Ensure user field exists
      },
    };

    // If user has no tags, return latest posts with pagination
    if (userTags.length === 0) {
      const [posts, totalCount] = await Promise.all([
        Post.find(excludeUserQuery)
          .populate("user", "username profilePicture")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Post.countDocuments(excludeUserQuery),
      ]);

      return res.status(200).json({
        success: true,
        message: "Posts fetched successfully",
        posts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalPosts: totalCount,
          hasMore: skip + posts.length < totalCount,
        },
      });
    }

    // Get total count of eligible posts
    const matchQuery = {
      ...excludeUserQuery,
      tags: { $in: userTags },
    };

    const totalCount = await Post.countDocuments(matchQuery);

    // Get a larger sample to ensure we have enough unique posts after filtering
    const sampleSize = Math.min(totalCount, limit * 2);

    // First get all posts with matching tags
    let posts = await Post.aggregate([
      {
        $match: matchQuery,
      },
      // Ensure uniqueness by _id
      {
        $group: {
          _id: "$_id",
          doc: { $first: "$$ROOT" },
        },
      },
      // Restore document structure
      {
        $replaceRoot: { newRoot: "$doc" },
      },
      // Add random sort
      {
        $sample: { size: sampleSize },
      },
      // Skip and limit after sampling
      { $skip: skip },
      { $limit: limit },
    ]);

    // Populate user data
    await Post.populate(posts, {
      path: "user",
      select: "username profilePicture",
    });

    // Final safety check to ensure no user posts slip through
    posts = posts.filter((post) => post.user._id.toString() !== userId);

    // Ensure we have unique posts
    posts = Array.from(
      new Map(posts.map((post) => [post._id.toString(), post])).values()
    );

    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalPosts: totalCount,
        hasMore: skip + posts.length < totalCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPostsByTags = async (req, res, next) => {
  const { tags } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  try {
    const posts = await Post.find({ tags: { $in: tags.split(",") } })
      .populate("user", "username profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalCount = await Post.countDocuments({
      tags: { $in: tags.split(",") },
    });
    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalPosts: totalCount,
        hasMore: skip + posts.length < totalCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
