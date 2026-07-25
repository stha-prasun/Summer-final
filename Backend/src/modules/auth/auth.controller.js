import { loginAdmin } from "./auth.service.js";

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
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .cookie("refreshToken", refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
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
