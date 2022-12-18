const express = require('express');
const router = express.Router();
const { productValidate } = require('../validator/product');
const { addProduct, deleteProduct, editProduct,
  getProduct, getProductById } = require('../controllers/productController')
const { errorHandler } = require('../middleware/errohandling.middleware')
const { authenticateJWT } = require('../middleware/auth.middleware');
const { authAdmin } = require('../middleware/role.middleware')
const multer = require("multer");
const fileStorage = multer.memoryStorage()
const filefilter = (req, file, cb) => {
  console.log("filter")
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true)
  }
  else {
    const type = file.mimetype.split("/")[1]
    req.mimetypeError = `${type} file is not allowed please attach only image file`;
    cb(null, false, new Error(`${type} file is not allowed please attach only image file`))
  }
}
const upload = multer({ storage: fileStorage, fileFilter: filefilter })

router.post('/addproduct', authenticateJWT, authAdmin, upload.array('product_image', 3),
  productValidate(), addProduct, errorHandler);
router.get('/getproduct', authenticateJWT, getProduct, errorHandler);
router.get('/getproductbyid/:id', authenticateJWT, getProductById, errorHandler);
router.put('/editproduct/:id', authenticateJWT, authAdmin,
  upload.array('product_image', 3), editProduct, errorHandler);
router.delete('/deleteproduct/:id', authenticateJWT, authAdmin, deleteProduct, errorHandler);

module.exports = router;