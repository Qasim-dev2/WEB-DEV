// routes/admin.js — Admin Panel Routes (ALL protected by isLoggedIn + isAdmin)
const express    = require('express');
const router     = express.Router();
const upload     = require('../config/multer');
const adminCtrl  = require('../controllers/adminController');
const isLoggedIn = require('../middleware/isLoggedIn');
const isAdmin    = require('../middleware/isAdmin');

// Apply auth to every /admin route — must be logged in AND be admin
router.use(isLoggedIn, isAdmin);

// ── Dashboard ─────────────────────────────────────────────
router.get('/', adminCtrl.getDashboard);

// ── Appointment Management ────────────────────────────────
// GET  /admin/appointments              → list all appointments (filter, paginate)
// GET  /admin/appointments/new          → form to create appointment (admin on behalf of patient)
// POST /admin/appointments/create       → submit new appointment
// GET  /admin/appointments/:id          → single appointment detail
// POST /admin/appointments/:id/status   → update appointment status
router.get ('/appointments',               adminCtrl.getAppointments);
router.get ('/appointments/new',           adminCtrl.getCreateAppointment);
router.post('/appointments/create',        adminCtrl.postCreateAppointment);
router.get ('/appointments/:id',           adminCtrl.getAppointmentDetail);
router.post('/appointments/:id/status',    adminCtrl.updateAppointmentStatus);

// ── Doctor List ───────────────────────────────────────────
router.get('/doctors', adminCtrl.getDoctors);

// ── Add Doctor ────────────────────────────────────────────
router.get('/doctors/new', adminCtrl.getAddDoctor);
router.post('/doctors', upload.single('image'), adminCtrl.postAddDoctor);

// ── Edit Doctor ───────────────────────────────────────────
router.get('/doctors/:id/edit', adminCtrl.getEditDoctor);
router.put('/doctors/:id', upload.single('image'), adminCtrl.putDoctor);

// ── Delete Doctor ─────────────────────────────────────────
router.delete('/doctors/:id', adminCtrl.deleteDoctor);

// ── Link / Unlink Doctor ↔ User account ──────────────────
router.post('/doctors/:id/link',   adminCtrl.linkDoctorUser);
router.post('/doctors/:id/unlink', adminCtrl.unlinkDoctorUser);

module.exports = router;
