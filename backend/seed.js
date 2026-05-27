require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Lawyer = require('./models/Lawyer');
const Internship = require('./models/Internship');

async function upsertUser({ fullName, email, password, userType, phone, bio }) {
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ fullName, email, password, userType, phone, bio });
  }
  return user;
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected for seeding');
  const lawyers = [
    { fullName: 'Adv. Rahul Sharma', email: 'rahul@advocouncil.com', phone: '9876543210', specialization: 'Criminal Law', experience: 12, location: 'Delhi', hourlyRate: 2500, casesWon: 120, totalCases: 150, bio: 'Senior criminal lawyer handling bail, trial and criminal defence matters.' },
    { fullName: 'Adv. Priya Mehta', email: 'priya@advocouncil.com', phone: '9876501234', specialization: 'Corporate Law', experience: 8, location: 'Mumbai', hourlyRate: 3500, casesWon: 95, totalCases: 110, bio: 'Corporate counsel for contracts, compliance, company disputes and startups.' },
    { fullName: 'Adv. Arjun Verma', email: 'arjun@advocouncil.com', phone: '9876512345', specialization: 'Cyber Law', experience: 10, location: 'Bangalore', hourlyRate: 3000, casesWon: 88, totalCases: 102, bio: 'Cyber law expert for fraud, privacy, IT Act and digital evidence matters.' },
    { fullName: 'Adv. Neha Kapoor', email: 'neha@advocouncil.com', phone: '9876599999', specialization: 'Family Law', experience: 7, location: 'Chandigarh', hourlyRate: 2000, casesWon: 70, totalCases: 82, bio: 'Family lawyer for divorce, maintenance, custody and mediation.' }
  ];
  for (const l of lawyers) {
    const user = await upsertUser({ fullName: l.fullName, email: l.email, password: 'password123', userType: 'lawyer', phone: l.phone, bio: l.bio });
    const prof = await Lawyer.findOneAndUpdate({ email: l.email }, { user: user._id, name: l.fullName, email: l.email, phone: l.phone, specialization: l.specialization, experience: l.experience, location: l.location, hourlyRate: l.hourlyRate, casesWon: l.casesWon, totalCases: l.totalCases, description: l.bio, fullBio: l.bio, rating: 4.7 }, { upsert: true, new: true, setDefaultsOnInsert: true });
    await Internship.findOneAndUpdate({ lawyer: user._id, title: `${l.specialization} Internship` }, { lawyer: user._id, lawyerProfile: prof._id, lawyerName: prof.name, lawyerEmail: prof.email, lawyerPhone: prof.phone, title: `${l.specialization} Internship`, field: l.specialization, description: `Work with ${prof.name} on research, drafting, case studies and client notes.`, duration: '2 Months', stipend: l.specialization === 'Corporate Law' ? 5000 : 3000, location: prof.location, skillsRequired: ['Research', 'Drafting', 'Communication'] }, { upsert: true, new: true });
  }
  await upsertUser({ fullName: 'Admin User', email: 'admin@demo.com', password: 'password123', userType: 'admin', phone: '7777777777', bio: 'Admin demo account' });
  await upsertUser({ fullName: 'Demo Customer', email: 'customer@demo.com', password: 'password123', userType: 'customer', phone: '9999999999', bio: 'Customer demo account' });
  await upsertUser({ fullName: 'Demo Student', email: 'student@demo.com', password: 'password123', userType: 'student', phone: '8888888888', bio: 'Aspiring legal intern' });
  console.log('Seed complete. Demo password for all demo accounts: password123');
  await mongoose.disconnect();
}
run().catch(err => { console.error(err); process.exit(1); });
