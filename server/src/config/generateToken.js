import jwt from "jsonwebtoken";

export const generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY,
  });
};
