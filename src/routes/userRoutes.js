const express = require("express");
const bouncer = require("../helper/bruteprotect");
const router = express.Router();
const passport = require("passport");
const {
  registerValidate,
  loginValidate,
  passwordChangeValidate,
  contactFormValidate,
} = require("../validator/user");
const {
  registerUser,
  loginUser,
  updateUserInfo,
  jotformWebhook,
  getCurrentLoggedUser,
  getUserById,
  getUsers,
  confirmEmail,
  changePassword,
  forgotPassword,
  resetPassword,
  logOut,
  checkAuth,
  contactFormEmail,
  adminDashboard,
  getUserByStatus,
  updateUserState,
  getAffilateCode,
  getOtp,
  confirmOtp,
  getUserAffiliateDetail,
  getAvailableProvider,
  getProviderSchedule
} = require("../controllers/userController");
// const {appointmentCreatedWebhook}=require("../controllers/appointment.controller")
const { errorHandler } = require("../middleware/errohandling.middleware");
const { authenticateJWT } = require("../middleware/auth.middleware");
const { issueGoogleToken } = require("../auth/google");
const { authAdmin } = require("../middleware/role.middleware");
const multer = require("multer");
const multipart = multer();

router.post("/register", registerValidate(), registerUser, errorHandler);
router.post("/login", loginValidate(), bouncer.block, loginUser, errorHandler);
router.put("/updateuser/:id", authenticateJWT, updateUserInfo, errorHandler);
router.put("/updateuserstate/:id", authenticateJWT, updateUserState, errorHandler);
router.put("/changemypassword/", authenticateJWT,bouncer.block, passwordChangeValidate(), changePassword, errorHandler);
router.get("/confirm", confirmEmail, errorHandler);
router.get("/otp",authenticateJWT, getOtp, errorHandler);
router.post("/otp",authenticateJWT, confirmOtp, errorHandler);
router.get("/affiliate/detail",authenticateJWT, getUserAffiliateDetail, errorHandler);
router.post("/forgotpassword", forgotPassword, errorHandler);
router.post("/resetpassword", resetPassword, errorHandler);
router.get("/getusers", authenticateJWT, authAdmin, getUsers, errorHandler);
router.get("/getuserbyid/:id", authenticateJWT, authAdmin, getUserById, errorHandler);
router.get("/getuserbystate", authenticateJWT, authAdmin, getUserByStatus, errorHandler);
router.get("/getloggeduser", authenticateJWT, getCurrentLoggedUser, errorHandler);
router.get("/checkauth", checkAuth, errorHandler);
router.get("/logout", logOut, errorHandler);
router.get("/affiliatecode", authenticateJWT,getAffilateCode, errorHandler);
router.get("/provider/available", getAvailableProvider, errorHandler);
router.get("/provider/schedule/:providerId", getProviderSchedule, errorHandler);
router.post("/contactform", contactFormValidate(), contactFormEmail, errorHandler);
router.post("/jotformwebhook", multipart.array(), jotformWebhook, errorHandler);
// router.post("/vcitawebhook", appointmentCreatedWebhook, errorHandler);
router.get("/dashboard", authenticateJWT, authAdmin, adminDashboard, errorHandler);
//google auth
router.get("/auth/google",
  passport.authenticate("google", {
    session: false,
    scope: ["email", "profile"],
  })
);

//issue token on success
router.use("/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.BASE_URL}/login`,
  }),
  issueGoogleToken,
  errorHandler
);

module.exports = router;
