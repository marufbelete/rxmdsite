const express = require('express');
const router = express.Router();
const { registerValidate ,loginValidate} = require('../validator/user');
const {registerUser,loginUser,protected}=require('../controllers/userController')
const {errorHandler}=require('../middleware/errohandling.middleware')
const {authenticateJWT}=require('../middleware/auth.middleware')

router.post('/register',registerValidate(),registerUser,errorHandler);
router.post('/login',loginValidate(),loginUser,errorHandler);
router.post('/protected',authenticateJWT,protected,errorHandler)

// router.get('/auth/google', passport.authenticate('google', {
//   scope: ['profile'] // Request access to the user's profile
// }));

// // The /auth/google/callback route, which will be called by Google after the user grants permission
// router.get('/auth/google/callback', passport.authenticate('google', {
//   successRedirect: '/', // Redirect to the main page after successful authentication
//   failureRedirect: '/login' // Redirect to the /login route after failed authentication
// }));

// Define the /login route, which will be used to log the user in
router.get('/login', (req, res) => {
  // Render the login page, which will show a login form
  res.render('../views/login.html');
});

module.exports = router;
