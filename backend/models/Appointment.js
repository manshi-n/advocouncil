const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lawyer: { type: mongoose.Schema.Types.ObjectId, ref: 'Lawyer', required: true },
  lawyerUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lawyerName: { type: String, required: true },
  lawyerEmail: { type: String, default: '' },
  lawyerPhone: { type: String, default: '' },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, default: '' },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  caseType: { type: String, default: 'General' },
  caseDetails: { type: String, default: '' },

  // Correct customer flow:
  // Pending = customer requested, waiting for lawyer
  // Approved = lawyer approved, waiting for customer payment
  // Confirmed = payment successful, appointment confirmed
  // Rejected = lawyer declined
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Confirmed', 'Rejected', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  lawyerMessage: { type: String, default: '' },
  paymentStatus: { type: String, enum: ['Unpaid', 'Created', 'Paid', 'Failed'], default: 'Unpaid' },
  paymentId: { type: String, default: '' },
  razorpayOrderId: { type: String, default: '' },
  razorpaySignature: { type: String, default: '' },
  currency: { type: String, default: 'INR' },
  totalAmount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
