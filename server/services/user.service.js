import User from "../models/user.model.js";

export const getUsersService = async () => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return users;
};

export const updateUserRoleService = async (id, role) => {
  const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
  return user;
};

export const deleteUserService = async (id) => {
  await User.findByIdAndDelete(id);
  return true;
};

export const createUserService = async (data) => {
  const userExists = await User.findOne({ email: data.email });
  if (userExists) throw new Error("User already exists");

  const user = await User.create(data);
  const userResponse = user.toObject();
  delete userResponse.password;
  return userResponse;
};
