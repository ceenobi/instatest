import Comment from "../models/comment.js";
import Post from "../models/post.js";
import createError from "http-errors";
import User from "../models/user.js";

// Create a new comment or reply
export const createComment = async (req, res, next) => {
  try {
    const { comment, parentComment } = req.body;
    const { id: userId } = req.user;
    const { getPostId } = req.params;

    const user = await User.findById(userId);
    if (!user.isVerified) {
      return next(
        createHttpError(403, "Please verify your email to post comments")
      );
    }

    // Check if post exists
    const post = await Post.findById(getPostId);
    if (!post) {
      throw createError(404, "Post not found");
    }
    const newComment = await Comment.create({
      user: userId,
      postId: post._id,
      comment,
      parentComment: parentComment || null,
    });

    // Populate user details
    await newComment.populate("user", "username profilePicture");

    res.status(201).json({
      success: true,
      message: "Comment posted successfully",
      data: newComment,
    });
  } catch (error) {
    next(error);
  }
};

// Get comments for a post
export const getPostComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get only top-level comments (no parentComment)
    const post = await Post.findById(postId)
      .select("title description images likes savedBy tags createdAt")
      .populate("user", "username profilePicture");
    if (!post) {
      throw createError(404, "Post not found");
    }
    const comments = await Comment.find({ postId, parentComment: null })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profilePicture")
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "username profilePicture",
        },
        options: { sort: { createdAt: 1 } },
      });

    const total = await Comment.countDocuments({ postId, parentComment: null });

    res.status(200).json({
      success: true,
      comments,
      post,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get replies for a comment
export const getCommentReplies = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const replies = await Comment.find({ parentComment: commentId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username avatar");

    const total = await Comment.countDocuments({ parentComment: commentId });

    res.status(200).json({
      status: "success",
      data: replies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete a comment
export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { id: userId } = req.user;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw createError(404, "Comment not found");
    }

    // Check if user owns the comment
    if (comment.user.toString() !== userId.toString()) {
      throw createError(403, "You can only delete your own comments");
    }

    // Delete the comment and all its replies
    await Comment.deleteMany({
      $or: [{ _id: commentId }, { parentComment: commentId }],
    });

    res.status(200).json({
      status: "success",
      message: "Comment deleted",
    });
  } catch (error) {
    next(error);
  }
};

// Like/Unlike a comment
export const toggleCommentLike = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { id: userId } = req.user;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw createError(404, "Comment not found");
    }

    const userLiked = comment.likes.includes(userId.toString());
    const updateOperation = userLiked
      ? { $pull: { likes: userId }, $inc: { likeCount: -1 } }
      : { $addToSet: { likes: userId }, $inc: { likeCount: 1 } };

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      updateOperation,
      { new: true }
    ).populate("user", "username avatar");

    res.status(200).json({
      success: true,
      message: userLiked ? "Comment unliked" : "Comment liked",
      data: updatedComment,
    });
  } catch (error) {
    next(error);
  }
};
