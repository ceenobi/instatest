import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import Post from "../models/post.js";
import Comment from "../models/comment.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../config/cloudinary.js";

export const getAUser = async (req, res, next) => {
  const { username } = req.params;
  try {
    if (!username) {
      throw createHttpError(400, "Username is required");
    }
    const user = await User.findOne({ username });
    const userPostsCount = await Post.countDocuments({ user: user._id });
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
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
    // const user = await User.findById(userId);
    // const followedUser = await User.findById(followerId);
    // if (!user || !followedUser) {
    //   return next(createHttpError(404, "User not found"));
    // }
    // user.following.push(followerId);
    // followedUser.followers.push(userId);
    await followedUser.save();
    await user.save();
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
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    const users = await User.find({
      $and: [
        { _id: { $ne: userId } },
        { isPublic: true },
        {
          $or: [{ followers: { $ne: userId } }, { following: { $ne: userId } }],
        },
      ],
    }).select("username profilePicture");
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) { 
    next(error);
  }
};

// export const unfollowUser = async (req, res, next) => {
//   const { id: userId } = req.user;
//   const { id: followerId } = req.params;
//   try {
//     const user = await User.findById(userId);
//     const followedUser = await User.findById(followerId);
//     if (!user || !followedUser) {
//       return next(createHttpError(404, "User not found"));
//     }
//     user.following = user.following.filter(
//       (id) => id.toString() !== followerId
//     );
//     user.followers = user.followers.filter((id) => id.toString() !== userId);
//     followedUser.followers = followedUser.followers.filter(
//       (id) => id.toString() !== userId
//     );
//     followedUser.following = followedUser.following.filter(
//       (id) => id.toString() !== followerId
//     );
//     await user.save();
//     await followedUser.save();
//     res.status(200).json({
//       success: true,
//       message: "User unfollowed successfully",
//       user,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
