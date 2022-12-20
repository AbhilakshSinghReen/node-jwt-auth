const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userModelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    hashedPassword: {
      type: String,
      trim: true,
      required: true,
    },
    passwordResetCount: {
      type: Number,
      required: true,
    },
    isRestricted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userModelSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.hashedPassword);
};

// userModelSchema.methods.updatePassword = async function(newPassword) {

// }

const userModel = mongoose.model("User", userModelSchema);

module.exports = userModel;
