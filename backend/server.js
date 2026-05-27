require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const lawyerRoutes = require('./routes/lawyerRoutes');
const studentRoutes = require('./routes/studentRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });

const app = express();
connectDB();
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/lawyers', lawyerRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.json({ success: true, message: 'AdvoCouncil backend running' }));
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ success: false, message: err.message || 'Internal Server Error' }); });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
