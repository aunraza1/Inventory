const express = require("express");
const router = express.Router();
const { createBill } = require("../controllers/bills");
router.post("/createBill", createBill);
module.exports = router;
