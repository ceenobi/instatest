import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
      trim: true,
    },
    fullname: {
      type: String,
      required: [true, "Full name is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minlength: [6, "Password must be at least 6 characters"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: {
      type: String,
      select: false,
    },
    tokenExpires: {
      type: Date,
      select: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpires: {
      type: Date,
      select: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    profilePhotoId: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: [150, "Bio cannot be more than 150 characters"],
      default: "",
    },
    followers: {
      type: [String],
    },
    following: {
      type: [String],
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for user's full URL
userSchema.virtual("profileUrl").get(function () {
  return `/users/${this.username}`;
});

const User = model("User", userSchema);

export default User;
