const mongoose = require('mongoose');

const lawyerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  specialization: { type: String, required: true, default: 'General Law' },
  description: { type: String, default: '' },
  fullBio: { type: String, default: '' },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  experience: { type: Number, default: 1 },
  location: { type: String, default: 'India' },
  casesWon: { type: Number, default: 0 },
  totalCases: { type: Number, default: 0 },
  hourlyRate: { type: Number, default: 1000 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  image: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true },
  totalReviews: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Lawyer', lawyerSchema);
