const { validateBill } = require("../models/bill");
const { Product } = require("../models/product");

const createBill = async (req, res) => {
  try {
    const { body } = req;
    const { error } = validateBill(body);
    if (error) {
      return res.status(400).send({ message: error?.details[0]?.message });
    }
    let qtyValid = true;
    let totalAmount = 0;

    await Promise.all(
      body?.products?.map(async (v) => {
        const prod = await Product.findOne({ _id: v?.id });
        let product = v?.quantity * v?.price;
        totalAmount = totalAmount + product;
        if (v?.quantity > prod?.quantity) {
          qtyValid = false;
        }
      })
    );
    if (qtyValid) {
      return res
        .status(200)
        .send({ amount: totalAmount, message: "Bill Created Successfully" });
    }
    return res
      .status(400)
      .send({
        message: "Qty cannot be greater than Product Available Qty",
      });
  } catch (e) {
    console.log("E", e);
    return res.status(500).send({ message: "Something Went Wrong", e });
  }
};
module.exports = {
  createBill,
};
