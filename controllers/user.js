const { User, validateUser, validateLoginData } = require("../models/user");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    let { body } = req;
    const { error } = validateUser(body);
    if (error) {
      return res.status(400).send({ message: error?.details[0]?.message });
    }
    const userExist = await User.findOne({ email: body.email });
    if (userExist) {
      return res.status(400).send({ message: "Email is already taken" });
    }
    body.password = await bcrypt.hash(body.password, 10);
    const user = new User(body);
    const token = user.generateAuthToken();
    await user.save();
    delete user?._doc?.password;
    const obj = {
      ...user?._doc,
      token,
    };
    return res
      .status(200)
      .send({ user: obj, message: `Registered as ${body?.role}` });
  } catch (e) {
    console.log("e", e);
    return res.status(500).send({ error: e, message: "Something Went Wrong!" });
  }
};

const authenticateUser = async (req, res) => {
  try {
    const { body } = req;
    const { error } = validateLoginData(req.body);
    if (error) {
      return res.status(400).send({ message: error?.details[0]?.message });
    }
    const user = await User.findOne({ email: body.email });
    if (!user) {
      return res.status(400).send({ message: "Invalid Email or Password" });
    }
    const valid = await bcrypt.compare(body.password, user?.password);
    if (!valid) {
      return res.status(400).send({ message: "Invalid Email or Password" });
    }
    const token = user.generateAuthToken();
    delete user?._doc?.password;
    const obj = {
      ...user?._doc,
      token,
    };
    return res.status(200).send({ user: obj, message: `Login Succesful!` });
  } catch (e) {
    console.log("e", e);
    return res.status(500).send({ error: e, message: "Something Went Wrong!" });
  }
};
module.exports = {
  registerUser,
  authenticateUser
};
