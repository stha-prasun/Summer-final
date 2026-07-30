import bcrypt from "bcryptjs";
import { Admin } from "../admin/admin.model.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "./auth.token.js";
import redis from "../../config/redis.js";

const REFRESH_PREFIX = "refresh:";
const REFRESH_TTL = 7 * 24 * 60 * 60;

export const loginAdmin = async ({ email, password }) => {
  const admin = await Admin.findOne({ email });

  if (!admin) {
    throw new Error("Invalid email or password");
  }

  const isPasswordMatched = await bcrypt.compare(password, admin.password);

  if (!isPasswordMatched) {
    throw new Error("Invalid email or password");
  }

  const adminID = admin._id.toString();

  const accessToken = generateAccessToken(adminID);
  const refreshToken = generateRefreshToken(adminID);

  try {
    await redis.set(
      `${REFRESH_PREFIX}${adminID}`,
      refreshToken,
      "EX",
      REFRESH_TTL
    );
  } catch (error) {
    console.error("Failed to store refresh token in Redis:", error.message);
  }

  admin.lastLogin = new Date();
  await admin.save();

  const loggedInUser = {
    _id: adminID,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    lastLogin: admin.lastLogin,
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

  const adminID = decoded.adminID;
  if (!adminID) {
    throw Object.assign(new Error("Invalid refresh token payload."), { status: 401 });
  }

  const stored = await redis.get(`${REFRESH_PREFIX}${adminID}`);
  if (!stored || stored !== token) {
    throw Object.assign(new Error("Refresh token revoked or reused."), { status: 401 });
  }

  const newAccessToken = generateAccessToken(adminID);
  const newRefreshToken = generateRefreshToken(adminID);

  try {
    await redis.set(
      `${REFRESH_PREFIX}${adminID}`,
      newRefreshToken,
      "EX",
      REFRESH_TTL
    );
  } catch (error) {
    console.error("Failed to update refresh token in Redis:", error.message);
  }

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};
