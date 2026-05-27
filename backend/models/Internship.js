const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  lawyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lawyerProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Lawyer' },
  lawyerName: { type: String, required: true },
  lawyerEmail: { type: String, default: '' },
  lawyerPhone: { type: String, default: '' },
  title: { type: String, required: true },
  field: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, default: '3 Months' },
  stipend: { type: Number, default: 0 },
  location: { type: String, default: 'Remote' },
  skillsRequired: [{ type: String }],
  isOpen: { type: Boolean, default: true },
  applicantsCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Internship', internshipSchema);
