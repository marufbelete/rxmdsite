const { check} = require("express-validator");

const catagoryValidate = () => {
  return [check("catagory_name", "catagory name is required").not().isEmpty()];
};
module.exports = {
 catagoryValidate
};
