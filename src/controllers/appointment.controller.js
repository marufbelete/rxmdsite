const Appointment=require("../models/appointmentModel")
const path = require("path");
const { runJob, scheduleAppointmentReminderDoctor,scheduleAppointmentReminderPatient } = require("../helper/cron_job");
const { getUser, getAppointmentByFilter } = require("../helper/user");
const { generateZoomLink } = require("../functions/zoom");
const moment = require("moment");
const { Op} = require("sequelize");
const { handleError } = require("../helper/handleError");
const { get } = require("config");
const cron = require('node-schedule');
const User = require("../models/userModel");

exports.getAppointment = async (req, res, next) => {
  try {
    const token = req.cookies.acccess_token;
    await User.update({
      left_appointment:false},
     {where:{id:req?.user?.sub}})
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
    const is_unpaid_exist=await getAppointmentByFilter({where:{paymentStatus:false,patientId:req?.user?.sub}})
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
    // const patient=await getUser(patientId)
    // const doctor=await getUser(doctorId)
    const before_one_hour=utcDateTimeAppointment.clone().subtract(50, "minute").format('YYYY-MM-DD HH:mm:ss[Z]')
    const after_one_hour=utcDateTimeAppointment.clone().add(50, "minute").format('YYYY-MM-DD HH:mm:ss[Z]')
    const options={
      where:{
        doctorId: doctorId,
        paymentStatus:true,
        appointmentDateTime: {
          [Op.between]: [
            before_one_hour,after_one_hour
          ]
        }
      },
     }
    //  console.log(utcDateTimeAppointment.format('YYYY-MM-DD'),utcDateTimeAppointment.format('H'))
    const schedule_exist=await getAppointmentByFilter(options)
    // console.log(schedule_exist)
    if(schedule_exist)handleError("This provider already occupied for the requested time, plase adjust your time",403)

    //  const zoom_url=await generateZoomLink(utcDateTimeAppointment)
    await Appointment.update({
     patientFirstName,patientLastName,patientEmail,message,
     patientPhoneNumber,appointmentDateTime:utcDateTimeAppointment.format('YYYY-MM-DD HH:mm:ss[Z]'),doctorId,
     appointmentStatus:"pending"
    },
    {where:{paymentStatus:false,patientId}}
    )

    // const formattedDate = utcDateTimeAppointment.format("MM/DD/YY");
    // const formattedTime = utcDateTimeAppointment.format("hh:mm A");
    
    // const reminderCronString = utcDateTimeAppointment.subtract(1, "hour").toDate();
    // const unique_name_patient=`${patient.id}-patientreminder`
    // const unique_name_doctor=`${patient.id}-doctorreminder`
    // const patient_job = cron.scheduledJobs[unique_name_patient];
    // const doctor_job = cron.scheduledJobs[unique_name_doctor];
    // if(patient_job)patient_job.cancel();
    // if(doctor_job)doctor_job.cancel();
    // runJob(reminderCronString, ()=>{
    //   return scheduleAppointmentReminderPatient(patient?.email, patient?.first_name, zoom_url.join_url, formattedDate, formattedTime);
    // },unique_name_patient)
    // runJob(reminderCronString, ()=>{
    //   return scheduleAppointmentReminderDoctor(doctor?.email, doctor?.first_name, zoom_url.start_url,formattedDate, formattedTime);
    // },unique_name_doctor)
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

exports.runCronOnAppointment = async (apptId,transaction={}) => {
    const appointment =await Appointment.findByPk(apptId)
    console.log(appointment)
    if(appointment){
        const patient=await getUser(appointment?.patientId)
        const doctor=await getUser(appointment?.doctorId)
        const dateTimeAppt = moment.utc(appointment?.appointmentDateTime);
        const zoom_url=await generateZoomLink(dateTimeAppt)
        const formattedDate = dateTimeAppt.format("MM/DD/YY");
        const formattedTime = dateTimeAppt.format("hh:mm A");
        const reminderCronString = dateTimeAppt.subtract(1, "hour").toDate();
        const unique_name_patient=`${patient.id}-patientreminder`
        const unique_name_doctor=`${patient.id}-doctorreminder`
        console.log("why------------------------------------------------555555")
        console.log(zoom_url,apptId)
        await Appointment.update({
          startUrl:zoom_url.start_url,joinUrl:zoom_url.join_url
         },
         {where:{id:apptId},...transaction}
         )
        runJob(reminderCronString, ()=>{
          return scheduleAppointmentReminderPatient(patient?.email, patient?.first_name, zoom_url.join_url, formattedDate,formattedTime);
        },unique_name_patient)
        runJob(reminderCronString, ()=>{
          return scheduleAppointmentReminderDoctor(doctor?.email, doctor?.first_name, zoom_url.start_url, formattedDate,formattedTime);
        },unique_name_doctor)
    return true
      }
      handleError("appointment not exist",403)
};
exports.runCronOnAppointments = async () => {
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
        const unique_name_patient=`${patient.id}-patientreminder`
        const unique_name_doctor=`${patient.id}-doctorreminder`
        const patient_job = cron.scheduledJobs[unique_name_patient];
        const doctor_job = cron.scheduledJobs[unique_name_doctor];
        if(patient_job)patient_job.cancel();
        if(doctor_job)doctor_job.cancel();
        runJob(reminderCronString, ()=>{
          return scheduleAppointmentReminderPatient(patient?.email, patient?.first_name, appointment.joinUrl, formattedDate,formattedTime);
        },unique_name_patient)
        runJob(reminderCronString, ()=>{
          return scheduleAppointmentReminderDoctor(doctor?.email, doctor?.first_name, appointment.startUrl, formattedDate,formattedTime);
        },unique_name_doctor)
      }
    }
    return true
  } catch (err) {
    return false
  }
};

// exports.payForSchedule = async (req, res, next) => {
//   try {
//     const {patientFirstName,patientLastName,patientEmail,
//            patientPhoneNumber,appointmentDateTime}=req.body
//     await Appointment.create({
//      patientFirstName,patientLastName,patientEmail,
//      patientPhoneNumber,appointmentDateTime
//     })
//     return res.json({message:"success"});
//   } catch (err) {
//     next(err);
//   }
// };
// exports.payForSchedule = async (req, res, next) => {
//   try {
//     const {patientFirstName,patientLastName,patientEmail,
//            patientPhoneNumber,appointmentDateTime}=req.body
//     await Appointment.create({
//      patientFirstName,patientLastName,patientEmail,
//      patientPhoneNumber,appointmentDateTime
//     })
//     return res.json({message:"success"});
//   } catch (err) {
//     next(err);
//   }
// };




