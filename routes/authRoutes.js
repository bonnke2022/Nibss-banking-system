const express = require("express");
const router = express.Router();

const { register } = require("../controllers/authController");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Fintech onboarding and authentication
 */

/**
 * @swagger
 * /api/fintech/onboard/register:
 *   post:
 *     summary: Register a new fintech institution
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: First Bank
 *               email:
 *                 type: string
 *                 example: firstbank@email.com
 *     responses:
 *       201:
 *         description: Fintech registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiKey:
 *                   type: string
 *                 apiSecret:
 *                   type: string
 *                 bankCode:
 *                   type: string
 *                   example: "001"
 *                 bankName:
 *                   type: string
 *                   example: First Bank
 *       400:
 *         description: Bad request or duplicate email
 */
router.post("/register", register);

module.exports = router;
