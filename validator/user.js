const { check,body} = require('express-validator');

 const registerValidate = () => {
    return [
        check('name', 'name is required').not().isEmpty(),
        check('username', 'Username is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password','Please enter a password with 6 or more characters').isLength({ min: 6 }),
      ]
  }
  const loginValidate = () => {
    return [
        check('username', 'username or email is required').if(body('email').isEmpty()).not().isEmpty(),
        check('email', 'username or email is required').if(body('username').isEmpty()).not().isEmpty(),
        check('password','Please enter a password with 6 or more characters').isLength({ min: 6 }),
      ]
  }
  // body('oldPassword')
  // // if the new password is provided...
  // .if((value, { req }) => req.body.newPassword)
  // // OR
  // .if(body('newPassword').exists())
  // // ...then the old password must be too...
  // .notEmpty()
  module.exports={
    registerValidate,
    loginValidate
  }