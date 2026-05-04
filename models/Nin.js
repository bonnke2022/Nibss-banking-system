const mongoose = require("mongoose");

const NinSchema = new mongoose.Schema(
  {
    nin: {
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
      required: [true, "Please phone number linked to your nin"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Nin", NinSchema);
