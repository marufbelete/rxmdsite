const { check} = require("express-validator");

const paymentValidate = () => {
  return [check("payment_method", "payment method is required").not().isEmpty()];
};
module.exports = {
 paymentValidate
};
