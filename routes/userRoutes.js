const express = require('express');
const bouncer =require("../helper/bruteprotect")
const router = express.Router();
const passport=require('passport')
const { registerValidate ,loginValidate} = require('../validator/user');
const {registerUser,loginUser,updateUserInfo,protected,
       confirmEmail,forgotPassword,resetPassword}=require('../controllers/userController')
const {errorHandler}=require('../middleware/errohandling.middleware')
const {authenticateJWT}=require('../middleware/auth.middleware');
const {issueGoogleToken}=require("../auth/google")

router.post('/register',registerValidate(),registerUser,errorHandler);
router.post('/login',loginValidate(),bouncer.block,loginUser,errorHandler);
router.put('/updateuser/:id',authenticateJWT,updateUserInfo,errorHandler);
router.get('/confirm',confirmEmail,errorHandler);
router.post('/forgotpassword',forgotPassword,errorHandler);
router.post('/resetpassword',resetPassword,errorHandler);


router.get("/auth/google", passport.authenticate("google", {session: false,scope: ["email","profile"] }));
//issue token on success
router.use("/auth/google/callback",
passport.authenticate("google", 
{
session: false,
failureRedirect: "http://localhost:3000/login",
}),issueGoogleToken,errorHandler);

// Define the /login route, which will be used to log the user in
//  router.get('/login', (req, res) => {
//   // Render the login page, which will show a login form
//   return res.render('../views/login.html');
// });

module.exports = router;