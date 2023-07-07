const express = require("express");
const router = express.Router();
const {
  getAllMyPaymentInfo,
  paymentWebhook,
  getAffiliateTotalAmount,
  paypalWebhookVerify
} = require("../controllers/paymentInfoController");
const { errorHandler } = require("../middleware/errohandling.middleware");
const { authenticateJWT } = require("../middleware/auth.middleware");
const { authAdmin } = require("../middleware/role.middleware");

router.get("/getmypaymentmethod", authenticateJWT,getAllMyPaymentInfo, errorHandler);
router.post("/paymentwebhook",express.raw({type: "application/json"}), paymentWebhook, errorHandler);
router.post("/paypalsubscription", paypalWebhookVerify, errorHandler);
router.get("/affiliate/amount",authenticateJWT, getAffiliateTotalAmount, errorHandler);


module.exports = router;
