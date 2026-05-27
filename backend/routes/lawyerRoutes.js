const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getLawyers, getLawyerById, getMyLawyerProfile, updateMyLawyerProfile, createLawyer, updateLawyer, deleteLawyer } = require('../controllers/lawyerController');

router.get('/', getLawyers);
router.get('/me/dashboard', protect, getMyLawyerProfile);
router.put('/me/profile', protect, updateMyLawyerProfile);
router.get('/:id', getLawyerById);
router.post('/', protect, createLawyer);
router.put('/:id', protect, updateLawyer);
router.delete('/:id', protect, deleteLawyer);

module.exports = router;
