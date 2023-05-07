const Joi = require("joi");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      unique: true,
      required: true,
      type: String,
      minLength: 5,
      maxLength: 100,
    },
    brand: {
      minLength: 3,
      maxLength: 100,
      type: String,
    },
    category: {
      required: true,
      type: String,
      uppercase: true,
      enum: ["A/F", "O/F", "AC/F", "F/F", "Bearings", "General"],
    },
    purchasingPrice: {
      required: true,
      type: Number,
      min: 1,
      max: 100000,
    },
    sellingPrice: {
      type: Number,
      default: function () {
        return (this.purchasingPrice * 110) / 100;
      },
    },
    quantity: {
      required: true,
      type: Number,
      min: 0,
      max: 100000,
    },
    addedBy: {
      required: true,
      ref: "User",
      type: mongoose.Types.ObjectId,
    },
  },
  { timeseries: true }
);
const validateProduct = (product) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(100).required(),
    brand: Joi.string().min(3).max(100).required(),
    category: Joi.string()
      .valid("A/F", "O/F", "AC/F", "F/F", "Bearings", "General")
      .required(),
    purchasingPrice: Joi.number().min(1).max(100000).required(),
    quantity: Joi.number().max(100000).required(),
    addedBy: Joi.objectId().required(),
  });
  return schema.validate(product);
};

const Product = mongoose.model("product", productSchema);
module.exports = {
  Product,
  validateProduct,
};
