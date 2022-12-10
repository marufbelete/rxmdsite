const express = require('express');
const router = express.Router();
const { registerValidate ,loginValidate} = require('../validator/user');
const {registerUser,loginUser,protected}=require('../controllers/userController')
const {errorHandler}=require('../middleware/errohandling.middleware')
const {authenticateJWT}=require('../middleware/auth.middleware')

router.post('/register',registerValidate(),registerUser,errorHandler);
router.post('/login',loginValidate(),loginUser,errorHandler);
router.post('/protected',authenticateJWT,protected,errorHandler)

module.exports = router;
