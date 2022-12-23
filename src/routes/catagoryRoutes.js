const express = require('express');
const router = express.Router();
const {catagoryValidate} = require('../validator/catagory');
const {addCatagory,deleteCatagory,editCatagory,
       getCatagory,getCatagoryById}=require('../controllers/catagoryController')
const {errorHandler}=require('../middleware/errohandling.middleware')
const {authenticateJWT}=require('../middleware/auth.middleware');
const {authAdmin}=require('../middleware/role.middleware')

router.post('/addcatagory',authenticateJWT,catagoryValidate(),authAdmin,addCatagory,errorHandler);
router.get('/getcatagory',authenticateJWT,getCatagory,errorHandler);
router.get('/getcatagorybyid/:id',authenticateJWT,getCatagoryById,errorHandler);
router.put('/editcatagory/:id',authenticateJWT,authAdmin,editCatagory,errorHandler);
router.delete('/deletecatagory/:id',authenticateJWT,authAdmin,deleteCatagory,errorHandler);

module.exports = router;