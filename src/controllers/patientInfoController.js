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
// exports.getRoleById = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const role = await addPatientInfo.findByPk(id);
//     return res.json(role);
//   } catch (err) {
//     next(err);
//   }
// };
// exports.editRole = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const updated_role = await addPatientInfo.update(
//       { ...req.body },
//       { where: { id: id } }
//     );
//     return res.json(updated_role);
//   } catch (err) {
//     next(err);
//   }
// };

// exports.deleteRole = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     await addPatientInfo.destroy({ where: { id } });
//     return res.json({
//       success: true,
//       message: "addPatientInfo deleted",
//     });
//   } catch (err) {
//     next(err);
//   }
// };
