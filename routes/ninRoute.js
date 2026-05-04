const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authentication");

const { createNin, validateNin } = require("../controllers/ninController");

/**
 * @swagger
 * tags:
 *   name: NIN
 *   description: National Identification Number management
 */

/**
 * @swagger
 * /api/fintech/nin/insertNin:
 *   post:
 *     summary: Create a new NIN record in the mock NIMC registry
 *     tags: [NIN]
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
 *                 example: Jane
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               dob:
 *                 type: string
 *                 example: "1995-05-15"
 *               phone:
 *                 type: string
 *                 example: "08098765432"
 *     responses:
 *       201:
 *         description: NIN record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 nin:
 *                   type: string
 *                   example: "12345678901"
 *       400:
 *         description: Bad request or missing fields
 *       401:
 *         description: Unauthorized
 */
router.post("/insertNin", authMiddleware, createNin);

/**
 * @swagger
 * /api/fintech/nin/validateNin:
 *   post:
 *     summary: Validate a NIN against the mock NIMC registry
 *     tags: [NIN]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nin
 *             properties:
 *               nin:
 *                 type: string
 *                 example: "12345678901"
 *     responses:
 *       200:
 *         description: NIN found and validated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                 nin:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 dob:
 *                   type: string
 *       404:
 *         description: NIN not found
 *       401:
 *         description: Unauthorized
 */
router.post("/validateNin", authMiddleware, validateNin);

module.exports = router;
