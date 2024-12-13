import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../config/generateToken.js";
import mailService from "../config/mailService.js";
import { clearCache } from "../config/cache.js";

const cookieOptions = {
  httpOnly: true, // Prevents client-side access to the cookie
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 60 * 60 * 1000, // 1 hour
  path: "/", // Cookie is accessible on all paths
};

export const signUp = async (req, res, next) => {
  const { username, email, password, fullname } = req.body;
  try {
    if (!username || !email || !password || !fullname) {
      throw createHttpError(400, "All fields are required");
    }
    const [existingUsername, existingEmail] = await Promise.all([
      User.findOne({ username: username.toLowerCase() }),
      User.findOne({ email: email.toLowerCase() }),
    ]);

    if (existingUsername) {
      throw createHttpError(409, "Username already exists!");
    }
    if (existingEmail) {
      throw createHttpError(409, "Email already exists!");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      fullname,
    });
    const verifyToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = verifyToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    const verifyEmailLink = `${process.env.CLIENT_URL}/account/verify-email/${user._id}/${user.verificationToken}`;
    await mailService({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Email verification",
      text: `Welcome to Instapics! Click the link below to verify your email: ${verifyEmailLink}. Link expires in 24 hours.`,
      username: user.fullname,
      link: verifyEmailLink,
      btnText: "Verify",
    });
    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);
    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
        isVerified: user.isVerified,
        profilePicture: user.profilePicture,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      throw createHttpError(400, "Username and password are required");
    }
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return next(createHttpError(404, "Account not found"));
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(createHttpError(401, "Invalid credentials"));
    }
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);
    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
        isVerified: user.isVerified,
        profilePicture: user.profilePicture,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const signInViaEmail = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) {
      throw createHttpError(400, "Email is required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "Email not found"));
    }
    const emailToken = crypto.randomBytes(20).toString("hex");
    user.token = emailToken;
    user.tokenExpires = Date.now() + 15 * 60 * 1000;
    await user.save();
    const emailLoginLink = `${process.env.CLIENT_URL}/account/email-login/${user._id}/${emailToken}`;
    await mailService({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Email Login",
      text: `Click the link below to login: ${emailLoginLink}. Link expires in 15 minutes.`,
      username: user.fullname,
      link: emailLoginLink,
      btnText: "Login",
    });
    res.status(200).json({
      success: true,
      message: "Email Login link sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyLoginLink = async (req, res, next) => {
  const { userId, emailToken } = req.params;
  try {
    if (!emailToken || !userId) {
      throw createHttpError(400, "Email token or user Id not provided");
    }
    const user = await User.findOne({
      _id: userId,
      token: emailToken,
    }).select("+token +tokenExpires");

    if (!user) {
      return next(createHttpError(404, "Invalid or expired login link"));
    }

    // Check if token has expired
    if (user.tokenExpires < Date.now()) {
      // Invalidate the token
      user.token = undefined;
      user.tokenExpires = undefined;
      await user.save();
      return next(
        createHttpError(
          401,
          "Login link has expired. Please request a new one."
        )
      );
    }

    // Clear the token after successful verification
    user.token = undefined;
    user.tokenExpires = undefined;
    user.lastLogin = Date.now();
    await user.save();

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
        isVerified: user.isVerified,
        profilePicture: user.profilePicture,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const authenticateUser = async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    clearCache(`get_auser_${req.user.id}`);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const sendVerifyEmail = async (req, res, next) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      throw createHttpError(400, "UserId not provided");
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    const verifyToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = verifyToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    const verifyEmailLink = `${process.env.CLIENT_URL}/account/verify-email/${userId}/${user.verificationToken}`;
    await mailService({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Email verification",
      text: `Click the link below to verify your email: ${verifyEmailLink}. Link expires in 24 hours.`,
      username: user.fullname,
      link: verifyEmailLink,
      btnText: "Verify",
    });
    res.status(200).json({
      success: true,
      message: "Email verification link sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  const { userId, verificationToken } = req.params;
  try {
    if (!userId || !verificationToken) {
      throw createHttpError(400, "UserId or verificationToken not provided");
    }
    const user = await User.findOne({
      _id: userId,
      verificationToken: verificationToken,
    }).select("+verificationToken +verificationTokenExpires");
    if (!user) {
      return next(
        createHttpError(404, "User id  or verification token not found")
      );
    }
    if (user.verificationTokenExpires < Date.now()) {
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;
      await user.save();
      return next(createHttpError(401, "Verification link has expired"));
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return next(createHttpError(401, "No refresh token found"));
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_KEY,
      async (err, decoded) => {
        if (err) {
          res.clearCookie("refreshToken", cookieOptions);
          return next(createHttpError(401, "Invalid or expired refresh token"));
        }

        try {
          const user = await User.findById(decoded.id);
          if (!user) {
            return next(createHttpError(401, "User no longer exists"));
          }

          const accessToken = generateAccessToken(user._id, user.role);
          const newRefreshToken = generateRefreshToken(user._id, user.role);

          res.cookie("refreshToken", newRefreshToken, cookieOptions);

          res.status(200).json({
            accessToken,
            message: "Tokens refreshed successfully",
          });
        } catch (error) {
          return next(error);
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
