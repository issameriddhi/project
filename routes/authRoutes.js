// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);
router.post('/send-reset-token', authController.sendResetToken);
router.post('/check-reset-token', authController.checkResetToken);
router.post('/reset-password', authController.resetPassword);
module.exports = router;

