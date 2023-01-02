const express = require("express");
const router = express.Router();
const { roleValidate } = require("../validator/role");
const {
  addRole,
  editRole,
  getRole,
  getRoleById,
  deleteRole,
} = require("../controllers/roleController");
const { errorHandler } = require("../middleware/errohandling.middleware");
const { authenticateJWT } = require("../middleware/auth.middleware");
const { authAdmin } = require("../middleware/role.middleware");

router.post(
  "/addrole",
  authenticateJWT,
  authAdmin,
  roleValidate(),
  addRole,
  errorHandler
);
router.get("/getrole", authenticateJWT, authAdmin, getRole, errorHandler);
router.get(
  "/getrolebyid/:id",
  authenticateJWT,
  authAdmin,
  getRoleById,
  errorHandler
);
router.put("/editrole/:id", authenticateJWT, authAdmin, editRole, errorHandler);
router.delete(
  "/deleterole/:id",
  authenticateJWT,
  authAdmin,
  deleteRole,
  errorHandler
);

module.exports = router;
