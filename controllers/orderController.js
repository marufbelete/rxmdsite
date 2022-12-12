const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
<<<<<<< HEAD
const Order = require("../models/orderModel")
=======
const Order = require("../models/orderModel").default;
>>>>>>> e39ae32c8a3f08b103cc73b623744cbe52f9be25
require("dotenv").config();

router.post("/create", (req, res) => {
  // Verify JWT token
  jwt.verify(req.body.token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      // Create new order
      Order.create({
        userId: decoded.userId,
        productId: req.body.productId,
        quantity: req.body.quantity,
      })
        .then((order) => res.json(order))
        .catch((err) => res.status(500).json({ message: err.message }));
    }
  });
});

router.get("/:id", (req, res) => {
  // Verify JWT token
  jwt.verify(req.body.token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      // Find order by id
      Order.findByPk(req.params.id)
        .then((order) => {
          // Check if user has permission to view order
          if (order.userId === decoded.userId) {
            res.json(order);
          } else {
            res.status(403).json({ message: "Forbidden" });
          }
        })
        .catch((err) => res.status(500).json({ message: err.message }));
    }
  });
});

module.exports = router;
