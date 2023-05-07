const mongoose = require("mongoose");

const connectToDb = async () => {
  try {
    await mongoose.connect("mongodb://localhost/inventory");
    return 'connected to database'
  } catch (e) {
    console.log(e)
    throw new Error("Failed to Connect");
  }
};
module.exports={
    connectToDb 
}
