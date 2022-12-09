const express = require('express');
const productController = require('../controllers/productController');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/', (req, res) => {
  // Get all products from the database
  productController.getAllProducts((err, products) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(products);
  });
});

router.get('/:id', (req, res) => {
  // Get a single product by its id
  productController.getProductById(req.params.id, (err, product) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(product);
  });
});

router.post('/', jwt.verify, (req, res) => {
  // Add a new product to the database
  productController.addProduct(req.body, (err, product) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(product);
  });
});

router.put('/:id', jwt.verify, (req, res) => {
  // Update an existing product in the database
  productController.updateProduct(req.params.id, req.body, (err, product) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(product);
  });
});

router.delete('/:id', jwt.verify, (req, res) => {
  // Delete an existing product from the database
  productController.deleteProduct(req.params.id, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.sendStatus(204);
  });
});

module.exports = router;
