const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Route to create a new product with image upload
router.post('/', productController.createProduct);

// Route to get all products
router.get('/', productController.getAllProducts);

// Route to get products by category
router.get('/category/:category', productController.getProductsByCategory);

module.exports = router;
