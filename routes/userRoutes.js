// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register route
router.get('/:username', userController.fetchUserData);
router.put('/:username', userController.updateUserData);

// Login route

module.exports = router;
