const express = require("express");
const router = express.Router();
const { registerUser, authenticateUser } = require("../controllers/user");
router.post("/register", registerUser);
router.post("/login", authenticateUser);
module.exports = router;
