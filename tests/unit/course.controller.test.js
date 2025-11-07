// tests/unit/course.controller.test.js
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../../src/controllers/course.controller.js";
import Course from "../../src/models/course.model.js";

jest.mock("../../src/models/course.model.js"); // mock the Course model

describe("Course Controller (unit)", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // CREATE
  test("createCourse - should create a course", async () => {
    req.body = { title: "React 101", description: "Learn React", price: 99.99 };
    const createdCourse = { ...req.body, _id: "courseId" };
    Course.create.mockResolvedValue(createdCourse);

    await createCourse(req, res);

    expect(Course.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createdCourse);
  });

  test("createCourse - should handle errors", async () => {
    req.body = {};
    Course.create.mockRejectedValue(new Error("DB Error"));

    await createCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "DB Error" });
  });

  // READ ALL
  test("getCourses - should return all courses", async () => {
    const courses = [{ title: "Course1" }, { title: "Course2" }];
    Course.find.mockResolvedValue(courses);

    await getCourses(req, res);

    expect(Course.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(courses);
  });

  test("getCourses - should handle errors", async () => {
    Course.find.mockRejectedValue(new Error("DB Error"));

    await getCourses(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "DB Error" });
  });

  // READ ONE
  test("getCourseById - should return a course by ID", async () => {
    req.params = { id: "courseId" };
    const course = { title: "React 101" };
    Course.findById.mockResolvedValue(course);

    await getCourseById(req, res);

    expect(Course.findById).toHaveBeenCalledWith("courseId");
    expect(res.json).toHaveBeenCalledWith(course);
  });

  test("getCourseById - should return 404 if not found", async () => {
    req.params = { id: "courseId" };
    Course.findById.mockResolvedValue(null);

    await getCourseById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Course not found" });
  });

  test("getCourseById - should handle errors", async () => {
    req.params = { id: "courseId" };
    Course.findById.mockRejectedValue(new Error("DB Error"));

    await getCourseById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "DB Error" });
  });

  // UPDATE
  test("updateCourse - should update a course", async () => {
    req.params = { id: "courseId" };
    req.body = { title: "Updated Title" };
    const updatedCourse = { ...req.body, _id: "courseId" };
    Course.findByIdAndUpdate.mockResolvedValue(updatedCourse);

    await updateCourse(req, res);

    expect(Course.findByIdAndUpdate).toHaveBeenCalledWith("courseId", req.body, { new: true });
    expect(res.json).toHaveBeenCalledWith(updatedCourse);
  });

  test("updateCourse - should handle errors", async () => {
    req.params = { id: "courseId" };
    req.body = {};
    Course.findByIdAndUpdate.mockRejectedValue(new Error("DB Error"));

    await updateCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "DB Error" });
  });

  // DELETE
  test("deleteCourse - should delete a course", async () => {
    req.params = { id: "courseId" };
    Course.findByIdAndDelete.mockResolvedValue({});

    await deleteCourse(req, res);

    expect(Course.findByIdAndDelete).toHaveBeenCalledWith("courseId");
    expect(res.json).toHaveBeenCalledWith({ message: "Course deleted" });
  });

  test("deleteCourse - should handle errors", async () => {
    req.params = { id: "courseId" };
    Course.findByIdAndDelete.mockRejectedValue(new Error("DB Error"));

    await deleteCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "DB Error" });
  });
});
