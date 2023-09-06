const { handleError } = require("../helper/handleError");
const { getUser } = require("../helper/user");
// const Fitness = require("../models/fitnessModel");
const { createCompletion } = require('../chatGPT/createCompletion');
const User = require("../models/userModel");
const { createFitnessPlanPDF } = require("../helper/fill_pdf");
const { sendFitnessPlanPdf } = require("../helper/send_email");

async function parseFitnessPlan(prompt) {
  let str = await createCompletion(prompt);
  let strFitness = str.split(';');
  strFitness = strFitness.map((str) => {
    const parts = str.split(':');
    if (parts.length > 1) {
      return parts[1].trim();
    }
    return str; 
  });
  // let days = strWithoutNumber.split(';').filter(Boolean);
     while(strFitness.length<20){
      let str = await createCompletion(prompt);
      let otherStrFitness = str.split(';');
      otherStrFitness = otherStrFitness.map((str) => {
        const parts = str.split(':');
        if (parts.length > 1) {
          return parts[1].trim();
        }
        return str; 
      });
        strFitness=[...strFitness,...otherStrFitness]
  }
  const plan_format = [];
  let restDay="rest"
  strFitness.splice(3, 0, restDay);
  strFitness.splice(7, 0, restDay);
  strFitness.splice(10, 0, restDay);
  strFitness.splice(13, 0, restDay);
  strFitness.splice(16, 0, restDay);
  strFitness.splice(19, 0, restDay);
  strFitness.splice(23, 0, restDay);
  strFitness.splice(26, 0, restDay);
  strFitness.splice(30, 0, restDay);
  
  for (let index = 0; index < strFitness.length; index++) {
    const fitnesses =strFitness[index].split(',')
    const dayObj = {
            day: `Day ${index + 1}`
          };
          const  descriptions= [];
          if(strFitness[index]==restDay){
            descriptions.push(["Rest Day"])
            dayObj['description'] = descriptions;
            plan_format.push(dayObj);
            continue
          }
          for(let fitness of fitnesses){
            const prompt = `please create a detailed instructions steps for ${fitness} each step must seprated by ; like this 1. Stand with your feet shoulder-width apart, toes pointing slightly outward; 2.Engage your core by pulling your belly button in towards your spine; With under 300 words.`
            const description = await createCompletion(prompt)
            let description_parsed = description.split(';');
            description_parsed.unshift("Steps:");
            description_parsed.unshift(`Exercise: ${fitness}`);
            description_parsed.push(' ');
            // console.log(description_parsed);
            descriptions.push(description_parsed)

          }

          dayObj['description'] = descriptions;
          plan_format.push(dayObj);
  }
  return plan_format;
}

exports.addFitness = async (req, res, next) => {
  let return_plan=false
  try {
    const user = await getUser(req?.user?.sub)
    if (!user.exercisePlan) {
      handleError("plase buy your fitness plan first", 403)
    }
      await User.update({
      exercisePlan: false
    }, {
      where: {
        id: req?.user?.sub
      }
    })
    return_plan=true
    res.json({ message: "success" });
    const prompt = fitnessPrmopmt(req)
    let parsed_obj=await parseFitnessPlan(prompt)
    const pdf = await createFitnessPlanPDF(parsed_obj)
    await sendFitnessPlanPdf(user.email, user.first_name, pdf)
    return
  } catch (err) {
    if(return_plan){
      await User.update({
        exercisePlan: true
      }, {
        where: {
          id: req?.user?.sub
        }
      })
    }
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
  
  prompt +="please create a list of 7 days fitness plan. The structure should look like this Day-1. Squats 5 sets of 10, Box Jumps 5 sets of 15, Lunges 3 sets of 10 on each leg, Skipping Rope; each day must be separated by comma"
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