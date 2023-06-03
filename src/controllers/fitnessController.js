const { handleError } = require("../helper/handleError");
const { getUser } = require("../helper/user");
const Fitness = require("../models/fitnessModel");
const { createCompletion } = require('../chatGPT/createCompletion');
const User = require("../models/userModel");
const { createFitnessPlanPDF } = require("../helper/fill_pdf");
const { sendFitnessPlanPdf } = require("../helper/send_email");

exports.addFitness = async (req, res, next) => {
  try {
    const user = await getUser(req?.user?.sub)
    console.log(req.body)
    if (!user.exercisePlan) {
      handleError("plase buy your fitness plan first", 403)
    }
    const fitness = new Fitness({
      ...req.body,
      userId: req?.user?.sub
    });
    await fitness.save();
    await User.update({
      exercisePlan: false
    }, {
      where: {
        id: req?.user?.sub
      }
    })
    const prompt = fitnessPrmopmt(req)
    const response = await createCompletion(prompt)
    const obj_response = JSON.parse(response)
    fitness.gptResponse = response
    await fitness.save()
    const pdf = await createFitnessPlanPDF(obj_response)
    sendFitnessPlanPdf(user.email, user.first_name, pdf).
      then(r => r).catch(e => e)
    // const jobTime=moment().add(1,'seconds')
    // console.log("reached")
    // cron.scheduleJob(new Date(), async()=>{
    //   try{
    //     console.log("running the job")
    //     await User.update({
    //       FitnessPlan:false
    //      },{where:{
    //        id:req?.user?.sub
    //      }})
    //     const prompt=FitnessPrmopmt()
    //     const response=await createCompletion(prompt)
    //     const obj_response=JSON.parse(response)
    //     Fitness.gptResponse=response
    //     await Fitness.save()
    //     createFitnessPlanPDF(obj_response)
    //     }
    //     catch(err){
    //       console.log(err)
    //     }
    //  })
    // runJob(jobTime, async()=>{

    //   }
    //  ,"one-time")
    return res.json({ message: "success" });
  } catch (err) {
    console.log(err)
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


const fitnessPrmopmt = (req) => {
  const plan_format = [{
    day: 'Day 1',

    exercises: [
      { name: 'exerise name', description: 'exercise desription and duration' },
      { name: 'exerise name', description: 'exercise desription and duration' },
      { name: 'exerise name', description: 'exercise desription and duration' },
      { name: 'exerise name', description: 'exercise desription and duration' },
      { name: 'exerise name', description: 'exercise desription and duration' },
    ],
  }
  ]
  let prompt = "As a fitness planner, I need your help to create a 1-day fitness plan in JSON format for a ";
  if (req.body.gender) prompt += `${req.body.gender.toLowerCase()} `;
  if (req.body.age) prompt += `client who is ${req.body.age} years old, `;
  if (req.body.heightFeet && req.body.heightInches) prompt += `is ${req.body.heightFeet} feet and '${req.body.heightInches}" inches tall, `;
  if (req.body.bodyWeight) prompt += `weighs ${req.body.bodyWeight} lbs, `;
  if (req.body.fitnessLevel) prompt += `has a ${req.body.fitnessLevel.toLowerCase()} fitness level, `;
  if (req.body.fitnessGoal) prompt += `has a fitness goal of ${req.body.fitnessGoal.toLowerCase()}, `;
  if (req.body.workoutPreference) prompt += `prefers ${req.body.workoutPreference.toLowerCase()} workouts, `;
  if (req.body.exerciseLimitation) prompt += `has ${req.body.exerciseLimitation}, `;
  if (req.body.workoutFrequency) prompt += `works out ${req.body.workoutFrequency.toLowerCase()} times a week, `;
  if (req.body.workoutDuration) prompt += `for ${req.body.workoutDuration.toLowerCase()} hour each time, `;
  if (req.body.availableEquipment) prompt += `has access to the following equipment ${req.body.availableEquipment}`;
  if (req.body.restAndRecovery) prompt += `practices ${req.body.restAndRecovery} for rest and recovery, `;
  if (req.body.healthCondition) prompt += `has the following health connditions ${req.body.healthCondition}`;
  if (req.body.currentMedication) prompt += `is currently taking the following medications or substances ${req.body.currentMedication}, `;
  prompt += "Please provide the fitness plan in JSON format, including name and desccription. Return the JSON in this format: " + JSON.stringify(plan_format);
  return prompt
  //  `As a Fitness planner, I need your help to create a 1-day Fitness plan in JSON for
  // a male client who is 25 years old, 1.67m tall, weighs 55kg, has a beginner fitness level,
  // works out 3 days a week for 2 hours each time, and has good health.
  //  Please provide the Fitness plan in JSON format, including breakfast, lunch, snack, and dinner
  //  for each day. Make sure to include the name of the Fitness and serving size. return the json in this format ${JSON.stringify(plan_format)} `
}


// create funtion that convert json to object
// exports.getFitnessPlanFromGPT = async (req, res, next) => {
//   try {

//     const fitness = await createCompletion();
//     return res.json(fitness);
//   } catch (err) {
//     next(err);
//   }
// };
