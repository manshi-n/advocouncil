const Razorpay = require('razorpay');
const crypto = require('crypto');

const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');

/* =========================
   RAZORPAY INSTANCE
========================= */

function getRazorpay() {

  if (
    !process.env.RAZORPAY_KEY_ID ||
    !process.env.RAZORPAY_KEY_SECRET ||
    process.env.RAZORPAY_KEY_ID === 'YOUR_KEY' ||
    process.env.RAZORPAY_KEY_SECRET === 'YOUR_SECRET'
  ) {

    throw new Error(
      'Add real Razorpay keys in backend/.env'
    );

  }

  return new Razorpay({

    key_id: process.env.RAZORPAY_KEY_ID,

    key_secret: process.env.RAZORPAY_KEY_SECRET

  });

}

/* =========================
   CREATE PAYMENT ORDER
========================= */

exports.createOrder = async (req, res) => {

  try {

    const { appointmentId } = req.body;

    if (!appointmentId) {

      return res.status(400).json({

        success: false,

        message: 'appointmentId is required'

      });

    }

    const appointment =
      await Appointment.findById(appointmentId);

    if (!appointment) {

      return res.status(404).json({

        success: false,

        message: 'Appointment not found'

      });

    }

    /* =========================
       CUSTOMER CHECK
    ========================= */

    if (
      !req.user ||
      String(appointment.customer)
      !== String(req.user.id)
    ) {

      return res.status(403).json({

        success: false,

        message:
          'You can pay only for your appointment'

      });

    }

    /* =========================
       APPROVAL CHECK
    ========================= */

    if (
      appointment.status !== 'Approved'
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Lawyer must approve appointment first'

      });

    }

    /* =========================
       ALREADY PAID CHECK
    ========================= */

    if (
      appointment.paymentStatus === 'Paid'
    ) {

      return res.status(400).json({

        success: false,

        message:
          'Appointment already paid'

      });

    }

    /* =========================
       AMOUNT
    ========================= */

    const amount = Number(
      appointment.totalAmount ||
      appointment.amount ||
      appointment.fee ||
      500
    );

    if (!amount || amount <= 0) {

      return res.status(400).json({

        success: false,

        message:
          'Invalid payment amount'

      });

    }

    /* =========================
       CREATE RAZORPAY ORDER
    ========================= */

    const razorpay = getRazorpay();

    const order =
      await razorpay.orders.create({

        amount:
          Math.round(amount * 100),

        currency: 'INR',

        receipt:
          `rcpt_${Date.now()
            .toString()
            .slice(-10)}`

      });

    /* =========================
       SAVE APPOINTMENT
    ========================= */

    appointment.paymentStatus =
      'Created';

    appointment.razorpayOrderId =
      order.id;

    await appointment.save();

    /* =========================
       CREATE PAYMENT RECORD
    ========================= */

    await Payment.create({

      appointment:
        appointment._id,

      customer:
        appointment.customer,

      lawyer:
        appointment.lawyer,

      amount,

      razorpayOrderId:
        order.id,

      status: 'created'

    });

    /* =========================
       RESPONSE
    ========================= */

    res.status(200).json({

      success: true,

      key:
        process.env.RAZORPAY_KEY_ID,

      order,

      appointment

    });

  }

  catch (err) {

    console.log(
      'PAYMENT CREATE ORDER ERROR:',
      err
    );

    console.log(
      'ERROR MESSAGE:',
      err.message
    );

    res.status(500).json({

      success: false,

      message:
        err.message ||
        'Payment order failed'

    });

  }

};

/* =========================
   VERIFY PAYMENT
========================= */

exports.verifyPayment = async (req, res) => {

  try {

    const {

      appointmentId,

      razorpay_order_id,

      razorpay_payment_id,

      razorpay_signature

    } = req.body;

    if (

      !appointmentId ||

      !razorpay_order_id ||

      !razorpay_payment_id ||

      !razorpay_signature

    ) {

      return res.status(400).json({

        success: false,

        message:
          'Missing payment verification data'

      });

    }

    const appointment =
      await Appointment.findById(
        appointmentId
      );

    if (!appointment) {

      return res.status(404).json({

        success: false,

        message:
          'Appointment not found'

      });

    }

    /* =========================
       VERIFY SIGNATURE
    ========================= */

    const expectedSignature =
      crypto

        .createHmac(
          'sha256',
          process.env.RAZORPAY_KEY_SECRET
        )

        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )

        .digest('hex');

    if (
      expectedSignature
      !== razorpay_signature
    ) {

      appointment.paymentStatus =
        'Failed';

      await appointment.save();

      await Payment.findOneAndUpdate(

        {
          razorpayOrderId:
            razorpay_order_id
        },

        {
          status: 'failed'
        }

      );

      return res.status(400).json({

        success: false,

        message:
          'Payment verification failed'

      });

    }

    /* =========================
       SUCCESS PAYMENT
    ========================= */

    appointment.paymentStatus =
      'Paid';

    appointment.paymentId =
      razorpay_payment_id;

    appointment.razorpayOrderId =
      razorpay_order_id;

    appointment.razorpaySignature =
      razorpay_signature;

    appointment.status =
      'Confirmed';

    await appointment.save();

    /* =========================
       UPDATE PAYMENT RECORD
    ========================= */

    await Payment.findOneAndUpdate(

      {
        razorpayOrderId:
          razorpay_order_id
      },

      {

        razorpayPaymentId:
          razorpay_payment_id,

        razorpaySignature:
          razorpay_signature,

        status: 'paid'

      }

    );

    res.status(200).json({

      success: true,

      message:
        'Payment successful. Appointment confirmed.',

      appointment

    });

  }

  catch (err) {

    console.log(
      'PAYMENT VERIFY ERROR:',
      err
    );

    console.log(
      'ERROR MESSAGE:',
      err.message
    );

    res.status(500).json({

      success: false,

      message:
        err.message ||
        'Payment verification failed'

    });

  }

};