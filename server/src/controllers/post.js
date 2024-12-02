import Post from "../models/post.js";
import createHttpError from "http-errors";
import User from "../models/user.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";
import Comment from "../models/comment.js";

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
    }
    await post.save();
    res.status(200).json({
      success: true,
      message: post.likes.map((id) => id.toString()).includes(userId)
        ? "Post liked successfully"
        : "Post unliked successfully",
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
    res.status(200).json({
      success: true,
      message: post.savedBy.map((id) => id.toString()).includes(userId)
        ? "Post saved successfully"
        : "Post unsaved successfully",
      post,
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
    await deleteFromCloudinary(post.imageIds);
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
  // if (userId !== currentUserId) {
  //   return next(
  //     createHttpError(403, "You are not authorized for this request")
  //   );
  // }
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

// export const unsavePost = async (req, res, next) => {
//   const { id: postId } = req.params;
//   const { id: userId } = req.user;
//   try {
//     const post = await Post.findById(postId);
//     if (!post) {
//       return next(createHttpError(404, "Post not found"));
//     }
//     if (post.savedBy.map((id) => id.toString()).includes(userId)) {
//       post.savedBy = post.savedBy.filter((id) => id.toString() !== userId);
//     }
//     await post.save();
//     res.status(200).json({
//       success: true,
//       message: "Post unsaved successfully",
//       post,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const unlikePost = async (req, res, next) => {
//   const { id: postId } = req.params;
//   const { id: userId } = req.user;
//   try {
//     const post = await Post.findById(postId);
//     if (!post) {
//       return next(createHttpError(404, "Post not found"));
//     }
//     if (post.likes.map((id) => id.toString()).includes(userId)) {
//       post.likes = post.likes.filter((id) => id.toString() !== userId);
//     }
//     await post.save();
//     res.status(200).json({
//       success: true,
//       message: "Post unliked successfully",
//       post,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
