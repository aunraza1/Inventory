const Joi = require("joi");
const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    products: [
      {
        id: mongoose.Types.ObjectId,
        price: {
          min: 1,
          max: 10000,
          type: Number,
        },
        quantity: {
          default: Number,
        },
      },
    ],
    amount: {
      type: Number,
    },
    type: {
      enum: ["credit", "cash"],
      default: String,
    },
    customer: {
      ref: "User",
      type: mongoose.Types.ObjectId,
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const validateBill = (bill) => {
  const schema = Joi.object({
    products: Joi.array()
      .items(
        Joi.object({
          id: Joi.objectId().required(),
          price: Joi.number().min(1).required(),
          quantity: Joi.number().min(1).required(),
        })
      )
      .required(),
    amount: Joi.number().min(1),
    type: Joi.string().valid("credit", "cash").required(),
    balance: Joi.number().min(0),
  });
  return schema.validate(bill);
};
const Billschema = mongoose.model("Bills", billSchema);
module.exports = {
  Billschema,
  validateBill,
};
