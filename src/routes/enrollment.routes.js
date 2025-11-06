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
 * components:
 *   schemas:
 *     Enrollment:
 *       type: object
 *       required:
 *         - userId
 *         - courseId
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated enrollment ID
 *         userId:
 *           type: string
 *           description: The ID of the user enrolled
 *         courseId:
 *           type: string
 *           description: The ID of the course enrolled in
 *         status:
 *           type: string
 *           enum: [active, completed]
 *           default: active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 672c1d001b27f7c7e6b8b067
 *         userId: 672c1c3a1b27f7c7e6b8b012
 *         courseId: 672c1c7d1b27f7c7e6b8b045
 *         status: active
 *         createdAt: 2025-11-06T12:00:00Z
 *         updatedAt: 2025-11-06T12:00:00Z
 */

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
 *     responses:
 *       200:
 *         description: List of all enrollments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Enrollment'
 *       500:
 *         description: Server error
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
 *         schema:
 *           type: string
 *         description: Enrollment ID
 *     responses:
 *       200:
 *         description: Enrollment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 *       404:
 *         description: Enrollment not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getEnrollmentById);

/**
 * @swagger
 * /api/enrollments:
 *   post:
 *     summary: Create a new enrollment (Enroll a student in a course)
 *     tags: [Enrollments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - courseId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the student to enroll
 *               courseId:
 *                 type: string
 *                 description: ID of the course to enroll in
 *               status:
 *                 type: string
 *                 enum: [active, completed]
 *                 default: active
 *             example:
 *               userId: 672c1c3a1b27f7c7e6b8b012
 *               courseId: 672c1c7d1b27f7c7e6b8b045
 *               status: active
 *     responses:
 *       201:
 *         description: Enrollment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 *       400:
 *         description: Already enrolled or validation error
 *       404:
 *         description: User or course not found
 *       500:
 *         description: Server error
 */
router.post("/", createEnrollment);

/**
 * @swagger
 * /api/enrollments/{id}:
 *   put:
 *     summary: Update enrollment details (e.g., status)
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enrollment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, completed]
 *             example:
 *               status: completed
 *     responses:
 *       200:
 *         description: Enrollment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 *       404:
 *         description: Enrollment not found
 *       500:
 *         description: Server error
 */
router.put("/:id", updateEnrollment);

/**
 * @swagger
 * /api/enrollments/{id}:
 *   delete:
 *     summary: Delete an enrollment
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Enrollment ID
 *     responses:
 *       200:
 *         description: Enrollment deleted successfully
 *       404:
 *         description: Enrollment not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteEnrollment);

export default router;
