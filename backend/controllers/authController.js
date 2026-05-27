const User = require('../models/User');
const Lawyer = require('../models/Lawyer');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'advocouncilsecret', { expiresIn: process.env.JWT_EXPIRE || '7d' });

function safeUser(user) {
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    userType: user.userType,
    phone: user.phone || '',
    bio: user.bio || '',
    resume: user.resume || '',
    profilePicture: user.profilePicture || '',
    linkedin: user.linkedin || '',
    skills: user.skills || [],
    education: user.education || ''
  };
}

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, userType, phone, bio, specialization, experience, location, hourlyRate } = req.body;
    if (!fullName || !email || !password || !userType) return res.status(400).json({ success: false, message: 'Full name, email, password and portal are required' });
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'User already exists' });

    const user = await User.create({ fullName, email, password, userType, phone, bio });

    if (userType === 'lawyer') {
      await Lawyer.create({
        user: user._id,
        name: fullName,
        email,
        phone: phone || '',
        specialization: specialization || 'General Law',
        description: bio || 'Verified lawyer on AdvoCouncil.',
        fullBio: bio || 'Verified lawyer on AdvoCouncil.',
        experience: Number(experience) || 1,
        location: location || 'India',
        hourlyRate: Number(hourlyRate) || 1000,
        casesWon: 0,
        totalCases: 0,
        image: user.profilePicture || ''
      });
    }

    const token = generateToken(user._id);
    res.status(201).json({ success: true, token, user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    if (userType && user.userType !== userType) return res.status(403).json({ success: false, message: `This account is ${user.userType}, not ${userType}` });
    res.json({ success: true, token: generateToken(user._id), user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, user: safeUser(req.user) });
};

exports.updateMe = async (req, res) => {
  try {
    const allowed = ['fullName', 'phone', 'bio', 'linkedin', 'education', 'skills', 'profilePicture'];
    const update = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true, runValidators: true });
    if (user.userType === 'lawyer') {
      await Lawyer.findOneAndUpdate({ user: user._id }, {
        name: user.fullName,
        phone: user.phone,
        description: user.bio,
        fullBio: user.bio,
        image: user.profilePicture
      }, { new: true });
    }
    res.json({ success: true, user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No profile photo selected' });
    const profilePicture = req.file.path.replace(/\\/g, '/');
    const user = await User.findByIdAndUpdate(req.user.id, { profilePicture }, { new: true, runValidators: true });

    if (user.userType === 'lawyer') {
      await Lawyer.findOneAndUpdate({ user: user._id }, { image: profilePicture }, { new: true });
    }

    res.json({ success: true, message: 'Profile photo uploaded successfully', user: safeUser(user), profilePicture });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.logout = async (req, res) => res.json({ success: true, message: 'Logged out successfully' });
