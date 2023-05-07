const mongoose = require("mongoose");
require("dotenv").config();
const { platFormRoles } = require("../config");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      required: true,
      minLength: 3,
      maxLength: 50,
      type: String,
      trim: true,
    },
    lastName: {
      minLength: 3,
      maxLength: 50,
      required: true,
      type: String,
      trim: true,
    },
    email: {
      minLength: 5,
      maxLength: 255,
      unique: true,
      type: String,
      required: true,
      trim: true,
    },
    password: {
      minLength: 5,
      maxLength: 1024,
      type: String,
      required: true,
    },
    role: {
      required: true,
      type: String,
      enum: platFormRoles,
    },
    status: {
      type: Boolean,
      default: function () {
        if (this.role === "manager") {
          return false;
        }
        return true;
      },
    },
  },
  { timestamps: true }
);

const validateUser = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    role: Joi.string().valid("admin", "manager", "customer").required(),
  });
  return schema.validate(user);
};

const validateLoginData = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(user);

};

userSchema.methods.generateAuthToken = function () {
  let user = JSON.parse(JSON.stringify(this));
  delete user.password;
  return jwt.sign(user, process.env.TOKENKEY);
};
const User = mongoose.model("User", userSchema);
module.exports = {
  User,
  validateUser,
  validateLoginData,
  validateLoginData,
};
