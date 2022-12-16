const { check} = require("express-validator");

const brandValidate = () => {
  return [check("brand_name", "brand name is required").not().isEmpty()];
};
module.exports = {
  brandValidate
};

