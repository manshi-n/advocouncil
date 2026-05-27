const express = require('express');
const router = express.Router();
const { register, login, getMe, updateMe, uploadProfilePicture, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.post('/me/profile-picture', protect, upload.single('profilePicture'), uploadProfilePicture);
router.get('/logout', protect, logout);

module.exports = router;
