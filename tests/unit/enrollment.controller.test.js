import {
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
} from "../../src/controllers/enrollment.controller.js";

import Enrollment from "../../src/models/enrollment.model.js";
import User from "../../src/models/user.model.js";
import Course from "../../src/models/course.model.js";

jest.mock("../../src/models/enrollment.model.js");
jest.mock("../../src/models/user.model.js");
jest.mock("../../src/models/course.model.js");

describe("Enrollment Controller (unit)", () => {
  let req, res;
  const mockEnrollment = [{ _id: "e1" }];

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // CREATE
  test("createEnrollment - success", async () => {
    req.body = { userId: "u1", courseId: "c1" };
    User.findById.mockResolvedValue({ _id: "u1", coursesEnrolled: [], save: jest.fn() });
    Course.findById.mockResolvedValue({ _id: "c1" });
    Enrollment.findOne.mockResolvedValue(null);
    Enrollment.create.mockResolvedValue({ _id: "e1", userId: "u1", courseId: "c1" });

    await createEnrollment(req, res);

    expect(User.findById).toHaveBeenCalledWith("u1");
    expect(Course.findById).toHaveBeenCalledWith("c1");
    expect(Enrollment.create).toHaveBeenCalledWith({ userId: "u1", courseId: "c1", status: "active" });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: "Enrollment created successfully",
      enrollment: expect.any(Object)
    }));
  });

  test("createEnrollment - returns 404 if user or course not found", async () => {
    req.body = { userId: "u1", courseId: "c1" };
    User.findById.mockResolvedValue(null);

    await createEnrollment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User or Course not found" });
  });

  test("createEnrollment - returns 400 if already enrolled", async () => {
    req.body = { userId: "u1", courseId: "c1" };
    User.findById.mockResolvedValue({ _id: "u1", coursesEnrolled: [], save: jest.fn() });
    Course.findById.mockResolvedValue({ _id: "c1" });
    Enrollment.findOne.mockResolvedValue({ _id: "e1" });

    await createEnrollment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "User already enrolled in this course" });
  });

  // READ ALL
  test("getEnrollments - success", async () => {
    Enrollment.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockEnrollment),
      }),
    });

    await getEnrollments(req, res);

    expect(res.json).toHaveBeenCalledWith(mockEnrollment);
  });

  test("getEnrollments - handles error", async () => {
    Enrollment.find.mockImplementation(() => { throw new Error("DB Error"); });

    await getEnrollments(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "DB Error" });
  });

  // READ ONE
  test("getEnrollmentById - success", async () => {
    req.params.id = "e1";
    Enrollment.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockEnrollment[0]),
      }),
    });

    await getEnrollmentById(req, res);

    expect(res.json).toHaveBeenCalledWith(mockEnrollment[0]);
  });

  test("getEnrollmentById - 404 if not found", async () => {
    req.params.id = "e1";
    Enrollment.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      }),
    });

    await getEnrollmentById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Enrollment not found" });
  });

  // UPDATE
  test("updateEnrollment - success", async () => {
    req.params.id = "e1";
    req.body = { status: "completed" };
    Enrollment.findByIdAndUpdate.mockResolvedValue({ _id: "e1", status: "completed" });

    await updateEnrollment(req, res);

    expect(res.json).toHaveBeenCalledWith({ _id: "e1", status: "completed" });
  });

  // DELETE
  test("deleteEnrollment - success", async () => {
    req.params.id = "e1";
    Enrollment.findByIdAndDelete.mockResolvedValue({ _id: "e1", userId: "u1", courseId: "c1" });
    User.findByIdAndUpdate.mockResolvedValue({});

    await deleteEnrollment(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "Enrollment deleted successfully" });
  });

  test("deleteEnrollment - handles error", async () => {
    req.params.id = "e1";
    Enrollment.findByIdAndDelete.mockRejectedValue(new Error("DB Error"));

    await deleteEnrollment(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "DB Error" });
  });
});
