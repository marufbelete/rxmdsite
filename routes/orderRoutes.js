const express = require('express');
const jwt = require('jsonwebtoken');
const OrderController = require('../controllers/orderController');

const router = express.Router();

router.get('/getOrders', (req, res) => {
  const token = req.headers.authorization;

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (decoded) {
      return OrderController.getAllOrders(req, res);
    }

    return res.status(401).json({ message: 'Unauthorized' });
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

router.post('/newOrder', (req, res) => {
  const token = req.headers.authorization;

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (decoded) {
      return OrderController.createOrder(req, res);
    }

    return res.status(401).json({ message: 'Unauthorized' });
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

router.delete('/:id', (req, res) => {
  const token = req.headers.authorization;

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (decoded) {
      return OrderController.deleteOrder(req, res);
    }

    return res.status(401).json({ message: 'Unauthorized' });
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

module.exports = router;
