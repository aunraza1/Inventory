const { validateProduct, Product } = require(".././models/product");
const { returnRequestObj } = require("../utils");

const addNewProduct = async (req, res) => {
  try {
    let { user, body } = req;
    if (user && user?.role !== "manager") {
      return res
        .status(403)
        .send({ message: "You are not allowed to this request" });
    }
    body.addedBy = user?._id;
    const { error } = validateProduct(body);
    if (error) {
      return res.status(400).send({ message: error?.details[0]?.message });
    }
    const existingProduct = await Product.findOne({
      name: body.name,
      category: body.category,
    });
    if (existingProduct) {
      return res.status(400).send({
        message: `Product with Name ${body.name} & Category ${body.category} Already Exist`,
      });
    }
    const product = new Product(body);
    await product.save();
    return res
      .status(200)
      .send({ product, message: "Product Added Successfully!" });
  } catch (e) {
    return res.status(500).send({ message: "Something Went Wrong!", error: e });
  }
};

const updateProduct = async (req, res) => {
  let { body } = req;
  try {
    const productId = body.productId;
    if (!productId) {
      return res.status(400).send({ message: "ProductId is required!" });
    }
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(400).send({ message: "Product not found!" });
    }
    body = returnRequestObj(Product, body);
    const keysToExclude = ["addedBy"];
    let userAddedKey;
    let updateObj = {};
    for (let key in body) {
      if (keysToExclude.includes(key)) {
        userAddedKey = key;
      } else {
        updateObj[key] = body[key];
      }
    }
    if (updateObj?.quantity) {
      updateObj.quantity = product?.quantity
        ? parseInt(body.quantity) + product.quantity
        : parseInt(body.quantity);
    }
    if (userAddedKey) {
      return res
        .status(403)
        .send({ message: `You cannot update Key ${userAddedKey}` });
    }
    if (updateObj?.name) {
      const existing = await Product.findOne({ name: updateObj?.name });
      if (existing) {
        return res
          .status(400)
          .send({ message: "Product with this name Already Exist" });
      }
    }
    await Product.updateOne({ _id: productId }, updateObj);
    return res.status(201).send({ message: "Product Updated Successfully!" });
  } catch (e) {
    return res.status(500).send({ message: "Something Went Wrong!", error: e });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { body } = req;
    if (!body.productId) {
      return res.status(400).send({ message: "Product Id is required" });
    }
    await Product.findByIdAndDelete(body.productId);
    return res.status(200).send({ message: "Product Deleted Successfully!" });
  } catch (e) {
    return res
      .status(500)
      .send({ message: "Something Went Wrong", error: e?.message });
  }
};

module.exports = {
  addNewProduct,
  updateProduct,
  deleteProduct,
};
