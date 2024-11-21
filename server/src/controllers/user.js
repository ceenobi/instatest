import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../config/generateToken.js";

const cookieOptions = {
  httpOnly: true, // Prevents client-side access to the cookie
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
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
