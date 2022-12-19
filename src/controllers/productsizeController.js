const ProductSize = require("../models/productsizeModel");
const { validationResult } = require("express-validator");

exports.addProductsize=async (req, res,next) => {
  try {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message:errors.array()[0].msg});
  }
    const add_productsize = new ProductSize({...req.body});
    const new_productsize= await add_productsize.save();
    return res.json(new_productsize);
  } catch (err) {
    next(err)
  }
};

exports.getProductsize=async (req, res,next) => {
  try {
    const productsizes = await ProductSize.findAll();
    return res.json(productsizes);
  } catch (err) {
   next(err)
  }
};

exports.getProductsizeById=async (req, res,next) => {
  try {
    const {id}=req.params
    const productsize = await ProductSize.findByPk(id);
    return res.json(productsize);
  } catch (err) {
   next(err)
  }
};

exports.editProductsize=async (req, res,next) => {
  try {
    const { id } = req.params;
    const updated_productsize = await ProductSize.update({...req.body},
      {where:{id:id}});
    return res.json(updated_productsize);
  } catch (err) {
    next(err)
  }
};

exports.deleteProductsize= async (req, res,next) => {
  try {
    const { id } = req.params;
    await ProductSize.destroy({where:{id}});
    return res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (err) {
    next(err)
  }
};

