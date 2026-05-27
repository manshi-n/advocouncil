const Appointment = require('../models/Appointment');
const Lawyer = require('../models/Lawyer');

exports.bookAppointment = async (req, res) => {
  try {
    const { lawyerId, date, time, caseType, notes } = req.body;

    if (req.user.userType !== 'customer') {
      return res.status(403).json({ success: false, message: 'Only customers can book appointments' });
    }

    if (!lawyerId || !date || !time) {
      return res.status(400).json({ success: false, message: 'Lawyer, date and time are required' });
    }

    const lawyer = await Lawyer.findById(lawyerId);
    if (!lawyer) return res.status(404).json({ success: false, message: 'Lawyer not found' });

    const appointment = await Appointment.create({
      customer: req.user.id,
      lawyer: lawyer._id,
      lawyerUser: lawyer.user,
      lawyerName: lawyer.name,
      lawyerEmail: lawyer.email,
      lawyerPhone: lawyer.phone,
      customerName: req.user.fullName,
      customerEmail: req.user.email,
      customerPhone: req.user.phone || '',
      date: new Date(date),
      time,
      caseType,
      caseDetails: notes || '',
      totalAmount: lawyer.hourlyRate,
      paymentStatus: 'Unpaid',
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Appointment request sent to lawyer. Pay only after the lawyer approves it.',
      data: appointment
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyAppointments = async (req, res) => {
  try {
    const query = req.user.userType === 'lawyer' ? { lawyerUser: req.user.id } : { customer: req.user.id };
    const appointments = await Appointment.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getLawyerAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ lawyerUser: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    const isCustomer = String(appointment.customer) === String(req.user.id);
    const isLawyer = String(appointment.lawyerUser) === String(req.user.id);
    if (!isCustomer && !isLawyer && req.user.userType !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not allowed to view this appointment' });
    }
    res.json({ success: true, data: appointment });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status, lawyerMessage } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    if (String(appointment.lawyerUser) !== String(req.user.id)) return res.status(403).json({ success: false, message: 'Not your appointment' });

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Lawyer can only approve or reject appointment requests here' });
    }

    if (appointment.status !== 'Pending') {
      return res.status(400).json({ success: false, message: 'Only pending appointment requests can be updated by lawyer' });
    }

    appointment.status = status;
    appointment.lawyerMessage = lawyerMessage || (status === 'Approved' ? 'Approved. Please complete payment to confirm appointment.' : 'Sorry, appointment request was declined.');
    if (status === 'Rejected') appointment.paymentStatus = 'Unpaid';

    await appointment.save();
    res.json({ success: true, message: `Appointment ${status.toLowerCase()}`, data: appointment });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    if (String(appointment.customer) !== String(req.user.id)) return res.status(403).json({ success: false, message: 'Not your appointment' });
    if (appointment.paymentStatus === 'Paid') return res.status(400).json({ success: false, message: 'Paid appointment cannot be cancelled here' });
    appointment.status = 'Cancelled';
    await appointment.save();
    res.json({ success: true, message: 'Appointment cancelled' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
