const Category = require("../models/categoryModel");
const { validationResult } = require("express-validator");

exports.addCategory = async (req, res, next) => {
  try {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    const category = new Category({
      ...req.body,
    });
    const new_category = await category.save();
    return res.json(new_category);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const categorys = await Category.findAll();
    return res.json(categorys);
  } catch (err) {
    next(err);
  }
};
exports.getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    return res.json(category);
  } catch (err) {
    next(err);
  }
};
exports.editCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated_category = await Category.update(
      { ...req.body },
      { where: { id: id } }
    );
    return res.json(updated_category);
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Category.destroy({ where: { id } });
    return res.json({
      success: true,
      message: "Category deleted",
    });
  } catch (err) {
    next(err);
  }
};
