const { check } = require("express-validator");

const productValidate = () => {
  return [
    check("product_name", "product name is required").not().isEmpty(),
    check("price", "price is required").not().isEmpty(),
  ];
};

module.exports = {
  productValidate,
};
