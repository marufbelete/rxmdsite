const express = require("express");
const router = express.Router();
const { Product } = require("../models/productModel").default;

router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({});
    res.json({
      success: true,
      data: products,
    });
  } catch (err) {
    res.json({
      success: false,
      error: err.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const product = await Product.create({
      name,
      price,
      description,
    });
    res.json({
      success: true,
      data: product,
    });
  } catch (err) {
    res.json({
      success: false,
      error: err.message,
    });
  }
});

router.put("/:id", async (req, res) => {
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
    res.json({
      success: false,
      error: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
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
    res.json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
