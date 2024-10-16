const cron = require('node-schedule');
const { sendAppointmentReminderEmailDoctor,sendAppointmentReminderEmailPatient } = require('./send_email');
const Subscription=require('../models/subscriptionModel');
// const { chargeCreditCardExistingUser } = require('../functions/handlePayment');
const { Op } = require('sequelize');
const medicationSurveyJob= async() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const endOfSevenDaysAgo = new Date(sevenDaysAgo.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
    const patients = await db.Patient.findAll({
      where: {
        createdAt: {
          [Op.between]: [sevenDaysAgo, endOfSevenDaysAgo],
        },
        emailSent: {
          [Op.not]: true,
        },
      },
    });
    for (const patient of patients) {
      // send email code here
      patient.emailSent = true;
      await patient.save();
    }
    console.log(`Sent emails to ${patients.length} patients`);
  };

const scheduleAppointmentReminderDoctor=(email,patient_name,link,date,time) =>{
  sendAppointmentReminderEmailDoctor(email,patient_name,link,date,time)
}
const scheduleAppointmentReminderPatient=(email,doctor_name,link,date,time) =>{
  sendAppointmentReminderEmailPatient(email,doctor_name,link,date,time)
}



const runJob=(time,job,unique_name)=>{
 cron.scheduleJob(unique_name,time, ()=>{
  console.log('called')
  job()
 })
}

module.exports={
  medicationSurveyJob,
  scheduleAppointmentReminderDoctor,
  scheduleAppointmentReminderPatient,
  runJob
}


