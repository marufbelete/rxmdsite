// const express = require("express");
// const router = express.Router();
// const { shippingValidate } = require("../validator/shipping");
// const {
//   createShipping,
//   deleteshipping,
//   editshipping,
//   getShipping,
//   getShippingById,
// } = require("../controllers/shippingController");
// const { errorHandler } = require("../middleware/errohandling.middleware");
// const { authenticateJWT } = require("../middleware/auth.middleware");
// const { authAdmin } = require("../middleware/role.middleware");

// router.post("/addshipping", authenticateJWT, shippingValidate(), createShipping, errorHandler);
// router.get("/getshiping", authenticateJWT, getShipping, errorHandler);
// router.get("/getshippingbyid/:id", authenticateJWT, getShippingById, errorHandler);
// router.put("/edishipping/:id", authenticateJWT, authAdmin, editshipping, errorHandler);
// router.delete("/deleteshipping/:id", authenticateJWT, authAdmin, deleteshipping, errorHandler);

// module.exports = router;
