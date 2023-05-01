const express = require("express");
const router = express.Router();
const {
  getAllMyPaymentInfo,
  paymentWebhook,
  createPaymentSubscription,
  createPay
} = require("../controllers/paymentInfoController");
const { errorHandler } = require("../middleware/errohandling.middleware");
const { authenticateJWT } = require("../middleware/auth.middleware");
const { authAdmin } = require("../middleware/role.middleware");

router.get("/getmypaymentmethod", authenticateJWT,getAllMyPaymentInfo, errorHandler);
router.post("/paymentwebhook",express.raw({type: "application/json"}), paymentWebhook, errorHandler);
router.post("/subscription", createPaymentSubscription, errorHandler);
router.post("/paypalpay", createPay, errorHandler);


module.exports = router;
