require("dotenv").config();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { connectToDb } = require("./database/index");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT;
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/product");
const billsRoutes = require("./routes/bills");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/bills", billsRoutes);

if (!process.env.TOKENKEY) {
  console.error("FATAL ERROR: TOKENKEY Not defined");
  process.exit(1);
}

connectToDb()
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.log("e", e);
  });

app.listen(PORT, () => console.log("Listening at Port", PORT));
