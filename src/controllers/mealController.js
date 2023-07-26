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
    console.log(response)

    // const obj_response = JSON.parse(response)
    // meal.gptResponse = response
    // await meal.save()
    const pdf = await createMealPlanPDF(obj_response)
    // sendMealPlanPdf(user.email, user.first_name, pdf).
    //   then(r => r).catch(e => console.log(e))
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
  // const plan_format = [{
  //   day: 'Day 1',
  //   breakfast: 
  //     { meal: 'meal name',
        //  description: 'meal amount' },

  //   ,
  //   lunch: [
  //     { meal: 'meal name', servings: 'meal amount' },
  //     { meal: 'meal name', servings: 'meal amount' },
  //   ],
  //   snack: [
  //     { meal: 'meal name', servings: 'meal amount' },
  //     { meal: 'meal name', servings: 'meal amount' },
  //   ],
  //   dinner: [
  //     { meal: 'meal name', servings: 'meal amount' },
  //     { meal: 'meal name', servings: 'meal amount' },
  //   ],
  // },
  // ]

  let prompt = "Given the following information,"
  if (req.body.gender) prompt += `${req.body.gender.toLowerCase()} `;
  if (req.body.age) prompt += `client who is ${req.body.age} years old, `;
  if (req.body.height) prompt += `is ${req.body.height} inch tall, `;
  if (req.body.weight) prompt += `weight ${req.body.weight}lbs, `;
  if (req.body.targetWeight) prompt += `target weight ${req.body.targetWeight}lbs, `;
  if (req.body.activityLevel) prompt += `activity level of ${req.body.activityLevel}, `;
  if (req.body.mealPreference) prompt += `meal preference of ${req.body.mealPreference}, `;
  if (req.body.allergies) prompt += `have allergies with ${req.body.allergies}, `;
  if (req.body.dietaryRestrictions) prompt += `with diatary restriction ${req.body.dietaryRestrictions.toLowerCase()}, `;
  if (req.body.vegetarianProtienSource) prompt += `vegetarian protient source ${req.body.vegetarianProtienSource.toLowerCase()}, `;
  if (req.body.veganProtienSource) prompt += `vegan protient source ${req.body.veganProtienSource.toLowerCase()}, `;
  if (req.body.preferredCuisine) prompt += `preferred cuisine ${req.body.preferredCuisine.toLowerCase()}, `;
  if (req.body.medicalConditions) prompt += `medical condition ${req.body.medicalConditions.toLowerCase()}, `;

  prompt +="please create a list of 30-day breakfast, lunch, and dinner meals. The structure should look like 1:breakfast:Bacon & eggs,lunch:Veg Quesadilla,dinner:Tofu Stir-Fry; Each set of breakfast, lunch, and dinner meals should be on one line, comma-separated."
  console.log(prompt)
  return prompt

}

// Given the following information, a male client who is 25 years old, is 12 inches tall, weighs 210 lbs, has a target weight of 149 lbs, an activity level of sedentary, a meal preference of balanced, with dietary restriction vegetarian, and prefers American cuisine, 
// "please create a list of 30-day breakfast, lunch, and dinner meals. The structure should look like 1:breakfast:Bacon & eggs,lunch:Veg Quesadilla,dinner:Tofu Stir-Fry; and the meal names should be abbreviated as much as possible, using ampersands for any and's and shorter food names where possible. Each set of breakfast, lunch, and dinner meals should be on one line, comma-separated"
