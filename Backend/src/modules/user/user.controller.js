import { signup, login, refreshSession } from "./user.service.js";

const COOKIE_OPTIONS = { httpOnly: true, sameSite: "strict" };

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password || !phone || !address?.street || !address?.city || !address?.state || !address?.zip || !address?.country) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const user = await signup({ name, email, password, phone, address });

    res.status(201).json({
      message: "Account created successfully!",
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

export const refreshUserSession = async (req, res) => {
  try {
    const { accessToken, refreshToken } = await refreshSession(req.cookies);

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
      .json({ success: true, accessToken });
  } catch (error) {
    const status = error.status || 401;
    res.status(status).json({ success: false, message: error.message || "Refresh failed" });
  }
};
