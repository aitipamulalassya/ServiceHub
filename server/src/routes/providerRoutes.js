const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  submitApplication,
  getApplicationStatus,
} = require("../controllers/providerController");

const { protect, authorize } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Provider
 *   description: Service provider profile and application management
 */

/**
 * @swagger
 * /api/providers/profile:
 *   get:
 *     summary: Get provider profile
 *     tags: [Provider]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Provider profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/profile",
  protect,
  authorize("provider"),
  getProfile
);

/**
 * @swagger
 * /api/providers/profile:
 *   put:
 *     summary: Update provider profile
 *     tags: [Provider]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Plumbing", "Electrical"]
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Pipe fitting", "Wiring"]
 *               experience:
 *                 type: number
 *                 example: 3
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     example: Hyderabad
 *                   state:
 *                     type: string
 *                     example: Telangana
 *                   pincode:
 *                     type: string
 *                     example: "500001"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid profile data
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/profile",
  protect,
  authorize("provider"),
  updateProfile
);

/**
 * @swagger
 * /api/providers/submit:
 *   post:
 *     summary: Submit provider application for admin review
 *     tags: [Provider]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Application submitted successfully
 *       400:
 *         description: Application is incomplete or already submitted
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/submit",
  protect,
  authorize("provider"),
  submitApplication
);

/**
 * @swagger
 * /api/providers/status:
 *   get:
 *     summary: Get application status
 *     tags: [Provider]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Application status retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/status",
  protect,
  authorize("provider"),
  getApplicationStatus
);

module.exports = router;