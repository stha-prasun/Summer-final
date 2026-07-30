import { signup, login } from "./user.service.js";

const COOKIE_OPTIONS = { httpOnly: true, sameSite: "strict" };

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Fields cannot be left empty",
        success: false,
      });
    }

    const user = await signup({ name, email, password });

    res.status(201).json({
      message: "User created successfully",
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Fields cannot be left empty",
        success: false,
      });
    }

    const { accessToken, refreshToken, loggedInUser } = await login({
      email,
      password,
    });

    res
      .status(200)
      .cookie("accessToken", accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${loggedInUser.name}!`,
        success: true,
        loggedInUser,
        accessToken,
      });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};
