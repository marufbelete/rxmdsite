const PatientInfo=require('../models/patientInfoModel')

const refillLeft=async(userId)=>{
    const patient_info=await PatientInfo.findOne({where:{userId:userId}})
    return patient_info.refill
}