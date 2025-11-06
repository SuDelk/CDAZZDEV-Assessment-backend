import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// CREATE (Register)
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role });
    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//login
export const login = async (req, res) => {
  const { email, password } = req.body;

  // ✅ Find user in DB
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // 🔒 Admin login validation
  let isAdminLogin = req.headers["x-admin-login"] == "true";
  if (isAdminLogin && user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  if (!isAdminLogin && user.role === "admin") {
    return res.status(403).json({ message: "Access denied. Use admin login." });
  }

  // ✅ Create JWT with role info
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(200).json({
    message: `${user.role === "admin" ? "Admin" : "User"} login successful`,
    token,
    role: user.role,
  });
};

// READ (All users - Admin)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get all students
export const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).populate(
      "coursesEnrolled",
      "title description price"
    );
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET LOGGED-IN USER PROFILE
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // comes from middleware
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile fetched successfully", user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: err.message });
  }
};

// UPDATE (Admin)
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE (Admin)
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
