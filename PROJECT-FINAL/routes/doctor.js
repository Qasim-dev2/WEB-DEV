// routes/doctor.js — Doctor Dashboard Routes
const express    = require('express');
const router     = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const isDoctor   = require('../middleware/isDoctor');
const doctorCtrl = require('../controllers/doctorDashboardController');

router.use(isLoggedIn, isDoctor);

router.get('/dashboard',                        doctorCtrl.getDashboard);
router.get('/appointments',                     doctorCtrl.getAppointments);
router.post('/appointments/:id/status',          doctorCtrl.updateAppointmentStatus);
router.get('/profile',                           doctorCtrl.getProfile);

module.exports = router;
