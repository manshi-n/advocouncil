const mongoose = require('mongoose');

const internshipApplicationSchema = new mongoose.Schema({
  internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
  lawyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  studentPhone: { type: String, default: '' },
  resume: { type: String, required: true },
  message: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  lawyerMessage: { type: String, default: '' },
  lawyerContact: { type: String, default: '' }
}, { timestamps: true });

internshipApplicationSchema.index({ internship: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('InternshipApplication', internshipApplicationSchema);
