const express = require("express");
const router = express.Router();
const {
  createAppointmentSchedule,
  getApptPatientSchedule,
  createAppointment
} = require("../controllers/appointment.controller");
const { errorHandler } = require("../middleware/errohandling.middleware");
const { authenticateJWT } = require("../middleware/auth.middleware");
const { authAdmin, checkAppointmentLeft } = require("../middleware/role.middleware");
const {generateZoomLink}=require('../functions/zoom')
router.post(
  "/appointment",
  authenticateJWT,
  createAppointment,
  errorHandler
);
router.put(
  "/appointment",
  authenticateJWT,
  createAppointmentSchedule,
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
