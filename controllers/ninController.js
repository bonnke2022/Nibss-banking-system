const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors");
const Nin = require("../models/Nin");
const crypto = require("crypto");

const createNin = async (req, res) => {
  const { firstName, lastName, dob, phone } = req.body;
  const nin = crypto.randomInt(10000000000, 99999999999).toString();

  if (!firstName || !lastName || !dob || !phone) {
    throw new CustomAPIError.BadRequestError(
      "Please provide all required fields",
    );
  }

  const newNin = await Nin.create({
    nin,
    firstName,
    lastName,
    dob,
    phone,
  });

  res.status(StatusCodes.CREATED).json({
    msg: "NIN record created successfully",
    nin: newNin.nin,
  });
};

const validateNin = async (req, res) => {
  const { nin } = req.body;
  if (!nin) {
    throw new CustomAPIError.BadRequestError("Please provide a NIN");
  }

  let valid = false;
  const validNin = await Nin.findOne({ nin });
  if (!validNin) {
    throw new CustomAPIError.NotFoundError("NIN not found");
  }

  res.status(StatusCodes.OK).json({
    valid: true,
    nin: validNin.nin,
    firstName: validNin.firstName,
    lastName: validNin.lastName,
    dob: validNin.dob,
  });
};

module.exports = { createNin, validateNin };
