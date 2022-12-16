const Catagory = require("../models/catagoryModel");
const { validationResult } = require("express-validator");

exports.addCatagory=async (req, res,next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message:errors.array()[0].msg});
    }   
    const catagory = new Catagory({
      ...req.body
    });
    const new_catagory=await catagory.save();
    return res.json(new_catagory);
  } catch (err) {
    next(err)
  }
};

exports.getCatagory=async (req, res,next) => {
  try {
    const catagorys = await Catagory.findAll();
    return res.json(catagorys);
  } catch (err) {
   next(err)
  }
};
exports.getCatagoryById=async (req, res,next) => {
  try {
    const {id}=req.params
    const catagory = await Catagory.findByPk(id);
   return res.json(catagory);
  } catch (err) {
   next(err)
  }
};
exports.editCatagory=async (req, res,next) => {
  try {
    const { id } = req.params;
    const updated_catagory = await Catagory.update({...req.body},
      {where:{id:id}});
    return res.json(updated_catagory);
  } catch (err) {
    next(err)
  }
};

exports.deleteCatagory= async (req, res,next) => {
  try {
    const { id } = req.params;
    await Catagory.destroy({where:{id}});
    return res.json({
      success: true,
      message: "Catagory deleted",
    });
  } catch (err) {
    next(err)
  }
};

