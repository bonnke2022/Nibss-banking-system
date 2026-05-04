const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authentication");

const {
  transfer,
  transactionStatusQuery,
} = require("../controllers/transfersController");

/**
 * @swagger
 * tags:
 *   name: Transfers
 *   description: Money transfers and transaction management
 */

/**
 * @swagger
 * /api/fintech/transfers/transfer:
 *   post:
 *     summary: Initiate a money transfer between accounts
 *     tags: [Transfers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - from
 *               - to
 *               - amount
 *             properties:
 *               from:
 *                 type: string
 *                 description: Sender's 10-digit account number
 *                 example: "1234567890"
 *               to:
 *                 type: string
 *                 description: Recipient's 10-digit account number
 *                 example: "0987654321"
 *               amount:
 *                 type: number
 *                 description: Amount to transfer
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Transfer processed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Transfer successful
 *                 transactionId:
 *                   type: string
 *                   example: TSQ-1234567890-AB12CD34
 *                 amount:
 *                   type: number
 *                 from:
 *                   type: string
 *                 to:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [successful, failed]
 *                 type:
 *                   type: string
 *                   enum: [intrabank, interbank]
 *       400:
 *         description: Bad request, missing fields or insufficient funds
 *       404:
 *         description: Invalid account details
 *       401:
 *         description: Unauthorized
 */
router.post("/transfer", authMiddleware, transfer);

/**
 * @swagger
 * /api/fintech/transfers/transaction/{transactionId}:
 *   get:
 *     summary: Query the status of a transaction
 *     tags: [Transfers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The transaction ID generated during transfer
 *         example: TSQ-1234567890-AB12CD34
 *     responses:
 *       200:
 *         description: Transaction found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactionId:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [pending, successful, failed]
 *                 amount:
 *                   type: number
 *                 from:
 *                   type: string
 *                 to:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Transaction not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/transaction/:transactionId",
  authMiddleware,
  transactionStatusQuery,
);

module.exports = router;
