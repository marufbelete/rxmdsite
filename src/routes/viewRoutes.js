const { authenticateJWT } = require("../middleware/auth.middleware");
const { getProduct } = require("../controllers/productController");
const { errorHandler } = require("../middleware/errohandling.middleware");
const { getAppointment } = require("../controllers/appointment.controller");
const { Op } = require('sequelize')
// const { checkAppointmentLeft } = require("../middleware/role.middleware");
// module.exports = (app) => {
const path = require("path");
const { getUser, getProductType, getTreatmentType, appointmentUnpaidExist, getPlanType } = require("../helper/user");
const Appointment = require("../models/appointmentModel");
const { checkAppointmentLeft } = require("../middleware/role.middleware");
const router = require("express").Router();


router.get("/", async function (req, res) {
  const options = {
    order: [["product_name", "ASC"]],
  };
  const treatment = await getTreatmentType(options)
  const products = await getProductType(options)
  res.render(path.join(__dirname, "..", "/views/pages/index"), { treatment, products });
});

router.get("/appt", authenticateJWT,checkAppointmentLeft,getAppointment, errorHandler);

router.get("/home", async function (req, res) {
  const options = {
    order: [["product_name", "ASC"]],
  };
  const treatment = await getTreatmentType(options)
  const products = await getProductType(options)
  res.render(path.join(__dirname, "..", "/views/pages/index"), { treatment, products });
});

router.get("/about", function (req, res) {
  res.render(path.join(__dirname, "..", "/views/pages/about"));
});

router.get("/services", async function (req, res) {
  const options = {
    order: [["product_name", "ASC"]],
  };
  const treatment = await getTreatmentType(options)
  const products = await getProductType(options)
  res.render(path.join(__dirname, "..", "/views/pages/services"), { treatment, products });
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

router.get("/account", authenticateJWT, function (req, res) {
  res.render(path.join(__dirname, "..", "/views/pages/account"));
});

// router.get("/appointment-checkout", authenticateJWT, async function (req, res) {
//   const treatment = await Appointment.findOne({
//     where: {
//       paymentStatus: false,
//       patientId: req?.user?.sub,
//       doctorId: {
//         [Op.not]: null
//       }
//     }, include: ['product']
//   })
//   if (!treatment) return res.redirect('/checkout')
//   return res.render(path.join(__dirname, "..", "/views/pages/apptCheckout"), { service: treatment });
// });

// router.get("/doctordashboard", authenticateJWT, function (req, res) {
//   res.render(path.join(__dirname, "..", "/views/pages/doctorDashboard"));
// });

router.get("/affiliate", authenticateJWT, async function (req, res) {
  const user = await getUser(req?.user?.sub)
  if (user?.affiliateLink) {
    return res.render(path.join(__dirname, "..", "/views/pages/affiliateInfo"));
  }
  return res.render(path.join(__dirname, "..", "/views/pages/affiliate"));
});



router.get("/meal-plan", authenticateJWT, async function (req, res) {
  const user = await getUser(req?.user?.sub)
  if (!user.mealPlan) {
    return res.redirect('/price-plan')
  }
  res.render(path.join(__dirname, "..", "/views/pages/mealPlan"));
});

router.get("/fitness-plan", authenticateJWT, async function (req, res) {
  const user = await getUser(req?.user?.sub)
  if (!user.exercisePlan) {
    return res.redirect('/price-plan')
  }
  res.render(path.join(__dirname, "..", "/views/pages/fitnessPlan"));
});

router.get("/price-plan", authenticateJWT, async function (req, res) {
  const plans = await getPlanType({ where: { type: { [Op.or]: ["meal plan", "fitness plan"] } } })
  return res.render(path.join(__dirname, "..", "/views/pages/pricePlan"), { plans })
})


//  UNUSED STORE ROUTES FOR USE LATER
// router.get("/shop", function (req, res) {
//   res.render(path.join(__dirname, "..", "/views/pages/shop"));
// });

// router.get("/cart", authenticateJWT,function (req, res) {
//   res.render(path.join(__dirname, "..", "/views/pages/shop-cart"));
// });

// router.get("/datepicker", function (req, res) {
//   console.log("pick")
//   res.render(path.join(__dirname, "..", "/views/pages/datepiker"));
// });
//commented for production
// router.get("/mp", authenticateJWT, async function (req, res) {
//   const user = await getUser(req?.user?.sub)
//   if (!user.mealPlan) {
//     return res.redirect('/price-plan')
//   }
//  return res.render(path.join(__dirname, "..", "/views/pages/mealPlan"));
// });

// router.get("/fp", authenticateJWT,authenticateJWT, async function (req, res) {
//   const user = await getUser(req?.user?.sub)
//   if (!user.exercisePlan) {
//     return res.redirect('/price-plan')
//   }
//   return res.render(path.join(__dirname, "..", "/views/pages/fitnessPlan"));
// });

// router.get("/mymp", authenticateJWT, async function (req, res) {
//   return res.render(path.join(__dirname, "..", "/views/pages/myMealPlan"));
// });

// router.get("/myfp", authenticateJWT, async function (req, res) {
//   return res.render(path.join(__dirname, "..", "/views/pages/myFitnessPlan"));
// });

// router.get("/appointment", authenticateJWT, async function (req, res) {
//   const options = {
//     order: [["product_name", "ASC"]],
//   };
//   const unpaid_appt_exist = await appointmentUnpaidExist(req?.user?.sub)
//   if (!unpaid_appt_exist) {
//     return res.redirect('/checkout')
//   }
//   const product = await getProductType(options)
//   return res.render(path.join(__dirname, "..", "/views/pages/scheduleAppointment"),
//     { product, unpaid_appt_exist });
// });
//commented for production
router.get("*", function (req, res) {
  res.render(path.join(__dirname, "..", "/views/pages/404"))
})
//   app.use("/", router);
// };
module.exports = router;
