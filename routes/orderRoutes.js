const express = require('express');
const router = express.Router();
const { crerateOrder, deleteOrder, editOrder,
  getOrder, getOrderById, getMyOrder } = require('../controllers/orderController')
const { errorHandler } = require('../middleware/errohandling.middleware')
const { authenticateJWT } = require('../middleware/auth.middleware');
const { authAdmin } = require('../middleware/role.middleware')

router.post('/addorder', authenticateJWT, crerateOrder, errorHandler);
router.get('/getorder', authenticateJWT, getOrder, errorHandler);
router.get('/getmyorder', authenticateJWT, getMyOrder, errorHandler);
router.get('/getorderbyid/:id', authenticateJWT, getOrderById, errorHandler);
router.put('/editorder/:id', authenticateJWT, authAdmin, editOrder, errorHandler);
router.delete('/deleteorder/:id', authenticateJWT, authAdmin, deleteOrder, errorHandler);


module.exports = router;