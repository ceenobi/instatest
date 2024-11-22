import createHttpError from "http-errors";
import User from "../models/user.js";

export const getAUser = async (req, res, next) => {
  const { username } = req.params;
  try {
    if (!username) {
      throw createHttpError(400, "Username is required");
    }
    const user = await User.findOne({ username });
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
