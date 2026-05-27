const Internship = require('../models/Internship');
const InternshipApplication = require('../models/InternshipApplication');
const Lawyer = require('../models/Lawyer');
const User = require('../models/User');

exports.createInternship = async (req, res) => {
  try {
    if (req.user.userType !== 'lawyer') return res.status(403).json({ success: false, message: 'Only lawyers can post internships' });
    const lawyerProfile = await Lawyer.findOne({ user: req.user.id });
    const { title, field, description, duration, stipend, location, skillsRequired } = req.body;
    const internship = await Internship.create({
      lawyer: req.user.id,
      lawyerProfile: lawyerProfile?._id,
      lawyerName: lawyerProfile?.name || req.user.fullName,
      lawyerEmail: req.user.email,
      lawyerPhone: lawyerProfile?.phone || req.user.phone || '',
      title,
      field,
      description,
      duration,
      stipend: Number(stipend) || 0,
      location,
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : String(skillsRequired || '').split(',').map(s => s.trim()).filter(Boolean)
    });
    res.status(201).json({ success: true, message: 'Internship posted', data: internship });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getInternships = async (req, res) => {
  try {
    const { search = '', field = 'all' } = req.query;
    const q = { isOpen: true };
    if (field && field !== 'all') q.field = field;
    if (search) q.$or = [
      { title: new RegExp(search, 'i') },
      { lawyerName: new RegExp(search, 'i') },
      { field: new RegExp(search, 'i') },
      { location: new RegExp(search, 'i') }
    ];
    const data = await Internship.find(q).sort({ createdAt: -1 });
    res.json({ success: true, count: data.length, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getMyPostedInternships = async (req, res) => {
  try {
    const data = await Internship.find({ lawyer: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: data.length, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.applyInternship = async (req, res) => {
  try {
    if (req.user.userType !== 'student') return res.status(403).json({ success: false, message: 'Only students can apply' });
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ success: false, message: 'Internship not found' });

    let resumePath = req.file ? req.file.path.replace(/\\/g, '/') : req.user.resume;
    if (!resumePath) return res.status(400).json({ success: false, message: 'Please upload/select a resume before applying' });
    if (req.file) await User.findByIdAndUpdate(req.user.id, { resume: resumePath });

    const application = await InternshipApplication.create({
      internship: internship._id,
      lawyer: internship.lawyer,
      student: req.user.id,
      studentName: req.user.fullName,
      studentEmail: req.user.email,
      studentPhone: req.user.phone || '',
      resume: resumePath,
      message: req.body.message || ''
    });
    internship.applicantsCount += 1;
    await internship.save();
    res.status(201).json({ success: true, message: 'Application sent to lawyer', data: application });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'You already applied for this internship' });
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const data = await InternshipApplication.find({ student: req.user.id }).populate('internship').sort({ createdAt: -1 });
    res.json({ success: true, count: data.length, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getApplicantsForLawyer = async (req, res) => {
  try {
    const data = await InternshipApplication.find({ lawyer: req.user.id }).populate('internship').sort({ createdAt: -1 });
    res.json({ success: true, count: data.length, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, lawyerMessage, lawyerContact } = req.body;
    const app = await InternshipApplication.findById(req.params.id).populate('internship');
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    if (String(app.lawyer) !== String(req.user.id)) return res.status(403).json({ success: false, message: 'Not your applicant' });
    app.status = status;
    app.lawyerMessage = lawyerMessage || '';
    app.lawyerContact = lawyerContact || req.user.phone || '';
    await app.save();
    res.json({ success: true, message: 'Application updated', data: app });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
