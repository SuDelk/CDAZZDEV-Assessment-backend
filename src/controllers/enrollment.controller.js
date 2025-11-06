import Enrollment from "../models/enrollment.model.js";

// CREATE
export const createEnrollment = async (req, res) => {
  try {
    const { userId, courseId, status } = req.body;
    const existing = await Enrollment.findOne({ userId, courseId });
    if (existing) return res.status(400).json({ message: "Already enrolled" });

    const enrollment = await Enrollment.create({ userId, courseId, status });
    res.status(201).json(enrollment);
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
    if (!enrollment) return res.status(404).json({ message: "Not found" });
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
export const updateEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
export const deleteEnrollment = async (req, res) => {
  try {
    await Enrollment.findByIdAndDelete(req.params.id);
    res.json({ message: "Enrollment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};