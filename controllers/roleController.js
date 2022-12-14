const Role = require("../models/roleModel");
const { validationResult } = require("express-validator");

exports.addRole=async (req, res,next) => {
  try {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message:errors.array()[0].msg});
  }
    const { role } = req.body;
    const add_role = new Role({role});
    const new_role= await add_role.save();
    return res.json(new_role);
  } catch (err) {
    next(err)
  }
};

exports.getRole=async (req, res,next) => {
  try {
    const roles = await Role.findAll();
    return res.json(roles);
  } catch (err) {
   next(err)
  }
};
exports.getRoleById=async (req, res,next) => {
  try {
    const {id}=req.params
    const role = await Role.findByPk(id);
   return res.json(role);
  } catch (err) {
   next(err)
  }
};
exports.editRole=async (req, res,next) => {
  try {
    const { id } = req.params;
    const updated_role = await Role.update({...req.body},{where:{id:id}});
    return res.json(updated_role);
  } catch (err) {
    next(err)
  }
};

exports.deleteRole= async (req, res,next) => {
  try {
    const { id } = req.params;
    await Role.destroy({where:{id}});
    return res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (err) {
    next(err)
  }
};

