// const express = require("express");
// const router = express.Router();
// const { productsizeValidate } = require("../validator/productsize");
// const {
//   addProductsize,
//   deleteProductsize,
//   editProductsize,
//   getProductsize,
//   getProductsizeById,
// } = require("../controllers/productsizeController");
// const { errorHandler } = require("../middleware/errohandling.middleware");
// const { authenticateJWT } = require("../middleware/auth.middleware");
// const { authAdmin } = require("../middleware/role.middleware");

// router.post(
//   "/addproductsize",
//   authenticateJWT,
//   productsizeValidate(),
//   addProductsize,
//   errorHandler
// );
// router.get("/getproductsize", authenticateJWT, getProductsize, errorHandler);
// router.get(
//   "/getproductsizebyid/:id",
//   authenticateJWT,
//   getProductsizeById,
//   errorHandler
// );
// router.put(
//   "/editproductsize/:id",
//   authenticateJWT,
//   authAdmin,
//   editProductsize,
//   errorHandler
// );
// router.delete(
//   "/deleteproductsize/:id",
//   authenticateJWT,
//   authAdmin,
//   deleteProductsize,
//   errorHandler
// );

// module.exports = router;
