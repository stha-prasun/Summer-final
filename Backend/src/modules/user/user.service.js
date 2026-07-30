import { User } from "./user.model.js";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "./user.token.js";
import { createUser } from "./factory/user.factory.js";

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

  const loggedInUser = {
    _id: userID,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
  };

  return { accessToken, refreshToken, loggedInUser };
};
