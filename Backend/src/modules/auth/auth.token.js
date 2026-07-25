import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRY = "1d";
const REFRESH_TOKEN_EXPIRY = "7d";

export const generateAccessToken = (adminID) => {
  return jwt.sign({ adminID }, process.env.JWT_SECRET_KEY, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (adminID) => {
  return jwt.sign({ adminID }, process.env.JWT_SECRET_KEY, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};
