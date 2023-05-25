const express = require("express");
const router = express.Router();
const {
addMeal,
getMeal,
getMealById
} = require("../controllers/mealController");
const { errorHandler } = require("../middleware/errohandling.middleware");
const { authenticateJWT } = require("../middleware/auth.middleware");
router.post(
  "/mealplan",
  authenticateJWT,
  addMeal,
  errorHandler
);
router.get(
  "/mealplan",
  authenticateJWT,
  getMeal,
  errorHandler
);
router.get(
  "/mealplan/:id",
  authenticateJWT,
  getMealById,
  errorHandler
);
module.exports = router;
