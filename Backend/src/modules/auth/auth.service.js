import bcrypt from "bcryptjs";
import { Admin } from "../admin/admin.model.js";
import { generateAccessToken, generateRefreshToken } from "./auth.token.js";
import redis from "../../config/redis.js";

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
      `refresh:${adminID}`,
      refreshToken,
      "EX",
      7 * 24 * 60 * 60
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
