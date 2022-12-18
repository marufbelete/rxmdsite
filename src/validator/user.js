const { check, body } = require("express-validator");

const registerValidate = () => {
  return [
    check("first_name", "first name is required").not().isEmpty(),
    check("last_name", "last name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ];
};

const loginValidate = () => {
  return [
    check("username", "username or email is required")
      .if(body("email").isEmpty())
      .not()
      .isEmpty(),
    check("email", "username or email is required")
      .if(body("username").isEmpty())
      .not()
      .isEmpty(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ];
};
const passwordChangeValidate = () => {
  return [
    check("old_password", "old password is required").not().isEmpty(),
    check("new_password", "new password is required").not().isEmpty(),
    check(
      "new_password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ];
};
module.exports = {
  registerValidate,
  loginValidate,
  passwordChangeValidate
};
