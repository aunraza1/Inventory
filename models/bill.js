const Joi = require("joi");
const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    products: [
      {
        id: mongoose.Types.ObjectId,
        name: {
          type: String,
        },
        price: {
          required: true,
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
      default: Number,
    },
    type: {
      required: true,
      enum: ["credit", "cash"],
      default: String,
    },
    customer: {
      required: true,
      type: function () {
        if (this.type === "credit") {
          this.customer.ref = "User";
        }
        return this.type === "credit" ? mongoose.Types.ObjectId : String;
      },
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  { timeseries: true }
);
const validateBill = () => {
  const schema = Joi.object({
    products: Joi.array().items(
      Joi.object({
        id: Joi.ObjectId().required(),
        name: Joi.string().required(),
        price: Joi.number().required(),
        quantity: Joi.number().min(1).required(),
      })
    ),
    amount: Joi.number().min(1),
    type: Joi.string().valid("credit", "cash").required(),
    balance: Joi.number().min(0),
  });
  return schema.validate(product);
};
const Billschema = mongoose.model("billSchema", billSchema);
module.exports = {
  Billschema,
  validateBill,
};
