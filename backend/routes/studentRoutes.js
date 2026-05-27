const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const User = require('../models/User');
const InternshipApplication = require('../models/InternshipApplication');

router.post('/upload-resume', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No resume selected' });
    const user = await User.findByIdAndUpdate(req.user.id, { resume: req.file.path.replace(/\\/g, '/') }, { new: true });
    res.json({ success: true, message: 'Resume uploaded successfully', resume: user.resume, user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/dashboard', protect, async (req, res) => {
  try {
    const applications = await InternshipApplication.find({ student: req.user.id }).populate('internship').sort({ createdAt: -1 });
    res.json({ success: true, user: req.user, applications });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
