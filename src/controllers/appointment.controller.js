const Appointment=require("../models/appointmentModel")
const path = require("path");
const { runJob, scheduleAppointmentReminder } = require("../helper/cron_job");
const { getUser, getAppointmentByFilter } = require("../helper/user");
const { generateZoomLink } = require("../functions/zoom");
const moment = require("moment");
const { Op } = require("sequelize");
const { handleError } = require("../helper/handleError");
exports.getAppointment = async (req, res, next) => {
  try {
    const token = req.cookies.acccess_token;
    return res.render(
      path.join(__dirname, "..", "/views/pages/appointment"),{token});
  } catch (err) {
    next(err);
  }
};

exports.createAppointment = async (req, res, next) => {
  try {
    const {productId}=req.body
    if(!productId) handleError("Please select service for the appointment",403)
    const is_unpaid_exist=await getAppointmentByFilter({where:{paymentStatus:false}})
    if(is_unpaid_exist) handleError("Please complete unpaid appointment first",403)
    await Appointment.create({
      productId,
      patientId:req?.user?.sub

    })
    return res.json({status:true})
} catch (err) {
  next(err);
}
};
  
exports.updateAppointmentSchedule = async (req, res, next) => {
  // const t = await sequelize.transaction();
  try {
    const {patientFirstName,patientLastName,patientEmail,message,
    patientPhoneNumber,appointmentDateTime,doctorId,userTimezone}=req.body        
    const utcDateTimeAppointment = moment.tz(appointmentDateTime,userTimezone).utc();

    const patientId=req?.user?.sub
    const patient=await getUser(patientId)
    const doctor=await getUser(doctorId)
    // await User.update({
    //   left_appointment:false},
    //  {where:{id:patientId},transaction: t })
     const zoom_url=await generateZoomLink(utcDateTimeAppointment)
    await Appointment.update({
     patientFirstName,patientLastName,patientEmail,message,
     patientPhoneNumber,appointmentDateTime:utcDateTimeAppointment.format('YYYY-MM-DD HH:mm:ss[Z]'),doctorId,
     appointmentStatus:"pending",startUrl:zoom_url.start_url,joinUrl:zoom_url.join_url
    },
    {where:{paymentStatus:false,patientId}}
    )

    const formattedDate = utcDateTimeAppointment.format("MM/DD/YY");
    const formattedTime = utcDateTimeAppointment.format("hh:mm A");
    
    const reminderCronString = utcDateTimeAppointment.subtract(1, "hour").toDate();
    
    runJob(reminderCronString, ()=>{
      return scheduleAppointmentReminder(patient?.email, patient?.first_name, zoom_url.join_url, formattedDate, formattedTime);
    })
    runJob(reminderCronString, ()=>{
      return scheduleAppointmentReminder(doctor?.email, doctor?.first_name, zoom_url.start_url,formattedDate, formattedTime);
    })
    // await t.commit();
    return res.json({message:"success"});
  } catch (err) {
    // await t.rollback();
    next(err);
  }
};

exports.getApptPatientSchedule = async (req, res, next) => {
  try {
    const patientId=req?.user?.sub
    const appointments=await Appointment.findAll(
     {where:{patientId:patientId},include:['doctor']})
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
      [Op.gt]: oneHourFromNow.toDate(),
    }}})
    if(appointments.length>0){
      for(let appointment of appointments){
        const patient=await getUser(appointment.patientId)
        const doctor=await getUser(appointment.doctorId)
        const dateTimeAppt = moment.utc(appointment.appointmentDateTime);
        const formattedDate = dateTimeAppt.format("MM/DD/YY");
        const formattedTime = dateTimeAppt.format("hh:mm A");
        const reminderCronString = dateTimeAppt.subtract(1, "hour").toDate();
        runJob(reminderCronString, ()=>{
          return scheduleAppointmentReminder(patient?.email, patient?.first_name, appointment.joinUrl, formattedDate,formattedTime);
        })
        runJob(reminderCronString, ()=>{
          return scheduleAppointmentReminder(doctor?.email, doctor?.first_name, appointment.startUrl, formattedDate,formattedTime);
        })
      }
    }
    return true
  } catch (err) {
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




