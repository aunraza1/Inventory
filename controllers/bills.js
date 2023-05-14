const { validateBill, Billschema } = require("../models/bill");
const { Product } = require("../models/product");
const { User } = require("../models/user");

const createBill = async (req, res) => {
  try {
    const { body } = req;
    const { error } = validateBill(body);
    let user;
    if (error) {
      return res.status(400).send({ message: error?.details[0]?.message });
    }
    if (body?.type === "cash") {
      if (!body.name) {
        return res
          .status(400)
          .send({ message: "Name is required for bill creation" });
      }
    }
    if (body.type === "credit") {
      if (!body.customer) {
        return res.status(400).send({ message: "Customer is required" });
      }
      user = await User.findOne({ _id: body.customer });
      if (user.role !== "customer") {
        return res
          .status(403)
          .send({ message: "You are not allowed to perform this request" });
      }
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
      let billObj = {
        type: body?.type,
        products: productsToReturn,
        amount: totalAmount,
      };
      if (body.type == "cash") {
        billObj.name = body.name;
      }
      if (body.type === "credit") {
        billObj.customer = body.customer;
      }
      const bill = new Billschema(billObj);
      await bill.save();
      return res.status(200).send({
        ...billObj,
        name: billObj?.name
          ? billObj?.name
          : user?.firstName + " " + user?.lastName,
        message: "Bill Created Successfully",
        date: new Date().toISOString(),
      });
    }
    return res.status(400).send({
      message: `${
        errorObj?.category + " " + errorObj?.name
      } is low in Quantity Availble Quantity ${errorObj?.quantity}`,
    });
  } catch (e) {
    return res.status(500).send({ message: "Something Went Wrong", e });
  }
};
module.exports = {
  createBill,
};
