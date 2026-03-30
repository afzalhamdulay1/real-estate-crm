import {
  getUsersService,
  updateUserRoleService,
  deleteUserService,
  createUserService,
} from "../services/user.service.js";

// Create user
export const createUser = async (req, res) => {
  try {
    const user = await createUserService(req.body);
    res.status(201).json({ message: "User created", user });
  } catch (error) {
    console.error("Create User Error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await getUsersService();
    res.json({ users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await updateUserRoleService(req.params.id, role);
    res.json({ message: "User role updated", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    await deleteUserService(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
