const Shipping = require("../models/shippingModel");
const { validationResult } = require("express-validator");

exports.crerateShipping=async (req, res,next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message:errors.array()[0].msg});
    }   
    const shipping = new Shipping({
      ...req.body
    });
    const new_shipping=await shipping.save();
    return res.json(new_shipping);
  } catch (err) {
    next(err)
  }
};

exports.getShipping=async (req, res,next) => {
  try {
    const shippings = await Shipping.findAll({ include: 
      ["orders"] });
    return res.json(shippings);
  } catch (err) {
   next(err)
  }
};
exports.getShippingById=async (req, res,next) => {
  try {
    const {id}=req.params
    const shipping = await Shipping.findByPk(id,{ include: 
      ["orders"] });
   return res.json(shipping);
  } catch (err) {
   next(err)
  }
};
exports.editshipping=async (req, res,next) => {
  try {
    const { id } = req.params;
    const updated_shipping = await Shipping.update({...req.body},
      {where:{id:id}});
    return res.json(updated_shipping);
  } catch (err) {
    next(err)
  }
};

exports.deleteshipping= async (req, res,next) => {
  try {
    const { id } = req.params;
    await Shipping.destroy({where:{id}});
    return res.json({
      success: true,
      message: "Shipping deleted",
    });
  } catch (err) {
    next(err)
  }
};

