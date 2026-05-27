const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  userType: { type: String, enum: ['customer', 'lawyer', 'student', 'admin'], default: 'customer' },
  phone: { type: String, default: '' },
  bio: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  resume: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  skills: [{ type: String }],
  education: { type: String, default: '' }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
