const mongoose = require("mongoose");
const validator = require("validator");

const User = mongoose.model("User", {
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  age: { type: Number, default: 0 },
  password: {
    type: String,
    required: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password cannot containe password");
      }
    },
  },
});

module.exports = User;
