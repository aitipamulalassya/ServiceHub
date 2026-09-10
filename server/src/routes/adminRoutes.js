const express = require("express");
const router = express.Router();

const {
  getProviders,
  getProviderById,
  approveProvider,
  rejectProvider,
  getDashboardStats,
} = require("../controllers/adminController");

const { protect, authorize } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrator provider management and dashboard
 */

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get(
  "/stats",
  protect,
  authorize("admin"),
  getDashboardStats
);

/**
 * @swagger
 * /api/admin/providers:
 *   get:
 *     summary: Get all service providers
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search providers by name or email
 *         example: Rahul
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - draft
 *             - pending
 *             - approved
 *             - rejected
 *         description: Filter providers by application status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of providers per page
 *     responses:
 *       200:
 *         description: Providers retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get(
  "/providers",
  protect,
  authorize("admin"),
  getProviders
);

/**
 * @swagger
 * /api/admin/providers/{id}:
 *   get:
 *     summary: Get provider details
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Provider profile ID
 *         example: 64f123456789abcdef123456
 *     responses:
 *       200:
 *         description: Provider details retrieved successfully
 *       404:
 *         description: Provider not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get(
  "/providers/:id",
  protect,
  authorize("admin"),
  getProviderById
);

/**
 * @swagger
 * /api/admin/providers/{id}/approve:
 *   patch:
 *     summary: Approve a provider application
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Provider profile ID
 *     responses:
 *       200:
 *         description: Provider approved successfully
 *       400:
 *         description: Provider is not pending
 *       404:
 *         description: Provider not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.patch(
  "/providers/:id/approve",
  protect,
  authorize("admin"),
  approveProvider
);

/**
 * @swagger
 * /api/admin/providers/{id}/reject:
 *   patch:
 *     summary: Reject a provider application
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Provider profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rejectionRemark
 *             properties:
 *               rejectionRemark:
 *                 type: string
 *                 example: Please upload a clearer Aadhaar document.
 *     responses:
 *       200:
 *         description: Provider rejected successfully
 *       400:
 *         description: Rejection remark required or provider is not pending
 *       404:
 *         description: Provider not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.patch(
  "/providers/:id/reject",
  protect,
  authorize("admin"),
  rejectProvider
);

module.exports = router;