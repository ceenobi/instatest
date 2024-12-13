import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import Post from "../models/post.js";
import Comment from "../models/comment.js";
import Notification from "../models/notification.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../config/cloudinary.js";
import { clearCache } from "../config/cache.js";

export const getAUser = async (req, res, next) => {
  const { username } = req.params;
  try {
    if (!username) {
      throw createHttpError(400, "Username is required");
    }
    const user = await User.findOne({ username }).lean();
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    const userPostsCount = await Post.countDocuments({
      user: user._id.toString(),
    });
    clearCache(`user_profile_${req.params.username}`);
    res.status(200).json({ user, userPostsCount });
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
        { fetch_format: "auto" },
      ],
    });

    // Update user profile
    user.profilePicture = uploadResult.url;
    user.profilePhotoId = uploadResult.public_id;
    await user.save();

    res.status(200).json({
      message: "Profile photo updated successfully",
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  const { id: userId } = req.user;
  const { fullname, bio, username, email } = req.body;
  try {
    if (!fullname || !bio || !username || !email) {
      throw createHttpError(400, "All fields are required");
    }
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    user.fullname = fullname;
    user.bio = bio;
    user.username = username;
    user.email = email;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  const { id: userId } = req.user;
  const { password, newPassword } = req.body;
  try {
    if (!newPassword || !password) {
      throw createHttpError(400, "Password or New Password is required");
    }
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(createHttpError(401, "Invalid current password"));
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password updated successfully, Login with new password",
    });
  } catch (error) {
    next(error);
  }
};

export const togglePrivateAccount = async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    user.isPublic = !user.isPublic;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Account privacy updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    // Delete profile photo if it exists
    if (user.profilePhotoId) {
      await deleteFromCloudinary(user.profilePhotoId);
    }
    await User.findByIdAndDelete(userId);
    await Post.deleteMany({ user: userId });
    await Comment.deleteMany({ user: userId });
    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const followUser = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: followerId } = req.params;
  try {
    const user = await User.findById(userId);
    if (user.following.map((id) => id.toString()).includes(followerId)) {
      user.following = user.following.filter(
        (id) => id.toString() !== followerId
      );
    } else {
      user.following.push(followerId);
    }
    const followedUser = await User.findById(followerId);
    if (followedUser.followers.map((id) => id.toString()).includes(userId)) {
      followedUser.followers = followedUser.followers.filter(
        (id) => id.toString() !== userId
      );
    } else {
      followedUser.followers.push(userId);
    }
    await followedUser.save();
    await user.save();
    if (user.following.map((id) => id.toString()).includes(followerId)) {
      try {
        await Notification.create({
          recipient: followerId,
          sender: userId,
          type: "follow",
        });
      } catch (notificationError) {
        console.error("Failed to create notification:", notificationError);
        // Continue execution even if notification fails
      }
    }
    res.status(200).json({
      success: true,
      message: user.following.map((id) => id.toString()).includes(followerId)
        ? "User followed successfully"
        : "User unfollowed successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const suggestUsers = async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    // Find the current user with their following list
    const currentUser = await User.findById(userId).select("following");
    if (!currentUser) {
      return next(createHttpError(404, "User not found"));
    }

    // Get users that the current user's followings are following
    const mutualSuggestions = await User.aggregate([
      // First get all users the current user is following
      {
        $match: {
          _id: { $in: currentUser.following },
        },
      },
      // Look up their following lists
      {
        $lookup: {
          from: "users",
          localField: "following",
          foreignField: "_id",
          as: "mutualConnections",
        },
      },
      // Unwind the mutual connections array
      { $unwind: "$mutualConnections" },
      // Group to count how many mutual connections each suggested user has
      {
        $group: {
          _id: "$mutualConnections._id",
          user: { $first: "$mutualConnections" },
          mutualCount: { $sum: 1 },
        },
      },
      // Match only users that the current user is not following
      {
        $match: {
          _id: {
            $ne: userId,
            $nin: currentUser.following,
          },
          "user.isPublic": true,
        },
      },
      // Sort by number of mutual connections
      { $sort: { mutualCount: -1 } },
      // Limit to 5 suggestions
      { $limit: 5 },
      // Project only needed fields
      {
        $project: {
          _id: "$user._id",
          username: "$user.username",
          profilePicture: "$user.profilePicture",
          fullname: "$user.fullname",
          mutualCount: 1,
        },
      },
    ]);

    // If we don't have enough mutual suggestions, add some public users
    if (mutualSuggestions.length < 5) {
      const additionalUsers = await User.find({
        $and: [
          { _id: { $ne: userId } },
          { _id: { $nin: currentUser.following } },
          { _id: { $nin: mutualSuggestions.map((s) => s._id) } },
          { isPublic: true },
        ],
      })
        .select("username profilePicture fullname")
        .limit(5 - mutualSuggestions.length);

      // Combine both sets of suggestions
      const allSuggestions = [
        ...mutualSuggestions,
        ...additionalUsers.map((user) => ({
          _id: user._id,
          username: user.username,
          profilePicture: user.profilePicture,
          fullname: user.fullname,
          mutualCount: 0,
        })),
      ];
      clearCache(`suggest_user_${req.user.id}`);
      res.status(200).json({
        success: true,
        users: allSuggestions,
      });
    } else {
      res.status(200).json({
        success: true,
        users: mutualSuggestions,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getUserFollowers = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    const followers = await User.find({ _id: { $in: user.followers } });
    clearCache(`get_followers_${req.user.username}`);
    res.status(200).json({
      success: true,
      followers,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserFollowing = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    const following = await User.find({ _id: { $in: user.following } });
    clearCache(`get_following_${req.params.username}`);
    res.status(200).json({
      success: true,
      following,
    });
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (req, res, next) => {
  const query = req.query.q;
  try {
    const users = await User.find({
      $or: [
        { username: { $regex: query.trim(), $options: "i" } },
        { fullname: { $regex: query.trim(), $options: "i" } },
      ],
    });
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};
