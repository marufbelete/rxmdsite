const express = require('express');
const bouncer =require("../helper/bruteprotect")
const router = express.Router();
const passport=require('passport')
const { registerValidate ,loginValidate,passwordChangeValidate} = require('../validator/user');
const {registerUser,loginUser,updateUserInfo,getCurrentLogedUser,
       getUserById,getUsers,confirmEmail,changePassword,
       forgotPassword,resetPassword}=require('../controllers/userController')
const {errorHandler}=require('../middleware/errohandling.middleware')
const {authenticateJWT}=require('../middleware/auth.middleware');
const {issueGoogleToken}=require("../auth/google");
const { authAdmin } = require('../middleware/role.middleware');

// bouncer.blocked = function (req, res, next, remaining)
// {
//     return res.status(429).
//     json ({message:`You have end you login attempt, please wait ${Math.round((remaining / 60000))} minutes`});
// };

router.post('/register',registerValidate(),registerUser,errorHandler);
router.post('/login',loginValidate(),bouncer.block,loginUser,errorHandler);
router.put('/updateuser/:id',authenticateJWT,updateUserInfo,errorHandler);
router.put('/changemypassword/',authenticateJWT,passwordChangeValidate(),changePassword,errorHandler);
router.get('/confirm',confirmEmail,errorHandler);
router.post('/forgotpassword',forgotPassword,errorHandler);
router.post('/resetpassword',resetPassword,errorHandler);
router.get('/getusers',authenticateJWT,authAdmin,getUsers,errorHandler);
router.get('/getuserbyid/:id',authenticateJWT,authAdmin,getUserById,errorHandler);
router.get('/getlogeduser',authenticateJWT,getCurrentLogedUser,errorHandler);

//google auth
router.get("/auth/google", passport.authenticate("google", {session: false,scope: ["email","profile"] }));
//issue token on success
router.use("/auth/google/callback",
passport.authenticate("google", 
{
session: false,
failureRedirect: "http://localhost:3000/login",
}),issueGoogleToken,errorHandler);


module.exports = router;