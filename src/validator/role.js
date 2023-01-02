const { check } = require("express-validator");

const roleValidate = () => {
  return [check("role", "role is required").not().isEmpty()];
};

module.exports = {
  roleValidate,
};
