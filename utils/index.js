const returnRequestObj = (model, body) => {
  let reqObj = {};
  const obj = model?.schema?.tree;
  let schemaKeys = Object.keys(obj);
  for (let key in body) {
    if (schemaKeys.includes(key)) {
      reqObj[key] = body[key];
    }
  }
  return reqObj;
};
const pickExcept = (model, exceptArray) => {
  const obj = {};
  for (let key in model) {
    if (!exceptArray?.includes(key)) {
      obj[key] = model[key];
    }
  }
  return obj
};
module.exports = {
  returnRequestObj,
  pickExcept,
};
