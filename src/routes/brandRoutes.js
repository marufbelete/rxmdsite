const express = require('express');
const router = express.Router();
const {brandValidate} = require('../validator/brand');
const {addBrand,deleteBrand,editBrand,
       getBrand,getBrandById}=require('../controllers/brandController')
const {errorHandler}=require('../middleware/errohandling.middleware')
const {authenticateJWT}=require('../middleware/auth.middleware');
const {authAdmin}=require('../middleware/role.middleware')

router.post('/addbrand',authenticateJWT,authAdmin,brandValidate(),addBrand,errorHandler);
router.get('/getbrand',authenticateJWT,getBrand,errorHandler);
router.get('/getbrandbyid/:id',authenticateJWT,getBrandById,errorHandler);
router.put('/editbrand/:id',authenticateJWT,authAdmin,editBrand,errorHandler);
router.delete('/deletebrand/:id',authenticateJWT,authAdmin,deleteBrand,errorHandler);

module.exports = router;