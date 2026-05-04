const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors");
const Bvn = require("../models/Bvn");
const crypto = require("crypto");

const createBvn = async (req, res) => {
  const { firstName, lastName, dob, phone } = req.body;
  const bvn = crypto.randomInt(10000000000, 99999999999).toString();

  if (!firstName || !lastName || !dob || !phone) {
    throw new CustomAPIError.BadRequestError(
      "Please provide all required fields",
    );
  }

  const newBvn = await Bvn.create({
    bvn,
    firstName,
    lastName,
    dob,
    phone,
  });

  res.status(StatusCodes.CREATED).json({
    msg: "BVN record created successfully",
    bvn: newBvn.bvn,
  });
};

const validateBvn = async (req, res) => {
  const { bvn } = req.body;
  if (!bvn) {
    throw new CustomAPIError.BadRequestError("Please provide a BVN");
  }

  let valid = false;
  const validBvn = await Bvn.findOne({ bvn });
  if (!validBvn) {
    throw new CustomAPIError.NotFoundError("BVN not found");
  }

  res.status(StatusCodes.OK).json({
    valid: true,
    bvn: validBvn.bvn,
    firstName: validBvn.firstName,
    lastName: validBvn.lastName,
    dob: validBvn.dob,
  });
};

module.exports = { createBvn, validateBvn };
