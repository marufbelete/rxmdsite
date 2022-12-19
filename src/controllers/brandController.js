const Brand = require("../models/brandModel");
const { validationResult } = require("express-validator");

exports.addBrand=async (req, res,next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message:errors.array()[0].msg});
    }  
    const brand = new Brand({
      ...req.body
    });
    const new_brand=await brand.save();
    return res.json(new_brand);
  } catch (err) {
    next(err)
  }
};

exports.getBrand=async (req, res,next) => {
  try {
    const brands = await Brand.findAll();
    return res.json(brands);
  } catch (err) {
   next(err)
  }
};
exports.getBrandById=async (req, res,next) => {
  try {
    const {id}=req.params
    const brand = await Brand.findByPk(id);
   return res.json(brand);
  } catch (err) {
   next(err)
  }
};
exports.editBrand=async (req, res,next) => {
  try {
    const { id } = req.params;
    const updated_brand = await Brand.update({...req.body},
      {where:{id:id}});
    return res.json(updated_brand);
  } catch (err) {
    next(err)
  }
};

exports.deleteBrand= async (req, res,next) => {
  try {
    const { id } = req.params;
    await Brand.destroy({where:{id}});
    return res.json({
      success: true,
      message: "Brand deleted",
    });
  } catch (err) {
    next(err)
  }
};

