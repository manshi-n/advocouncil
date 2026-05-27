const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lawyer: { type: mongoose.Schema.Types.ObjectId, ref: 'Lawyer' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
