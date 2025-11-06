import Enrollment from "../models/enrollment.model.js";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";

// CREATE (Enroll student)
export const createEnrollment = async (req, res) => {
  try {
    const { userId, courseId, status } = req.body;

    // Validate existence
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);
    if (!user || !course)
      return res.status(404).json({ message: "User or Course not found" });

    // Prevent duplicate enrollments
    const existing = await Enrollment.findOne({ userId, courseId });
    if (existing)
      return res.status(400).json({ message: "User already enrolled in this course" });

    // Create enrollment record
    const enrollment = await Enrollment.create({
      userId,
      courseId,
      status: status || "active",
    });

    // Update user's enrolled courses list
    user.coursesEnrolled.push(courseId);
    await user.save();

    res.status(201).json({
      message: "Enrollment created successfully",
      enrollment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ALL
export const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("userId", "name email")
      .populate("courseId", "title");
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ONE
export const getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate("userId", "name email")
      .populate("courseId", "title");
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE STATUS
export const updateEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
export const deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (enrollment) {
      // Remove course from user.coursesEnrolled
      await User.findByIdAndUpdate(enrollment.userId, {
        $pull: { coursesEnrolled: enrollment.courseId },
      });
    }
    res.json({ message: "Enrollment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
