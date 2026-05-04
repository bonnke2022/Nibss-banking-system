const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authentication");

const {
  createAccount,
  nameEnquiry,
  getAllAccounts,
  accountBalance,
} = require("../controllers/accountController");

/**
 * @swagger
 * tags:
 *   name: Accounts
 *   description: Customer account management
 */

/**
 * @swagger
 * /api/fintech/accounts/create:
 *   post:
 *     summary: Create a new customer account
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountName
 *               - kycType
 *               - kycId
 *               - dob
 *             properties:
 *               accountName:
 *                 type: string
 *                 example: John Doe
 *               kycType:
 *                 type: string
 *                 enum: [NIN, BVN]
 *                 example: BVN
 *               kycId:
 *                 type: string
 *                 example: "12345678901"
 *               dob:
 *                 type: string
 *                 example: "1990-01-01"
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 accountNumber:
 *                   type: string
 *                 bankCode:
 *                   type: string
 *                 bankName:
 *                   type: string
 *                 balance:
 *                   type: number
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/create", authMiddleware, createAccount);

/**
 * @swagger
 * /api/fintech/accounts/name-enquiry/{accountNumber}:
 *   get:
 *     summary: Resolve account number to account holder name
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: The 10-digit account number
 *         example: "1234567890"
 *     responses:
 *       200:
 *         description: Account found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accountNumber:
 *                   type: string
 *                 accountName:
 *                   type: string
 *                 bankName:
 *                   type: string
 *       404:
 *         description: Account not found
 *       401:
 *         description: Unauthorized
 */
router.get("/name-enquiry/:accountNumber", authMiddleware, nameEnquiry);

/**
 * @swagger
 * /api/fintech/accounts/:
 *   get:
 *     summary: Get all accounts for authenticated fintech
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accounts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       accountName:
 *                         type: string
 *                       accountNumber:
 *                         type: string
 *                       balance:
 *                         type: number
 *                 count:
 *                   type: number
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, getAllAccounts);

/**
 * @swagger
 * /api/fintech/accounts/balance/{accountNumber}:
 *   get:
 *     summary: Get account balance
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: The 10-digit account number
 *         example: "1234567890"
 *     responses:
 *       200:
 *         description: Account balance retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accountNumber:
 *                   type: string
 *                 balance:
 *                   type: number
 *       404:
 *         description: Account not found
 *       401:
 *         description: Unauthorized
 */
router.get("/balance/:accountNumber", authMiddleware, accountBalance);

module.exports = router;
