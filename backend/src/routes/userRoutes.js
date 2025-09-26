const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, upgradeUserRole } = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Get user profile (protected)
router.get('/profile', auth, getUserProfile);

// Upgrade user role (protected)
router.put('/upgrade', auth, upgradeUserRole);

module.exports = router;