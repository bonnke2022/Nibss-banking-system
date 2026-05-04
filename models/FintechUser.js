const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const FintechUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide email"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide valid email",
      },
    },
    bankCode: {
      type: String,
      unique: true,
    },
    bankName: {
      type: String,
    },
    apiKey: {
      type: String,
      unique: true,
    },
    apiSecret: {
      type: String,
    },
  },
  { timestamps: true },
);

FintechUserSchema.pre("save", async function () {
  if (!this.isModified("apiSecret")) return;
  const salt = await bcrypt.genSalt(10);
  this.apiSecret = await bcrypt.hash(this.apiSecret, salt);
});

module.exports = mongoose.model("FintechUser", FintechUserSchema);
