import { User } from "./user.model.js";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "./user.token.js";
import { createUser } from "./factory/user.factory.js";
import redis from "../../config/redis.js";

const USER_REFRESH_PREFIX = "user-refresh:";
const USER_REFRESH_TTL = 7 * 24 * 60 * 60;

export const signup = async ({ name, email, password, phone, address }) => {
  const existing = await User.findOne({ email });

  if (existing) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = createUser({ name, email, password: hashedPassword, phone, address });
  await user.save();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
  };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Invalid email or password");
  }

  user.lastLogin = new Date();
  await user.save();

  const userID = user._id.toString();
  const accessToken = generateAccessToken(userID);
  const refreshToken = generateRefreshToken(userID);

  try {
    await redis.set(
      `${USER_REFRESH_PREFIX}${userID}`,
      refreshToken,
      "EX",
      USER_REFRESH_TTL
    );
  } catch (error) {
    console.error("Failed to store refresh token in Redis:", error.message);
  }

  const loggedInUser = {
    _id: userID,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
  };

  return { accessToken, refreshToken, loggedInUser };
};

export const refreshSession = async (cookies) => {
  const token = cookies?.refreshToken;
  if (!token) {
    throw Object.assign(new Error("Refresh token missing."), { status: 401 });
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw Object.assign(new Error("Invalid or expired refresh token."), { status: 401 });
  }

  const userID = decoded.userID;
  if (!userID) {
    throw Object.assign(new Error("Invalid refresh token payload."), { status: 401 });
  }

  const stored = await redis.get(`${USER_REFRESH_PREFIX}${userID}`);
  if (!stored || stored !== token) {
    throw Object.assign(new Error("Refresh token revoked or reused."), { status: 401 });
  }

  const newAccessToken = generateAccessToken(userID);
  const newRefreshToken = generateRefreshToken(userID);

  try {
    await redis.set(
      `${USER_REFRESH_PREFIX}${userID}`,
      newRefreshToken,
      "EX",
      USER_REFRESH_TTL
    );
  } catch (error) {
    console.error("Failed to update refresh token in Redis:", error.message);
  }

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};
