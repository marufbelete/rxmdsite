const { check } = require("express-validator");

const categoryValidate = () => {
  return [check("category_name", "category name is required").not().isEmpty()];
};

module.exports = {
  categoryValidate
};
