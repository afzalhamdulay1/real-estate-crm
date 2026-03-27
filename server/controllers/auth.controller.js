import {
  registerUserService,
  loginUserService,
} from "../services/auth.service.js";

// Register User
export const registerUser = async (req, res) => {
  try {
    const user = await registerUserService(req.body);
    res.status(201).json({ message: "User created", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login User (with HttpOnly Cookie)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUserService(email, password);

    // Send token in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true, // JS cannot access it
      secure: process.env.NODE_ENV === "production", // only HTTPS in prod
      sameSite: "Strict", // prevent CSRF
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Send user info in response body, no token
    res.json({ user, message: "Login successful" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// Logout User
export const logoutUser = async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
};
