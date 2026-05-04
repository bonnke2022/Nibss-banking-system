const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors");
const Transfer = require("../models/Transfer");
const crypto = require("crypto");
const Account = require("../models/Account");

const transfer = async (req, res) => {
  const { from, to, amount } = req.body;
  const { fintechId } = req.user;

  if (!from || !to || !amount) {
    throw new CustomAPIError.BadRequestError(
      "Please provide all transfer details",
    );
  }

  const senderAccount = await Account.findOne({ accountNumber: from });
  const recipientAccount = await Account.findOne({ accountNumber: to });

  if (!senderAccount || !recipientAccount) {
    throw new CustomAPIError.NotFoundError("Invalid account details");
  }

  if (!senderAccount.accountName || !recipientAccount.accountName) {
    throw new CustomAPIError.BadRequestError(
      "Account name enquiry failed, please verify account details before transfer",
    );
  }

  const transactionId = `TSQ-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  const transferAmount = Number(amount);

  if (senderAccount.balance < transferAmount) {
    throw new CustomAPIError.BadRequestError("Insufficient funds");
  }

  const type =
    senderAccount.bankCode === recipientAccount.bankCode
      ? "intrabank"
      : "interbank";

  try {
    senderAccount.balance -= transferAmount;
    recipientAccount.balance += transferAmount;
    await senderAccount.save();
    await recipientAccount.save();
    status = "successful";
  } catch (error) {
    senderAccount.balance += transferAmount; // Revert sender's balance
    recipientAccount.balance -= transferAmount;
    await senderAccount.save();
    await recipientAccount.save();
    status = "failed";
  }

  const transferRecord = await Transfer.create({
    transactionId,
    amount: transferAmount,
    from: senderAccount.accountNumber,
    to: recipientAccount.accountNumber,
    status,
    type,
    fintechUser: fintechId,
  });

  res.status(StatusCodes.OK).json({
    msg: status === "successful" ? "Transfer successful" : "Transfer failed",
    transactionId: transferRecord.transactionId,
    amount: transferRecord.amount,
    from: transferRecord.from,
    to: transferRecord.to,
    status: transferRecord.status,
    type: transferRecord.type,
  });
};

const transactionStatusQuery = async (req, res) => {
  const { transactionId } = req.params;

  if (!transactionId) {
    throw new CustomAPIError.BadRequestError("Invalid transaction ID");
  }

  const transferRecord = await Transfer.findOne({ transactionId });

  if (!transferRecord) {
    throw new CustomAPIError.NotFoundError("Transaction not found");
  }
  res.status(StatusCodes.OK).json({
    transactionId: transferRecord.transactionId,
    status: transferRecord.status,
    amount: transferRecord.amount,
    from: transferRecord.from,
    to: transferRecord.to,
    timestamp: transferRecord.createdAt,
  });
};

module.exports = { transfer, transactionStatusQuery };
