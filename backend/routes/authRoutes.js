const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authValidation } = require('../validations/validation');
const { uploadAvatar } = require('../middleware/upload');

// Public routes
router.post('/register', authValidation.register, authController.register);
router.post('/login', authValidation.login, authController.login);

// Protected routes
router.get('/me', protect, authController.getProfile);
router.put('/profile', protect, authController.updateProfile);
router.post('/avatar', protect, uploadAvatar, authController.uploadAvatar);
router.delete('/avatar', protect, authController.deleteAvatar);

module.exports = router;
