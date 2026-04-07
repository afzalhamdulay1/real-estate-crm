import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Register user
export const registerUserService = async (data) => {
  const userExists = await User.findOne({ email: data.email });
  if (userExists) throw new Error("User already exists");

  const user = await User.create(data);
  return user;
};

// Login user
export const loginUserService = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new Error("Invalid password");

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

  return { user, token };
};
