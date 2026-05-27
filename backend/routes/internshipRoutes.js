const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const ctrl = require('../controllers/internshipController');

router.get('/', ctrl.getInternships);
router.get('/my-posts', protect, ctrl.getMyPostedInternships);
router.get('/my-applications', protect, ctrl.getMyApplications);
router.get('/applicants', protect, ctrl.getApplicantsForLawyer);
router.post('/', protect, ctrl.createInternship);
router.post('/:id/apply', protect, upload.single('resume'), ctrl.applyInternship);
router.put('/applications/:id/status', protect, ctrl.updateApplicationStatus);

module.exports = router;
