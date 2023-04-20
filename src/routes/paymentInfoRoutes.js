const express = require("express");
const router = express.Router();
const {
  getAllMyPaymentInfo
} = require("../controllers/paymentInfoController");
const { errorHandler } = require("../middleware/errohandling.middleware");
const { authenticateJWT } = require("../middleware/auth.middleware");
const { authAdmin } = require("../middleware/role.middleware");

router.get("/getmypaymentmethod", authenticateJWT,getAllMyPaymentInfo, errorHandler);


module.exports = router;
