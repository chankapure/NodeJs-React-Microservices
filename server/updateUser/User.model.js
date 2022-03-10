const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others", null],
      default: null,
    },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    versionKey: false,
    _id: false,
    strict: true,
  }
);

exports.default = mongoose.model("User", UserSchema);
