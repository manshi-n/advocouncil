const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Lawyer = require('../models/Lawyer');
const Appointment = require('../models/Appointment');
const Internship = require('../models/Internship');
const InternshipApplication = require('../models/InternshipApplication');
const Payment = require('../models/Payment');

router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
  try {
    const [users, lawyers, appointments, internships, applications, payments] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }),
      Lawyer.find().sort({ createdAt: -1 }),
      Appointment.find().sort({ createdAt: -1 }),
      Internship.find().sort({ createdAt: -1 }),
      InternshipApplication.find().populate('internship').sort({ createdAt: -1 }),
      Payment.find().sort({ createdAt: -1 })
    ]);
    res.json({ success: true, users, lawyers, appointments, internships, applications, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
