const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors");
const crypto = require("crypto");
const FintechUser = require("../models/FintechUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new CustomAPIError.BadRequestError(
      "Please provide valid credentials",
    );
  }
  const apiKey = crypto.randomBytes(40).toString("hex");
  const apiSecret = crypto.randomBytes(70).toString("hex");
  const plainApiSecret = apiSecret;
  const lastFintech = await FintechUser.findOne().sort({ createdAt: -1 });
  const lastCode =
    lastFintech && lastFintech.bankCode ? parseInt(lastFintech.bankCode) : 0;
  const bankCode = String(lastCode + 1).padStart(3, "0");

  const bankName = name;

  await FintechUser.create({
    name,
    email,
    apiKey,
    apiSecret,
    bankCode,
    bankName,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ apiKey, apiSecret: plainApiSecret, bankCode, bankName });
};

const login = async (req, res) => {
  const { apiKey, apiSecret } = req.body;
  if (!apiKey || !apiSecret) {
    throw new CustomAPIError.BadRequestError(
      "Please provide valid credentials",
    );
  }

  const fintechUser = await FintechUser.findOne({ apiKey });
  if (!fintechUser) {
    throw new CustomAPIError.UnauthorizedError("Invalid API Key");
  }
  const isValidSecret = await bcrypt.compare(apiSecret, fintechUser.apiSecret);
  if (!isValidSecret) {
    throw new CustomAPIError.UnauthorizedError("Invalid API Secret");
  }

  const token = jwt.sign(
    {
      fintechId: fintechUser._id,
      bankCode: fintechUser.bankCode,
      bankName: fintechUser.bankName,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME },
  );
  res
    .status(StatusCodes.OK)
    .json({
      token,
      fintechUser: {
        name: fintechUser.name,
        email: fintechUser.email,
        bankCode: fintechUser.bankCode,
        bankName: fintechUser.bankName,
      },
    });
};

module.exports = { register, login };
