const Meal = require("../models/mealModel");
const { createCompletion } = require('../chatGPT/createCompletion');
const User = require("../models/userModel");
const { runJob } = require("../helper/cron_job");
const { getUser } = require("../helper/user");
const { createMealPlanPDF } = require("../helper/fill_pdf");
const moment = require("moment");
const cron = require('node-schedule');
const { sendMealPlanPdf } = require("../helper/send_email");
const { handleError } = require("../helper/handleError");

exports.addMeal = async (req, res, next) => {
  try {
    const user = await getUser(req?.user?.sub)
    // if (!user.mealPlan) {
    //   handleError("plase buy your meal plan first", 403)
    // }
    console.log(req.body)
    // con
    const meal = new Meal({
      ...req.body,
      userId: req?.user?.sub
    });
    await meal.save();
    await User.update({
      mealPlan: false
    }, {
      where: {
        id: req?.user?.sub
      }
    })
    const prompt = mealPrmopmt(req)
    const response = await createCompletion(prompt)
    const obj_response = JSON.parse(response)
    meal.gptResponse = response
    await meal.save()
    const pdf = await createMealPlanPDF(obj_response)
    sendMealPlanPdf(user.email, user.first_name, pdf).
      then(r => r).catch(e => console.log(e))
    // const jobTime=moment().add(1,'seconds')
    // console.log("reached")
    // cron.scheduleJob(new Date(), async()=>{
    //   try{
    //     console.log("running the job")
    //     await User.update({
    //       mealPlan:false
    //      },{where:{
    //        id:req?.user?.sub
    //      }})
    //     const prompt=mealPrmopmt()
    //     const response=await createCompletion(prompt)
    //     const obj_response=JSON.parse(response)
    //     meal.gptResponse=response
    //     await meal.save()
    //     createMealPlanPDF(obj_response)
    //     }
    //     catch(err){
    //       console.log(err)
    //     }
    //  })
    // runJob(jobTime, async()=>{

    //   }
    //  ,"one-time")
    // return res.json({ message: "success" });
  } catch (err) {
    console.log(err)
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


const mealPrmopmt = (req) => {
  const plan_format = [{
    day: 'Day 1',
    breakfast: [
      { meal: 'meal name', servings: 'meal amount' },
      { meal: 'meal name', servings: 'meal amount' },
    ],
    lunch: [
      { meal: 'meal name', servings: 'meal amount' },
      { meal: 'meal name', servings: 'meal amount' },
    ],
    snack: [
      { meal: 'meal name', servings: 'meal amount' },
      { meal: 'meal name', servings: 'meal amount' },
    ],
    dinner: [
      { meal: 'meal name', servings: 'meal amount' },
      { meal: 'meal name', servings: 'meal amount' },
    ],
  },
  ]
  let prompt = "As a meal planner, I need your help to create a 1-day meal plan in JSON for a ";
  if (req.body.gender) prompt += `${req.body.gender.toLowerCase()} `;
  if (req.body.age) prompt += `client who is ${req.body.age} years old, `;
  if (req.body.height) prompt += `is ${req.body.height} inch tall, `;
  if (req.body.weight) prompt += `weight ${req.body.weight}lbs, `;
  if (req.body.targetWeight) prompt += `target weight ${req.body.targetWeight}lbs, `;
  if (req.body.activityLevel) prompt += `activity level of ${req.body.activityLevel}, `;
  if (req.body.mealPreference) prompt += `meal preference of ${req.body.mealPreference}, `;
  if (req.body.allergies) prompt += `have allergies with ${req.body.allergies}, `;
  if (req.body.dietaryRestrictions) prompt += `with diatary restriction ${req.body.dietaryRestrictions.toLowerCase()} `;
  if (req.body.vegetarianProtienSource) prompt += `vegetarian protient source ${req.body.vegetarianProtienSource.toLowerCase()} `;
  if (req.body.veganProtienSource) prompt += `vegan protient source ${req.body.veganProtienSource.toLowerCase()} `;
  if (req.body.preferredCuisine) prompt += `preferred cuisine ${req.body.preferredCuisine.toLowerCase()} `;
  if (req.body.medicalConditions) prompt += `medical condition ${req.body.medicalConditions.toLowerCase()} `;
  
  
  // if (req.body.fitnessGoal) prompt += `has a fitness goal of ${req.body.fitnessGoal.toLowerCase()}, `;
  // if (req.body.workoutPreference) prompt += `prefers the following workouts ${req.body.workoutPreference.toLowerCase()}`;
  // if (req.body.exerciseLimitation) prompt += `has the following limitations ${req.body.exerciseLimitation}, `;
  // if (req.body.workoutFrequency) prompt += `works out ${req.body.workoutFrequency.toLowerCase()} times a week, `;
  // if (req.body.workoutDuration) prompt += `for ${req.body.workoutDuration.toLowerCase()} hour each time, `;
  // if (req.body.availableEquipment) prompt += `has access to ${req.body.availableEquipment}, equipment`;
  // if (req.body.restAndRecovery) prompt += `practices ${req.body.restAndRecovery} for rest and recovery, `;
  // if (req.body.healthCondition) prompt += `has the following health condietions ${req.body.healthCondition}`;
  // if (req.body.currentMedication) prompt += `is currently taking ${req.body.currentMedication}, `;
  prompt += "Please provide the meal plan in JSON format, including breakfast, lunch, snack, and dinner for each day. Make sure to include the name of the meal and serving size. Return the JSON in this format: " + JSON.stringify(plan_format);
  console.log(prompt)
  return prompt
  //  `As a meal planner, I need your help to create a 1-day meal plan in JSON for
  // a male client who is 25 years old, 1.67m tall, weighs 55kg, has a beginner fitness level,
  // works out 3 days a week for 2 hours each time, and has good health.
  //  Please provide the meal plan in JSON format, including breakfast, lunch, snack, and dinner
  //  for each day. Make sure to include the name of the meal and serving size. return the json in this format ${JSON.stringify(plan_format)} `
}


// create funtion that convert json to object
// exports.getMealPlanFromGPT = async (req, res, next) => {
//   try {

//     const fitness = await createCompletion();
//     return res.json(fitness);
//   } catch (err) {
//     next(err);
//   }
// };
