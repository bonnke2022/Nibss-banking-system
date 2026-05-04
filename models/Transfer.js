const mongoose = require("mongoose");

const TransferSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      unique: true,
      required: true,
    },
    from: {
      type: String,
      required: [true, "Please provide sender's account number"],
    },
    to: {
      type: String,
      required: [true, "Please provide receiver's accountnumber"],
    },
    amount: {
      type: Number,
      required: [true, "Please provide a valid amount"],
    },
    status: {
      type: String,
      enum: ["pending", "successful", "failed"],
      default: "pending",
    },
    type: {
      type: String,
      enum: ["intrabank", "interbank"],
    },
    fintechUser: {
      type: mongoose.Types.ObjectId,
      ref: "FintechUser",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transfer", TransferSchema);
