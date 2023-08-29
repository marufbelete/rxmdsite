const { handleError } = require("../helper/handleError");
const { getUser } = require("../helper/user");
const Fitness = require("../models/fitnessModel");
const { createCompletion } = require('../chatGPT/createCompletion');
const User = require("../models/userModel");
const { createFitnessPlanPDF } = require("../helper/fill_pdf");
const { sendFitnessPlanPdf } = require("../helper/send_email");

async function parseFitnessPlan(prompt) {
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
  
  for (let index = 0; index < days.length; index++) {
    const fitness =days[index].replace(/[.]/g, "").trim()
    const dayObj = {
            day: `Day ${index + 1}`,
            fitness: fitness
          };
          const prompt = `please create a detailed instructions steps for ${fitness} each step seprated by ; like this 1. Put on a comfortable pair of running shoes;2. Set a timer for the desired amount of minutes. With under 200 words.`
                  const description = await createCompletion(prompt)
                  dayObj['description'] = description.split(';');
                  plan_format.push(dayObj);
  }
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
    let parsed_obj=await parseFitnessPlan(prompt)
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
  if (req.body.availableEquipment) prompt += `has access to ${req.body.availableEquipment} equipment `;
  if (!req.body.availableEquipment) prompt += `has no access of equipment`;
  if (req.body.restAndRecovery) prompt += `practices ${req.body.restAndRecovery} for rest and recovery, `;
  if (req.body.healthCondition) prompt += `has the following health connditions ${req.body.healthCondition}`;
  if (req.body.currentMedication) prompt += `is currently taking the following medications or substances ${req.body.currentMedication}, `;
  
  prompt +="please create a list of 10 days fitness plan. The structure should look like 1, skipping rope; each day semicolon -separated with rest day added according to the given information."
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