const express = require('express');
const { updateProfile, getUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.get('/', protect, authorize('admin'), getUsers);

module.exports = router;