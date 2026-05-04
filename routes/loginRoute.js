const express = require("express");
const router = express.Router();

const { login } = require("../controllers/authController");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Fintech onboarding and authentication
 */

/**
 * @swagger
 * /api/fintech/onboard/login:
 *   post:
 *     summary: Login and get a bearer token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - apiKey
 *               - apiSecret
 *             properties:
 *               apiKey:
 *                 type: string
 *                 example: your_apiKey_here
 *               apiSecret:
 *                 type: string
 *                 example: your_apiSecret_here
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 fintechUser:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     bankCode:
 *                       type: string
 *                     bankName:
 *                       type: string
 *       400:
 *         description: Missing credentials
 *       401:
 *         description: Invalid apiKey or apiSecret
 */
router.post("/login", login);

module.exports = router;
