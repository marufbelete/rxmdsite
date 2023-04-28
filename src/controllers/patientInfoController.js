const Patientinfo = require("../models/patientInfoModel");

exports.addPatientInfo = async (req, res, next) => {
  try {
   
    const add_patient_info = new Patientinfo({ ...req.body });
    const new_patient_info = await add_patient_info.save();
    return res.json(new_patient_info);
  } catch (err) {
    next(err);
  }
};

exports.getPatientInfo = async (req, res, next) => {
  try {
    const patient_info = await Patientinfo.findAll();
    return res.json(patient_info);
  } catch (err) {
    next(err);
  }
};

exports.getPatientInfoById = async (req, res, next) => {
  try {
    const id=req.params.id
    const patient_info = await Patientinfo.findByPk(id);
    return res.json(patient_info);
  } catch (err) {
    next(err);
  }
};

exports.getPatientInfoByUserId = async (req, res, next) => {
  try {
    const userId=req.params.id
    const patient_info = await Patientinfo.findOne({where:{userId:userId}});
    return res.json(patient_info);
  } catch (err) {
    next(err);
  }
};
