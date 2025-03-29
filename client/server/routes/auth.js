const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

// Auth routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/user', protect, getMe);

module.exports = router; 