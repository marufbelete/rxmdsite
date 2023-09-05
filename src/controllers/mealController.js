// const Meal = require("../models/mealModel");
const { createCompletion } = require('../chatGPT/createCompletion');
const User = require("../models/userModel");
const { runJob } = require("../helper/cron_job");
const { getUser } = require("../helper/user");
const { createMealPlanPDF } = require("../helper/fill_pdf");
const moment = require("moment");
const cron = require('node-schedule');
const { sendMealPlanPdf } = require("../helper/send_email");
const { handleError } = require("../helper/handleError");

async function parseMealPlan(prompt) {
  let str = await createCompletion(prompt);
  let strWithoutNumber = str.replace(/\d+/g, '');
  let days = strWithoutNumber.split(';').filter(Boolean);
     while(days.length<29){
        str = await createCompletion(prompt)
        strWithoutNumber = str.replace(/\d+/g, '');
        let otherdays = strWithoutNumber.split(';').filter(Boolean);
        days=[...days,...otherdays]
  }
  const plan_format = [];
  console.log(days)

  for (let index = 0; index < days.length; index++) {
    // meal = meal.map((str) => str.);
    const day = days[index].replace(/^[,.\s]+/, '');
    const meals = day.split(',');
    const dayObj = {
      day: `Day ${index + 1}`,
    };

    for (let meal of meals) {
      console.log(meal)
      const [mealType, mealDescription] = meal.split(':');
      if (mealDescription) {
        const prompt = `please create a detailed recipe for ${mealDescription}, including prep time and cook time, ingredient list with amounts, calorie information, and cooking instructions each separated by ; with under 200 words.`;
        let description = await createCompletion(prompt);
        console.log(mealType,meal)
        console.log(description.split(';'))
        let mapped_description=description.split(';').filter(e=>e.trim()!==meal.split(':')[1].trim())

        dayObj[mealType.replace(/[^a-zA-Z]/g, '')] = {
          meal: mealDescription,
          description: mapped_description,
        };
      }
    }
    plan_format.push(dayObj);
  }
  console.log(plan_format)

  return plan_format;
}

exports.addMeal = async (req, res, next) => {
  try {
    const user = await getUser(req?.user?.sub)
    if (!user.mealPlan) {
      handleError("plase buy your meal plan first", 403)
    }
    await User.update({
      mealPlan: false
    }, {
      where: {
        id: req?.user?.sub
      }
    })
    res.json({ message: "success" });
    const prompt = mealPrmopmt(req)
    let parsed_obj=await parseMealPlan(prompt)
    const pdf = await createMealPlanPDF(parsed_obj)
    sendMealPlanPdf(user.email, user.first_name, pdf).
      then(r => r).catch(e => console.log(e))

    
    return 
  } catch (err) {
    console.log(err)
    await User.update({
      mealPlan: true
    }, {
      where: {
        id: req?.user?.sub
      }
    })
    next(err);
  }
};

const mealPrmopmt = (req) => {
  let prompt = "Given the following information,"
  if (req.body?.gender) prompt += `${req.body?.gender.toLowerCase()} `;
  if (req.body?.age) prompt += `client who is ${req.body?.age} years old, `;
  if (req.body?.heightFeet) prompt += `is ${req.body?.heightFeet} feet and '${req?.body?.heightInches||1}" inches tall, `;
  if (req.body?.weight) prompt += `weight ${req.body?.weight}lbs, `;
  if (req.body?.targetWeight) prompt += `target weight ${req.body?.targetWeight}lbs, `;
  if (req.body?.activityLevel) prompt += `activity level of ${req.body?.activityLevel}, `;
  if (req.body?.mealPreference) prompt += `meal preference of ${req.body?.mealPreference}, `;
  if (req.body?.allergies) prompt += `have allergies with ${req.body?.allergies}, `;
  if (req.body?.dietaryRestrictions) prompt += `with diatary restriction ${req.body?.dietaryRestrictions.toLowerCase()}, `;
  if (req.body?.vegetarianProtienSource) prompt += `vegetarian protient source ${req.body?.vegetarianProtienSource.toLowerCase()}, `;
  if (req.body?.veganProtienSource) prompt += `vegan protient source ${req.body?.veganProtienSource.toLowerCase()}, `;
  if (req.body?.preferredCuisine) prompt += `preferred cuisine ${req.body?.preferredCuisine.toLowerCase()}, `;
  if (req.body?.medicalConditions) prompt += `medical condition ${req.body?.medicalConditions.toLowerCase()}, `;

  prompt +="please create a list of 10 days breakfast, lunch, and dinner meals. The structure should look like 1, breakfast:Bacon & eggs,lunch:Veg Quesadilla,dinner:Tofu Stir-Fry; Each set of breakfast, lunch, and dinner meals should be on one line, comma-separated."
  return prompt

}
// exports.getMeal = async (req, res, next) => {
//   try {
//     const meals = await Meal.findAll();
//     return res.json(meals);
//   } catch (err) {
//     next(err);
//   }
// };
// exports.getMealById = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const meal = await Meal.findByPk(id);
//     return res.json(meal);
//   } catch (err) {
//     next(err);
//   }
// };



