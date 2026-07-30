import { loginAdmin, refreshSession } from "./auth.service.js";

const COOKIE_OPTIONS = { httpOnly: true, sameSite: "strict" };

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
      });
    }

    const { accessToken, refreshToken, loggedInUser } = await loginAdmin({
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
        accessToken: accessToken,
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message || "Login failed",
      success: false,
    });
  }
};

export const refresh = async (req, res) => {
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
