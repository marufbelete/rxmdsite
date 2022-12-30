const express = require("express");
const router = express.Router();
const {
  deleteOrderproduct,
  editOrderproduct,
  getOrderProduct,
  getOrderproductById,
} = require("../controllers/orderproductController");
const { errorHandler } = require("../middleware/errohandling.middleware");
const { authenticateJWT } = require("../middleware/auth.middleware");
const { authAdmin } = require("../middleware/role.middleware");

router.get("/getorderproduct/:orderId", authenticateJWT, getOrderProduct, errorHandler);
router.get("/getorderproductbyid/:id", authenticateJWT, getOrderproductById, errorHandler);
router.put("/editorderproduct/:id", authenticateJWT, authAdmin, editOrderproduct, errorHandler);
router.delete("/deleteorderproduct/:id", authenticateJWT, authAdmin, deleteOrderproduct, errorHandler);

module.exports = router;
