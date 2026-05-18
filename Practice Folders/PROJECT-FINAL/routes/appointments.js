// routes/appointments.js — Patient-facing appointment booking routes
// All routes require login AND patient/customer role
const express     = require('express');
const router      = express.Router();
const isLoggedIn  = require('../middleware/isLoggedIn');
const isPatient   = require('../middleware/isPatient');
const apptCtrl    = require('../controllers/appointmentController');

// All appointment booking routes require authentication and patient role
router.use(isLoggedIn, isPatient);

// GET  /appointments/book?doctor=:id  → show booking form (optionally pre-selected doctor)
router.get('/book', apptCtrl.getBookingForm);

// POST /appointments                   → submit new appointment
router.post('/', apptCtrl.postBookAppointment);

// POST /appointments/:id/cancel        → patient cancels their own appointment
router.post('/:id/cancel', apptCtrl.cancelAppointment);

module.exports = router;
