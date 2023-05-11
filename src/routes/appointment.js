const express = require("express");
const router = express.Router();
const {
  updateAppointmentSchedule,
  getApptPatientSchedule
} = require("../controllers/appointment.controller");
const { errorHandler } = require("../middleware/errohandling.middleware");
const { authenticateJWT } = require("../middleware/auth.middleware");
const { authAdmin, checkAppointmentLeft } = require("../middleware/role.middleware");
const {generateZoomLink}=require('../functions/zoom')
router.put(
  "/appointment",
  authenticateJWT,
  checkAppointmentLeft,
  updateAppointmentSchedule,
  errorHandler
);
router.get(
  "/zoom",
  generateZoomLink,
  errorHandler
);
router.get(
  "/appointment/detail",
  authenticateJWT,
  getApptPatientSchedule,
  errorHandler
);

module.exports = router;
