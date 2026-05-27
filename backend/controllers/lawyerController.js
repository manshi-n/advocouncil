const Lawyer = require('../models/Lawyer');
const Appointment = require('../models/Appointment');
const Internship = require('../models/Internship');
const InternshipApplication = require('../models/InternshipApplication');

exports.getLawyers = async (req, res) => {
  try {
    const { search = '', specialization = 'all' } = req.query;
    const q = { isAvailable: true };
    if (specialization && specialization !== 'all') q.specialization = specialization;
    if (search) q.$or = [
      { name: new RegExp(search, 'i') },
      { specialization: new RegExp(search, 'i') },
      { location: new RegExp(search, 'i') }
    ];
    const lawyers = await Lawyer.find(q).sort({ rating: -1, createdAt: -1 });
    res.json({ success: true, count: lawyers.length, data: lawyers });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getLawyerById = async (req, res) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id);
    if (!lawyer) return res.status(404).json({ success: false, message: 'Lawyer not found' });
    res.json({ success: true, data: lawyer });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getMyLawyerProfile = async (req, res) => {
  try {
    let lawyer = await Lawyer.findOne({ user: req.user.id });
    if (!lawyer && req.user.userType === 'lawyer') {
      lawyer = await Lawyer.create({ user: req.user.id, name: req.user.fullName, email: req.user.email, phone: req.user.phone || '', specialization: 'General Law', description: req.user.bio || '', fullBio: req.user.bio || '', experience: 1, location: 'India', hourlyRate: 1000 });
    }
    if (!lawyer) return res.status(404).json({ success: false, message: 'Lawyer profile not found' });
    const [appointments, internships, applications] = await Promise.all([
      Appointment.find({ lawyer: lawyer._id }).sort({ createdAt: -1 }),
      Internship.find({ lawyer: req.user.id }).sort({ createdAt: -1 }),
      InternshipApplication.find({ lawyer: req.user.id }).populate('internship').sort({ createdAt: -1 })
    ]);
    res.json({ success: true, lawyer, appointments, internships, applications });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateMyLawyerProfile = async (req, res) => {
  try {
    const allowed = ['name', 'specialization', 'description', 'fullBio', 'experience', 'location', 'hourlyRate', 'phone', 'image'];
    const update = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
    const lawyer = await Lawyer.findOneAndUpdate({ user: req.user.id }, update, { new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true });
    res.json({ success: true, data: lawyer });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createLawyer = async (req, res) => {
  try { const lawyer = await Lawyer.create(req.body); res.status(201).json({ success: true, data: lawyer }); }
  catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
exports.updateLawyer = async (req, res) => {
  try { const lawyer = await Lawyer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); res.json({ success: true, data: lawyer }); }
  catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
exports.deleteLawyer = async (req, res) => {
  try { await Lawyer.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
