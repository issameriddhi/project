const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware for authentication

// Create a new product (only for sellers)
router.post('/', productController.createProduct);


// Get all products (optional)
router.get('/', productController.getAllProducts);

// Get products by category with image URLs
router.get('/category/:category', productController.getProductsByCategory);

// Get products by specific seller
router.get('/seller/:sellerId', productController.getProductsBySeller);

module.exports = router;
