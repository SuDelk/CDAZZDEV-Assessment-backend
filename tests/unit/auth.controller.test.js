import jwt from "jsonwebtoken";
import {
  register,
  login,
  getUsers,
  getStudents,
  getProfile,
  updateUser,
  deleteUser,
} from "../../src/controllers/auth.controller.js";
import User from "../../src/models/user.model.js";
import Enrollment from "../../src/models/enrollment.model.js";

jest.mock("../../src/models/user.model.js");
jest.mock("../../src/models/enrollment.model.js");
jest.mock("jsonwebtoken");

describe("Auth Controller Unit Tests", () => {
  let req, res;

  beforeAll(() => {
    process.env.JWT_SECRET = "testsecret"; // Ensure jwt secret is defined
  });

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      headers: {},
      user: { id: "123", role: "student" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // ---------------- REGISTER ----------------
  it("should return 400 if user already exists", async () => {
    req.body = { name: "John", email: "john@example.com" };
    User.findOne.mockResolvedValue({ email: "john@example.com" });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
  });

  it("should create a new user", async () => {
    req.body = {
      name: "Jane",
      email: "jane@example.com",
      password: "123",
      role: "student",
    };
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ _id: "1", name: "Jane" });

    await register(req, res);

    expect(User.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User registered",
      user: { _id: "1", name: "Jane" },
    });
  });

  // ---------------- LOGIN ----------------
  it("should return 401 for invalid credentials", async () => {
    req.body = { email: "x@example.com", password: "wrong" };
    User.findOne.mockResolvedValue(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid email or password",
    });
  });

  it("should return 403 if non-admin tries admin login", async () => {
    req.body = { email: "john@example.com", password: "pass" };
    req.headers["x-admin-login"] = "true";

    const userMock = {
      role: "student",
      comparePassword: jest.fn().mockResolvedValue(true),
    };
    User.findOne.mockResolvedValue(userMock);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Access denied. Admins only.",
    });
  });

  it("should return token on successful login", async () => {
    req.body = { email: "admin@example.com", password: "password" };

    const userMock = {
      _id: "1",
      role: "admin",
      comparePassword: jest.fn().mockResolvedValue(true), // async mock
    };

    User.findOne.mockResolvedValue(userMock);
    jwt.sign.mockReturnValue("fake-token");

    await login(req, res); // make sure login is awaited

    expect(userMock.comparePassword).toHaveBeenCalledWith("password");
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: "1", role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        token: "fake-token",
        role: "admin",
        userId: "1",
      })
    );
  });

  // ---------------- GET USERS ----------------
  it("should fetch all users", async () => {
    const mockUsers = [{ name: "A" }, { name: "B" }];
    User.find.mockResolvedValue(mockUsers);

    await getUsers(req, res);

    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  // ---------------- GET STUDENTS ----------------
  it("should fetch all students", async () => {
    const mockStudents = [{ name: "S1" }, { name: "S2" }];
    User.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockStudents),
    });

    await getStudents(req, res);

    expect(res.json).toHaveBeenCalledWith(mockStudents);
  });

  // ---------------- GET PROFILE ----------------
  it("should return 404 if user not found", async () => {
    User.findById.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue(null),
    });

    await getProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return profile if found", async () => {
    const mockUser = { name: "Jane" };
    User.findById.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue(mockUser),
    });

    await getProfile(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "Profile fetched successfully",
      user: mockUser,
    });
  });

  // ---------------- UPDATE USER ----------------
  it("should update user successfully", async () => {
    req.params.id = "1";
    req.body = { name: "Updated" };
    User.findByIdAndUpdate.mockResolvedValue({ _id: "1", name: "Updated" });

    await updateUser(req, res);

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "1",
      { name: "Updated" },
      { new: true }
    );
    expect(res.json).toHaveBeenCalledWith({ _id: "1", name: "Updated" });
  });

  // ---------------- DELETE USER ----------------
  it("should delete user and enrollments", async () => {
    req.params.id = "123";
    User.findByIdAndDelete.mockResolvedValue();
    Enrollment.deleteMany.mockResolvedValue();

    await deleteUser(req, res);

    expect(User.findByIdAndDelete).toHaveBeenCalledWith("123");
    expect(Enrollment.deleteMany).toHaveBeenCalledWith({ userId: "123" });
    expect(res.json).toHaveBeenCalledWith({
      message: "User and related enrollments deleted",
    });
  });
});
