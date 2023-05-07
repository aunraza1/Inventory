const { validateBill } = require("../models/bill");
const { Product } = require("../models/product");

const createBill = async (req, res) => {
  try {
    const { body } = req;
    const { error } = validateBill(body);
    if (error) {
      return res.status(400).send({ message: error?.details[0]?.message });
    }
    let errorObj = {};
    let totalAmount = 0;
    let productsToReturn = [];
    await Promise.all(
      body?.products?.map(async (v) => {
        const prod = await Product.findOne({ _id: v?.id });
        if (prod) {
          productsToReturn.push({
            id: prod?._id,
            name: prod?.name,
            category: prod?.category,
            price: v?.price,
            quantity: v?.quantity,
          });
          let product = v?.quantity * v?.price;
          totalAmount = totalAmount + product;
          if (v?.quantity > prod?.quantity) {
            errorObj.category = prod?.category;
            errorObj.quantity = prod?.quantity;
            errorObj.name = prod?.name;
          }
        }
      })
    );
    if (!Object.keys(errorObj)?.length > 0) {
      await Promise.all(
        productsToReturn?.map(async (v) => {
          const find = await Product.findById(v?.id);
          if (find) {
            await Product.updateOne(
              { _id: v?.id },
              { quantity: find?.quantity - v?.quantity }
            );
          }
        })
      );
      return res.status(200).send({
        products: productsToReturn,
        amount: totalAmount,
        message: "Bill Created Successfully",
      });
    }
    return res.status(400).send({
      message: `${
        errorObj?.category + " " + errorObj?.name
      } is low in Quantity Availble Quantity ${errorObj?.quantity}`,
    });
  } catch (e) {
    console.log("E", e);
    return res.status(500).send({ message: "Something Went Wrong", e });
  }
};
module.exports = {
  createBill,
};
