const Product = require("../models/productModel");
const { validationResult } = require("express-validator");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const User = require("../models/userModel");
const { removeEmptyPair } = require("../helper/reusable");
exports.addProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    if (req.mimetypeError) {
      const error = new Error(req.mimetypeError);
      error.statusCode = 400;
      throw error;
    }
    const new_product_info=removeEmptyPair(req.body)
    const imgurl = [];
    if (req?.files?.length > 0) {
      if (!fs.existsSync("./images")) {
        fs.mkdirSync("./images");
      }

      for (let f = 0; f < req?.files?.length; f++) {
        const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const imagetype = req.files[f].mimetype.split("/")[1];
        const path = req.files[f].originalname;
        const fullpath = uniquePrefix + "-" + path;
        sharp(req.files[f].buffer)
          .resize({ width: 600, fit: "contain" })
          .toFormat(imagetype)
          .toFile(`./images/${fullpath}`);
        imgurl.push(fullpath);
      }
      const new_product = await Product.create({
        ...new_product_info,
        image_url: imgurl,
      });
      return res.json(new_product);
    } else {
      const new_product = await Product.create({
        ...new_product_info,
      });
      return res.json(new_product);
    }
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const options = {
      order: [["product_name", "ASC"]],
    };
    const id = req.user.sub;
    const user = await User.findByPk(id);
    let products;
    if(user.appointment){
      products = await Product.findAll({
        ...options,where:{type:'treatment'}});
    }
    else{
      products = await Product.findAll({
        ...options,where:{type:'product'}});
    }
    const priceArr = [];
    products?.map((e) => priceArr.push(Number(e.price)));
    const totalPrice = priceArr.reduce((f, s) => f + s, 0);
    products.total = totalPrice;
    const token = req.cookies.access_token;

    const billing_info={
      firstName:user.first_name,
      lastName:user.last_name,
      email:user.email,
      address:user.address,
      city:user.city,
      zipCode:user.zip_code,
      state:user.state
    }
    return res.render(
      path.join(__dirname, "..", "/views/pages/shop-checkout"),
      { products,billing_info,token }
    );
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    return res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.editProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const addImage = {};
    const update_product_info=removeEmptyPair(req.body)
    if (req.mimetypeError) {
      const error = new Error(req.mimetypeError);
      error.statusCode = 400;
      throw error;
    }
    const imgurl = [];
    if (req?.files?.length > 0) {
      for (let f = 0; f < req.files.length; f++) {
        const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const imagetype = req.files[f].mimetype.split("/")[1];
        const path = req.files[f].originalname;
        const fullpath = uniquePrefix + "-" + path;
        sharp(req.files[f].buffer)
          .resize({ width: 200, fit: "contain" })
          .toFormat(imagetype)
          .toFile(`./images/${fullpath}`);
        imgurl.push(fullpath);
      }
      addImage.image_url = imgurl;
    }
    const updated_product = await Product.update(
      { ...update_product_info, ...addImage },
      { where: { id: id } }
    );
    return res.json(updated_product);
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Product.destroy({ where: { id } });
    return res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (err) {
    next(err);
  }
};
