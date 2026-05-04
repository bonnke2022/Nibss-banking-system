const mongoose = require("mongoose");

const BvnSchema = new mongoose.Schema(
  {
    bvn: {
      type: String,
      unique: true,
    },
    firstName: {
      type: String,
      required: [true, "Please provide your first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide your last name"],
    },
    dob: {
      type: Date,
      required: [true, "Please provide your date of birth"],
    },
    phone: {
      type: String,
      required: [true, "Please phone number linked to your bvn"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Bvn", BvnSchema);
