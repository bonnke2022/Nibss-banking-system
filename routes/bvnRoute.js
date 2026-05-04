const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authentication");

const { createBvn, validateBvn } = require("../controllers/bvnController");

/**
 * @swagger
 * tags:
 *   name: BVN
 *   description: Bank Verification Number management
 */

/**
 * @swagger
 * /api/fintech/bvn/insertBvn:
 *   post:
 *     summary: Create a new BVN record in the mock NIBSS registry
 *     tags: [BVN]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - dob
 *               - phone
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               dob:
 *                 type: string
 *                 example: "1990-01-01"
 *               phone:
 *                 type: string
 *                 example: "08012345678"
 *     responses:
 *       201:
 *         description: BVN record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 bvn:
 *                   type: string
 *                   example: "12345678901"
 *       400:
 *         description: Bad request or missing fields
 *       401:
 *         description: Unauthorized
 */
router.post("/insertBvn", authMiddleware, createBvn);

/**
 * @swagger
 * /api/fintech/bvn/validateBvn:
 *   post:
 *     summary: Validate a BVN against the mock NIBSS registry
 *     tags: [BVN]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bvn
 *             properties:
 *               bvn:
 *                 type: string
 *                 example: "12345678901"
 *     responses:
 *       200:
 *         description: BVN found and validated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                 bvn:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 dob:
 *                   type: string
 *       404:
 *         description: BVN not found
 *       401:
 *         description: Unauthorized
 */
router.post("/validateBvn", authMiddleware, validateBvn);

module.exports = router;
