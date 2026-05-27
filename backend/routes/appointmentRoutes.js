const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');

const {
    bookAppointment,
    getMyAppointments,
    getLawyerAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    cancelAppointment
} = require('../controllers/appointmentController');

router.use(protect);

/* =========================
   CREATE APPOINTMENT REQUEST
========================= */
router.post('/', bookAppointment);

/* =========================
   CUSTOMER APPOINTMENTS
   Keep both routes because frontend may call either
========================= */
router.get('/my', getMyAppointments);
router.get('/my-appointments', getMyAppointments);
router.get('/my/requests', getMyAppointments);

/* =========================
   LAWYER APPOINTMENTS
========================= */
router.get('/lawyer/my', getLawyerAppointments);
router.get('/lawyer/appointments', getLawyerAppointments);

/* =========================
   UPDATE STATUS
========================= */
router.put('/:id/status', updateAppointmentStatus);

/* =========================
   CANCEL APPOINTMENT
========================= */
router.delete('/:id', cancelAppointment);

/* =========================
   GET SINGLE APPOINTMENT
   IMPORTANT: generic /:id route must be LAST
========================= */
router.get('/:id', getAppointmentById);

module.exports = router;