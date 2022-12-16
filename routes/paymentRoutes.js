const express = require('express');
const router = express.Router();
const { paymentValidate } = require('../validator/payment');
const { addPayment, deletePayment, editPayment,
  getPayment, getPaymentById } = require('../controllers/paymentController')
const { errorHandler } = require('../middleware/errohandling.middleware')
const { authenticateJWT } = require('../middleware/auth.middleware');
const { authAdmin } = require('../middleware/role.middleware')

router.post('/addpayment', authenticateJWT, paymentValidate(), authAdmin, addPayment, errorHandler);
router.get('/getpayment', authenticateJWT, getPayment, errorHandler);
router.get('/getpaymentbyid/:id', authenticateJWT, getPaymentById, errorHandler);
router.put('/editpayment/:id', authenticateJWT, authAdmin, editPayment, errorHandler);
router.delete('/deletepayment/:id', authenticateJWT, authAdmin, deletePayment, errorHandler);


module.exports = router;