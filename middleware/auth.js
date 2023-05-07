require("dotenv").config();
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .send({ message: "Token Missing From Request Header" });
    }
    
    if (!token.startsWith("Bearer ")) {
      console.log("Ye chala")
      return res
        .status(400)
        .send({ message: "Invalid Token" });
    }
    const tokenPart=token.split('Bearer ')[1]
    const decoded = jwt.verify(tokenPart, process.env.TOKENKEY);
    req.user = decoded;
    next();
  } catch (e) {
    console.log("E",e)
    res.status(400).send({ message: "Invalid Token" });
  }
};

module.exports = {
  authMiddleware,
};
