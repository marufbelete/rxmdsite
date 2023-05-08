const { authenticateJWT } = require("../middleware/auth.middleware");
const { getProduct } = require("../controllers/productController");
const { errorHandler } = require("../middleware/errohandling.middleware");
const { getAppointment } = require("../controllers/appointment.controller");
const { checkAppointmentLeft } = require("../middleware/role.middleware");
// module.exports = (app) => {
const path = require("path");
const { getUser } = require("../helper/user");
const router = require("express").Router();


router.get("/", function (req, res) {
  res.render(path.join(__dirname, "..", "/views/pages/index"));
});

router.get("/appt", authenticateJWT, checkAppointmentLeft, getAppointment, errorHandler);

router.get("/home", function (req, res) {
  res.render(path.join(__dirname, "..", "/views/pages/index"));
});

router.get("/about", function (req, res) {
  res.render(path.join(__dirname, "..", "/views/pages/about"));
});

router.get("/services", function (req, res) {
  res.render(path.join(__dirname, "..", "/views/pages/services"));
});

router.get("/contact", function (req, res) {
  res.render(path.join(__dirname, "..", "/views/pages/contact"));
});

router.get("/getstarted", function (req, res) {
  res.redirect("https://hipaa.jotform.com/212587273457161?token=<%=token%>");
});

router.get("/checkout", authenticateJWT, getProduct, errorHandler);

router.get("/forgotpw", function (req, res) {
  res.render(path.join(__dirname, "..", "/views/pages/forgotPassword"));
});

router.get("/login", function (req, res) {
  res.render(path.join(__dirname, "..", "/views/pages/login"));
});

router.get("/register", function (req, res) {
  res.render(path.join(__dirname, "..", "/views/pages/register"));
});

router.get("/resetpassword", function (req, res) {
  res.render(path.join(__dirname, "..", "/views/pages/resetpassword"));
});

router.get("/registered", function (req, res) {
  res.render(path.join(__dirname, "..", "/views/pages/registerSuccess"));
});

router.get("/privacypolicy", function (req, res) {
  res.render(path.join(__dirname, "..", "/views/pages/privacyPolicy"));
});

router.get("/tos", function (req, res) {
  res.render(path.join(__dirname, "..", "/views/pages/tos"));
});

router.get("/account",authenticateJWT ,function (req, res) {
  res.render(path.join(__dirname, "..", "/views/pages/account"));
});

router.get("/doctordashboard",authenticateJWT ,function (req, res) {
  res.render(path.join(__dirname, "..", "/views/pages/doctorDashboard"));
});

router.get("/affiliate",authenticateJWT, async function (req, res) {
    const user=await getUser(req?.user?.sub)
    console.log(user)
    console.log("affiliate hek")
  
    if(user?.affiliateLink){
      return res.render(path.join(__dirname, "..", "/views/pages/affiliateInfo"));
    }
     return res.render(path.join(__dirname, "..", "/views/pages/affiliate"));
});

//  UNUSED STORE ROUTES FOR USE LATER
// router.get("/shop", function (req, res) {
//   res.render(path.join(__dirname, "..", "/views/pages/shop"));
// });

// router.get("/cart", authenticateJWT,function (req, res) {
//   res.render(path.join(__dirname, "..", "/views/pages/shop-cart"));
// });

// router.get("/products/details", function (req, res) {
//   res.render(path.join(__dirname, "..", "/views/pages/shop-product-details"));
// });

router.get("*", function (req, res) {
  res.render(path.join(__dirname, "..", "/views/pages/404"))
})

//   app.use("/", router);
// };
module.exports = router;
