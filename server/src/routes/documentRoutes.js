const express = require("express");
const router = express.Router();

const {
  uploadDocument,
  getDocuments,
  uploadProfilePhoto,
  deleteDocument,
} = require("../controllers/documentController");

const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Provider document and profile photo management
 */

/**
 * @swagger
 * /api/providers/documents:
 *   post:
 *     summary: Upload a verification document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - document
 *             properties:
 *               type:
 *                 type: string
 *                 enum:
 *                   - aadhaar
 *                   - pan
 *                   - address_proof
 *                   - other
 *                 example: aadhaar
 *               document:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *       400:
 *         description: Invalid document or missing file
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  protect,
  authorize("provider"),
  upload.single("document"),
  uploadDocument
);

/**
 * @swagger
 * /api/providers/documents:
 *   get:
 *     summary: Get uploaded provider documents
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Documents retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  protect,
  authorize("provider"),
  getDocuments
);

/**
 * @swagger
 * /api/providers/documents/profile-photo:
 *   post:
 *     summary: Upload provider profile photo
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profilePhoto
 *             properties:
 *               profilePhoto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile photo uploaded successfully
 *       400:
 *         description: Missing or invalid file
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/profile-photo",
  protect,
  authorize("provider"),
  upload.single("profilePhoto"),
  uploadProfilePhoto
);
/**
 * @swagger
 * /api/providers/documents/{id}:
 *   delete:
 *     summary: Delete a provider document
 *     description: Deletes a document from the provider profile and removes the uploaded file from Cloudinary.
 *     tags:
 *       - Documents
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the document
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Document deleted successfully
 *       400:
 *         description: Approved profile cannot be modified
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Document or provider profile not found
 *       500:
 *         description: Failed to delete document
 */
router.delete("/:id", protect, deleteDocument);


module.exports = router;