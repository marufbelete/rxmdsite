const express = require("express");
const Product = require("../models/productModel");

exports.addProduct=async (req, res,next) => {
  try {
    const { name, price, description } = req.body;
    const user = new User({
      username,
      email,
      first_name:firstName,
      last_name:lastName,
      isLocalAuth:true,
      password:hashedPassword,
    });
    await user.save();
    res.json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err)
  }
};

exports.getProduct=async (req, res,next) => {
  try {
    const products = await Product.findAll({});
    res.json({
      success: true,
      data: products,
    });
  } catch (err) {
   next(err)
  }
};

exports.editProduct=async (req, res,next) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error("Product not found");
    }
    product.name = name;
    product.price = price;
    product.description = description;
    await product.save();
    res.json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err)
  }
};

exports.delete= async (req, res,next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error("Product not found");
    }
    await product.destroy();
    res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (err) {
    next(err)
  }
};

