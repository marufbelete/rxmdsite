const User = require("../models/userModel");
const Appointment=require("../models/appointmentModel")
const path = require("path");
const sequelize = require("../models/index");
const { runJob, scheduleAppointmentReminder } = require("../helper/cron_job");
const { getUser } = require("../helper/user");
const { generateZoomLink } = require("../functions/zoom");
const moment = require("moment");
const momentZone = require("moment-timezone");
const { Op } = require("sequelize");
const timeZone = "America/Los_Angeles";
exports.getAppointment = async (req, res, next) => {
  try {
    const token = req.cookies.acccess_token;
    return res.render(
      path.join(__dirname, "..", "/views/pages/appointment"),{token});
  } catch (err) {
    next(err);
  }
};

exports.updateAppointmentSchedule = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
  
    const {patientFirstName,patientLastName,patientEmail,message,
           patientPhoneNumber,appointmentDateTime,doctorId,userTimezone}=req.body
           console.log(appointmentDateTime)
           const userDateTime = momentZone(appointmentDateTime).tz(userTimezone);
           const utcDateTimeAppointment = userDateTime.clone().utc();
           console.log(utcDateTimeAppointment)
    const patientId=req?.user?.sub
    const patient=await getUser(patientId)
    const doctor=await getUser(doctorId)
    await User.update({
      left_appointment:false},
     {where:{id:patientId},transaction: t })
    //  const zoom_url=await generateZoomLink(utcDateTimeAppointment)
    await Appointment.update({
     patientFirstName,patientLastName,patientEmail,message,
     patientPhoneNumber,appointmentDateTime:utcDateTimeAppointment.toDate(),doctorId,
     appointmentStatus:"pending",zoomUrl:"zoom_url"
    },{where:{appointmentStatus:"in progress",paymentStatus:true},
    transaction: t })
    await t.commit();

    // const dateTimeAppt = moment(appointmentDateTime);
    const reminderDateTime = utcDateTimeAppointment.subtract(1, "hour");
    const reminderCronString = `${reminderDateTime.minutes()} ${reminderDateTime.hours()} * * *`;
    // const dateTimeString = ;
    // const dateTime = moment(appointmentDateTime);
    const formattedDate = utcDateTimeAppointment.format("MM/DD/YY");
    const formattedTime = utcDateTimeAppointment.format("hh:mm A");
    
    runJob(reminderCronString, ()=>{
      return scheduleAppointmentReminder(patient?.email, patient?.first_name, "zoom_url", formattedDate, formattedTime);
    })
    runJob(reminderCronString, ()=>{
      return scheduleAppointmentReminder(doctor?.email, doctor?.first_name, "zoom_url",formattedDate, formattedTime);
    })

    return res.json({message:"success"});
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.getApptPatientSchedule = async (req, res, next) => {
  try {
    const patientId=req?.user?.sub
    const appointments=await Appointment.findAll(
     {where:{patientId:patientId},include:['doctor']})
     console.log(appointments)
    return res.json({appointments});
  } catch (err) {
    next(err);
  }
};

exports.runCronOnAppointment = async () => {
  try {
    const oneHourFromNow = moment().add(1, "hour");    
    const appointments =await Appointment.findAll({where:{appointmentStatus:"pending",paymentStatus:true,
    appointmentDateTime: {
      [Op.gt]: new Date(oneHourFromNow),
    }}})
    if(appointments.length>0){
      for(let appointment of appointments){
        const dateTime = moment(appointment.appointmentDateTime);
        const formattedDate = dateTime.format("MM/DD/YY");
        const formattedTime = dateTime.format("h:mm A");

        const patient=await getUser(appointment.patientId)
        const doctor=await getUser(appointment.doctorId)

        const dateTimeAppt = moment(appointment.appointmentDateTime);
        const reminderDateTime = dateTimeAppt.subtract(1, "hour");
        const reminderCronString = `${reminderDateTime.minutes()} ${reminderDateTime.hours()} * * *`;
        runJob(reminderCronString, ()=>{
          return scheduleAppointmentReminder(patient?.email, patient?.first_name, "appointment.zoomUrl", formattedDate, formattedTime);
        })
        runJob(reminderCronString, ()=>{
          return scheduleAppointmentReminder(doctor?.email, doctor?.first_name, "appointment.zoomUrl",formattedDate, formattedTime);
        })
      }
    }
    return true
  } catch (err) {
    console.log(err)
    return false
  }
};

exports.payForSchedule = async (req, res, next) => {
  try {
    const {patientFirstName,patientLastName,patientEmail,
           patientPhoneNumber,appointmentDateTime}=req.body
    await Appointment.create({
     patientFirstName,patientLastName,patientEmail,
     patientPhoneNumber,appointmentDateTime
    })
    return res.json({message:"success"});
  } catch (err) {
    next(err);
  }
};




