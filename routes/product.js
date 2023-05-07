const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const { addNewProduct, updateProduct, deleteProduct } = require("../controllers/product");
router.post("/addProduct", authMiddleware, addNewProduct);
router.put("/editProduct", authMiddleware, updateProduct);
router.delete("/deleteProduct", authMiddleware, deleteProduct);
module.exports = router;
