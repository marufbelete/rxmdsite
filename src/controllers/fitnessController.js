const { handleError } = require("../helper/handleError");
const { getUser } = require("../helper/user");
const Fitness = require("../models/fitnessModel");
const { createCompletion } = require('../chatGPT/createCompletion');
const User = require("../models/userModel");
const { createFitnessPlanPDF } = require("../helper/fill_pdf");
const { sendFitnessPlanPdf } = require("../helper/send_email");

async function parseFitnessPlan(str) {
  const strWithoutNumber = str.replace(/\d+/g, '');
  const days = strWithoutNumber.split(';').filter(Boolean);
  const plan_format = await Promise.all(days.map(async (fitness, index) => {
    const dayObj = {
      day: `Day ${index + 1}`,
      fitness: fitness
    };
        const prompt = `please create a detailed instructions for ${fitness},with under 200 words.`
        const description = await createCompletion(prompt)
        dayObj['description'] = description;
        return dayObj;
  }));

  return plan_format;
}

exports.addFitness = async (req, res, next) => {
  try {
    const user = await getUser(req?.user?.sub)
    if (!user.exercisePlan) {
      handleError("plase buy your fitness plan first", 403)
    }
    const fitness = new Fitness({
      ...req.body,
      userId: req?.user?.sub
    });
    res.json({ message: "success" });
    const prompt = fitnessPrmopmt(req)
    const response = await createCompletion(prompt)
    let parsed_obj=await parseFitnessPlan(response)
    const pdf = await createFitnessPlanPDF(parsed_obj)
    sendFitnessPlanPdf(user.email, user.first_name, pdf).
      then(r => r).catch(e => e)
    await fitness.save();
    await User.update({
      exercisePlan: false
    }, {
      where: {
        id: req?.user?.sub
      }
    })
    return
  } catch (err) {
    console.log(err)
    next(err);
  }
};

const fitnessPrmopmt = (req) => {
  let prompt = "Given the following information,";
  if (req.body.gender) prompt += `${req.body.gender.toLowerCase()} `;
  if (req.body.age) prompt += `client who is ${req.body.age} years old, `;
  if (req.body.heightFeet && req.body.heightInches) prompt += `is ${req.body.heightFeet} feet and '${req.body.heightInches}" inches tall, `;
  if (req.body.bodyWeight) prompt += `weighs ${req.body.bodyWeight} lbs, `;
  if (req.body.fitnessLevel) prompt += `has a ${req.body.fitnessLevel.toLowerCase()} fitness level, `;
  if (req.body.fitnessGoal) prompt += `has a fitness goal of ${req.body.fitnessGoal.toLowerCase()}, `;
  if (req.body.workoutPreference) prompt += `prefers ${req.body.workoutPreference.toLowerCase()} workouts, `;
  if (req.body.exerciseLimitation) prompt += `has ${req.body.exerciseLimitation}, `;
  if (req.body.workoutFrequency) prompt += `works out ${req.body.workoutFrequency||4} times a week, `;
  if (req.body.workoutDuration) prompt += `for ${req.body.workoutDuration} hour each time, `;
  if (req.body.availableEquipment) prompt += `has access to the following equipment ${req.body.availableEquipment}`;
  if (req.body.restAndRecovery) prompt += `practices ${req.body.restAndRecovery} for rest and recovery, `;
  if (req.body.healthCondition) prompt += `has the following health connditions ${req.body.healthCondition}`;
  if (req.body.currentMedication) prompt += `is currently taking the following medications or substances ${req.body.currentMedication}, `;
  
  prompt +="please create a list of 30-fitness plan. The structure should look like 1, skipping rope; each day semicolon -separated with rest day added according to the given information."
  return prompt
}




// exports.getFitness = async (req, res, next) => {
//   try {
//     const fitnesss = await Fitness.findAll();
//     return res.json(fitnesss);
//   } catch (err) {
//     next(err);
//   }
// };
// exports.getFitnessById = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const fitness = await Fitness.findByPk(id);
//     return res.json(fitness);
//   } catch (err) {
//     next(err);
//   }
// };