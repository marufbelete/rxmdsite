const { getUser } = require("../helper/user");
const Meal = require("../models/mealModel");
const { validationResult } = require("express-validator");

exports.addMeal = async (req, res, next) => {
  try {
    if(!user.exercisePlan){
      handleError("plase buy your fitness plan first",403)
     }
    const meal = new Meal({
      ...req.body,
      userId:req?.user?.sub
    });
    const new_meal = await meal.save();
    return res.json(new_meal);
  } catch (err) {
    next(err);
  }
};

exports.getMeal = async (req, res, next) => {
  try {
    const meals = await Meal.findAll();
    return res.json(meals);
  } catch (err) {
    next(err);
  }
};
exports.getMealById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const meal = await Meal.findByPk(id);
    return res.json(meal);
  } catch (err) {
    next(err);
  }
};
