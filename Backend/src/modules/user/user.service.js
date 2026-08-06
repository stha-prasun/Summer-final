import { User } from "./user.model.js";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "./user.token.js";
import { createUser, applyUserUpdates } from "./factory/user.factory.js";
import { verifyGoogleIdToken } from "./googleAuth.service.js";
import redis from "../../config/redis.js";

const USER_REFRESH_PREFIX = "user-refresh:";
const USER_REFRESH_TTL = 7 * 24 * 60 * 60;

const issueSession = async (user) => {
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
    avatar: user.avatar,
    authProvider: user.authProvider,
  };

  return { accessToken, refreshToken, loggedInUser };
};

const hasCompleteProfile = (user) =>
  Boolean(user.phone) &&
  Boolean(user.address?.street) &&
  Boolean(user.address?.city) &&
  Boolean(user.address?.state) &&
  Boolean(user.address?.zip) &&
  Boolean(user.address?.country);

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

  const isPasswordMatched =
    user.authProvider === "local"
      ? await bcrypt.compare(password, user.password)
      : false;

  if (!isPasswordMatched) {
    throw new Error("Invalid email or password");
  }

  return issueSession(user);
};

export const googleLogin = async ({ credential }) => {
  const profile = await verifyGoogleIdToken(credential);

  let user = await User.findOne({ email: profile.email });

  if (!user) {
    user = new User({
      name: profile.name,
      email: profile.email,
      authProvider: "google",
      googleId: profile.googleId,
      avatar: profile.avatar,
      emailVerified: profile.emailVerified,
    });
    await user.save();
  }

  if (profile.avatar && user.avatar !== profile.avatar) {
    user.avatar = profile.avatar;
  }
  user.googleId = user.googleId || profile.googleId;
  user.emailVerified = user.emailVerified || profile.emailVerified;

  const session = await issueSession(user);

  return {
    ...session,
    needsOnboarding: !hasCompleteProfile(user),
  };
};

export const updateProfile = async ({ userId, phone, address }) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  applyUserUpdates(user, {
    phone,
    address: address || {},
  });

  await user.save();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    avatar: user.avatar,
    authProvider: user.authProvider,
  };
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
