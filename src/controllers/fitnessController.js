const { handleError } = require("../helper/handleError");
const { getUser } = require("../helper/user");
const Fitness = require("../models/fitnessModel");
const { validationResult } = require("express-validator");

exports.addFitness = async (req, res, next) => {
  try {
   const user= await getUser(req?.user?.sub)
   if(!user.mealPlan){
    handleError("plase buy your meal plan first",403)
   }
    const fitness = new Fitness({
      ...req.body,
      userId:req?.user?.sub
    });
    const new_fitness = await fitness.save();
    return res.json(new_fitness);
  } catch (err) {
    next(err);
  }
};

exports.getFitness = async (req, res, next) => {
  try {
    const fitnesss = await Fitness.findAll();
    return res.json(fitnesss);
  } catch (err) {
    next(err);
  }
};
exports.getFitnessById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fitness = await Fitness.findByPk(id);
    return res.json(fitness);
  } catch (err) {
    next(err);
  }
};


