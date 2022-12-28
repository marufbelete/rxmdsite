const express = require('express');
const router = express.Router();
const { categoryValidate } = require('../validator/category');
const { addCategory, deleteCategory, editCategory,
       getCategory, getCategoryById } = require('../controllers/categoryController')
const { errorHandler } = require('../middleware/errohandling.middleware')
const { authenticateJWT } = require('../middleware/auth.middleware');
const { authAdmin } = require('../middleware/role.middleware')

router.post('/addcategory', authenticateJWT,authAdmin, categoryValidate(), addCategory, errorHandler);
router.get('/getcategory', authenticateJWT, getCategory, errorHandler);
router.get('/getcategorybyid/:id', authenticateJWT, getCategoryById, errorHandler);
router.put('/editcategory/:id', authenticateJWT, authAdmin, editCategory, errorHandler);
router.delete('/deletecategory/:id', authenticateJWT, authAdmin, deleteCategory, errorHandler);

module.exports = router;