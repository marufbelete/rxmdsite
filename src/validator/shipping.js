const { check } = require("express-validator");

const shippingValidate = () => {
  return [check("name", "shipping name is required").not().isEmpty()];
};

module.exports = {
  shippingValidate
};
