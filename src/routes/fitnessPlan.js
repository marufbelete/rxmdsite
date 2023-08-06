const express = require("express");
const router = express.Router();
const {
addFitness,
getFitness,
getFitnessById
} = require("../controllers/fitnessController");
const { errorHandler } = require("../middleware/errohandling.middleware");
const { authenticateJWT } = require("../middleware/auth.middleware");
router.post(
  "/fitnessplan",
  authenticateJWT,
  addFitness,
  errorHandler
);
// router.get(
//   "/fitnessplan",
//   authenticateJWT,
//   getFitness,
//   errorHandler
// );
// router.get(
//   "/fitnessplan/:id",
//   authenticateJWT,
//   getFitnessById,
//   errorHandler
// );
module.exports = router;
