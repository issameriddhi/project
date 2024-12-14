const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/checkout', orderController.placeOrder);
router.get('/sales/total/:username', orderController.getTotalSales);
router.get('/sales-report/:sellerId', orderController.getSalesReport);

module.exports = router;
