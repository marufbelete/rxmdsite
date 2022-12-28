const Product = require("../models/productModel");
const { validationResult } = require("express-validator");
const sharp = require("sharp")
const fs = require("fs");
const path = require("path");
exports.addProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    if (req.mimetypeError) {
      const error = new Error(req.mimetypeError)
      error.statusCode = 400
      throw error;
    }
    const imgurl = []
    if (req.files.length > 0) {
      if (!fs.existsSync("./images")) {
        fs.mkdirSync("./images");
      }

      for (let f = 0; f < req.files.length; f++) {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const imagetype = (req.files[f].mimetype).split("/")[1];
        const path = req.files[f].originalname;
        const fullpath = uniquePrefix + '-' + path;
        sharp(req.files[f].buffer)
          .resize({ width: 600, fit: 'contain', })
          .toFormat(imagetype)
          .toFile(`./images/${fullpath}`);
        imgurl.push(fullpath)
      }
      const new_product = await Product.create({
        ...req.body,
        image_url: imgurl
      });
      return res.json(new_product);
    }
    else {
      const new_product = await Product.create({
        ...req.body
      });
      return res.json(new_product);
    }
  } catch (err) {
    next(err)
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const { page, paginate } = req.query
    const options = {
      // include: ["brand", "category"],
      // attributes: { exclude: ['categoryId', 'brandId'] },
      page: Number(page) || 1,
      paginate: Number(paginate) || 25,
      order: [['product_name', 'ASC']]
    }
    const products = await Product.paginate(options)
    const priceArr=[]
    products.docs.map(e=>priceArr.push(Number(e.price)))
    console.log(priceArr)
    const totalPrice=priceArr.reduce((f,s)=>f+s,0)
    console.log(totalPrice)
    products.total=totalPrice
    return res.render(path.join(__dirname, "..", "/views/pages/shop-checkout"),{products});

    return res.json(products);
  } catch (err) {
    next(err)
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params
    const product = await Product.findByPk(id, {
      include:
        ["brand", "category"]
    });
    return res.json(product);
  } catch (err) {
    next(err)
  }
};

exports.editProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const addImage = {}
    if (req.mimetypeError) {
      const error = new Error(req.mimetypeError)
      error.statusCode = 400
      throw error;
    }
    const imgurl = []
    if (req.files.length > 0) {
      for (let f = 0; f < req.files.length; f++) {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const imagetype = (req.files[f].mimetype).split("/")[1]
        const path = req.files[f].originalname;
        const fullpath = uniquePrefix + '-' + path;
        sharp(req.files[f].buffer)
          .resize({ width: 200, fit: 'contain', })
          .toFormat(imagetype)
          .toFile(`./images/${fullpath}`);
        imgurl.push(fullpath)
      }
      addImage.image_url = imgurl
    }
    const updated_product = await Product.update({ ...req.body, ...addImage },
      { where: { id: id } });
    return res.json(updated_product);
  } catch (err) {
    next(err)
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
    next(err)
  }
};
