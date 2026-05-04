const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema(
  {
    accountName: {
      type: String,
      required: [true, "Please provide full name of account holder"],
    },
    accountNumber: {
      type: String,
      unique: true,
      required: [true, "Please provide a valid account number"],
    },
    bankCode: {
      type: String,
      required: [true, "Please provide a valid bank code"],
    },
    bankName: {
      type: String,
      required: [true, "Please provide bank name"],
    },
    kycType: {
      type: String,
      required: [true, "Please provide a valid KYC "],
      enum: ["NIN", "BVN"],
    },
    kycId: {
      type: String,
      required: [true, "Please provide a valid KYC ID"],
    },
    dob: {
      type: String,
      required: [true, "Please provide a valid date of birth"],
    },
    balance: {
      type: Number,
      default: 15000,
    },
    fintechUser: {
      type: mongoose.Types.ObjectId,
      ref: "FintechUser",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Account", AccountSchema);
