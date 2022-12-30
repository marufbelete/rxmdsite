const { check, body } = require("express-validator");

const registerValidate = () => {
  return [
    check("first_name", "first name is required").not().isEmpty(),
    check("last_name", "last name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 8 or more characters"
    ).isLength({ min: 6 }),
  ];
};

const loginValidate = () => {
  return [
    check("login_email", "username or email is required").not().isEmpty(),
    check("login_password", "Please enter a password").not().isEmpty(),
  ];
};
const passwordChangeValidate = () => {
  return [
    check("old_password", "old password is required").not().isEmpty(),
    check("new_password", "new password is required").not().isEmpty(),
    check(
      "new_password",
      "Please enter a password with 8 or more characters"
    ).isLength({ min: 6 }),
  ];
};
const contactFormValidate = () => {
  return [
    check("email", "email is required").not().isEmpty(),
    check("subject", "subject is required").not().isEmpty(),
    check("message", "message is required").not().isEmpty(),
  ];
};
module.exports = {
  registerValidate,
  loginValidate,
  passwordChangeValidate,
  contactFormValidate,
};
