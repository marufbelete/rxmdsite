const express = require('express');
const bouncer = require("../helper/bruteprotect")
const router = express.Router();
const passport = require('passport')
const { registerValidate, loginValidate, passwordChangeValidate,contactFormValidate } = require('../validator/user');
const { registerUser, loginUser, updateUserInfo,
       getCurrentLoggedUser,getUserById, getUsers, confirmEmail, changePassword,
       forgotPassword, resetPassword, logOut, checkAuth, contactFormEmail } = require('../controllers/userController')
const { errorHandler } = require('../middleware/errohandling.middleware')
const { authenticateJWT } = require('../middleware/auth.middleware');
const { issueGoogleToken } = require("../auth/google");
const { authAdmin } = require('../middleware/role.middleware');

router.post('/register', registerValidate(), registerUser, errorHandler);
router.post('/login', loginValidate(), bouncer.block, loginUser, errorHandler);
router.put('/updateuser/:id', authenticateJWT, updateUserInfo, errorHandler);
router.put('/changemypassword/', authenticateJWT, passwordChangeValidate(),
 changePassword, errorHandler);
router.get('/confirm', confirmEmail, errorHandler);
router.post('/forgotpassword', forgotPassword, errorHandler);
router.post('/resetpassword', resetPassword, errorHandler);
router.get('/getusers', authenticateJWT, authAdmin, getUsers, errorHandler);
router.get('/getuserbyid/:id', authenticateJWT, authAdmin, getUserById, errorHandler);
router.get('/getloggeduser', authenticateJWT, getCurrentLoggedUser, errorHandler);
router.get('/checkauth',checkAuth,errorHandler)
router.get('/logout',logOut, errorHandler);
router.post('/contactform',contactFormValidate(),contactFormEmail, errorHandler);
//google auth
router.get("/auth/google", passport.authenticate("google", { session: false, scope: ["email", "profile"] }));
//issue token on success
router.use("/auth/google/callback",
       passport.authenticate("google",
              {
                     session: false,
                     failureRedirect: "http://localhost:7000/login",
              }), issueGoogleToken, errorHandler);

module.exports = router;
