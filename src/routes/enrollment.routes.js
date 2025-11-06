import express from "express";
import {
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
} from "../controllers/enrollment.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Manage student enrollments
 */

/**
 * @swagger
 * /api/enrollments:
 *   get:
 *     summary: Get all enrollments
 *     tags: [Enrollments]
 */
router.get("/", getEnrollments);

/**
 * @swagger
 * /api/enrollments/{id}:
 *   get:
 *     summary: Get enrollment by ID
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.get("/:id", getEnrollmentById);

/**
 * @swagger
 * /api/enrollments:
 *   post:
 *     summary: Create new enrollment
 *     tags: [Enrollments]
 */
router.post("/", createEnrollment);

/**
 * @swagger
 * /api/enrollments/{id}:
 *   put:
 *     summary: Update enrollment
 *     tags: [Enrollments]
 */
router.put("/:id", updateEnrollment);

/**
 * @swagger
 * /api/enrollments/{id}:
 *   delete:
 *     summary: Delete enrollment
 *     tags: [Enrollments]
 */
router.delete("/:id", deleteEnrollment);

export default router;
