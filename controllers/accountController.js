const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors");
const FintechUser = require("../models/FintechUser");
const Account = require("../models/Account");
const crypto = require("crypto");
const Bvn = require("../models/Bvn");

const createAccount = async (req, res) => {
  console.log(req.user);
  const { accountName, kycType, kycId, dob } = req.body;
  const { fintechId, bankCode, bankName } = req.user;

  if (!accountName || !kycType || !kycId || !dob) {
    throw new CustomAPIError.BadRequestError(
      "Please provide valid account details",
    );
  }

  const existingAccount = await Account.findOne({ kycId });
  if (existingAccount) {
    throw new CustomAPIError.BadRequestError(
      `${kycType} already linked an account`,
    );
  }

  if (kycType === "bvn") {
    const bvnRecord = await Bvn.findOne({ kycId });
    if (!bvnRecord) {
      throw new CustomAPIError.BadRequestError(
        "BVN record not found, please verify your details",
      );
    }
    if (bvnRecord.dob !== dob) {
      throw new CustomAPIError.BadRequestError("BVN details do not match");
    }
  }

  const accountNumber = crypto.randomInt(1000000000, 9999999999).toString();
  const account = await Account.create({
    accountName,
    accountNumber,
    bankCode,
    bankName,
    kycType,
    kycId,
    dob,
    fintechUser: fintechId,
  });
  res.status(StatusCodes.CREATED).json({
    msg: "Account created successfully",
    accountNumber: account.accountNumber,
    bankCode: account.bankCode,
    bankName: account.bankName,
    balance: account.balance,
  });
};

const nameEnquiry = async (req, res) => {
  const { accountNumber } = req.params;
  const account = await Account.findOne({ accountNumber });
  if (!account) {
    throw new CustomAPIError.NotFoundError("Account not found");
  }
  res.status(StatusCodes.OK).json({
    msg: "Account found",
    accountName: account.accountName,
    accountNumber: account.accountNumber,
    bankName: account.bankName,
  });
};

const getAllAccounts = async (req, res) => {
  const { fintechId } = req.user;
  const accounts = await Account.find(
    { fintechUser: fintechId },
    "accountName accountNumber balance",
  );
  res.status(StatusCodes.OK).json({
    accounts,
    count: accounts.length,
  });
};

const accountBalance = async (req, res) => {
  const { accountNumber } = req.params;
  const account = await Account.findOne({ accountNumber });
  if (!account) {
    throw new CustomAPIError.NotFoundError("Account not found");
  }

  res.status(StatusCodes.OK).json({
    accountNumber: account.accountNumber,
    balance: account.balance,
  });
};

module.exports = { createAccount, nameEnquiry, getAllAccounts, accountBalance };
