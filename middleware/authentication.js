const jwt = require("jsonwebtoken");
const FintechUser = require("../models/FintechUser");
const CustomAPIError = require("../errors");

const auth = async (req, res, next) => {
  //check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomAPIError.UnauthorizedError("Authentication invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach the user to the job routes
    req.user = {
      fintechId: payload.fintechId,
      bankCode: payload.bankCode,
      bankName: payload.bankName,
    };
    next();
  } catch (error) {
    throw new CustomAPIError.UnauthenticatedError("Authentication Invalid");
  }
};

module.exports = auth;
