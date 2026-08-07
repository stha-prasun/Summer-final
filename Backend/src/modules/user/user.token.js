import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRY = "1d";
const REFRESH_TOKEN_EXPIRY = "7d";

export const generateAccessToken = (userID) => {
  return jwt.sign({ userID }, process.env.JWT_SECRET_KEY, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (userID) => {
  return jwt.sign({ userID }, process.env.JWT_SECRET_KEY, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};
