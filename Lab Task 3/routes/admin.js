// ─────────────────────────────────────────────────────────
// routes/admin.js — Admin Panel Routes
// All routes prefixed with /admin (mounted in server.js)
// ─────────────────────────────────────────────────────────

const express    = require('express');
const router     = express.Router();
const upload     = require('../config/multer');
const adminCtrl  = require('../controllers/adminController');

// ── Dashboard ─────────────────────────────────────────────
// GET /admin
router.get('/', adminCtrl.getDashboard);

// ── Doctor List ───────────────────────────────────────────
// GET /admin/doctors
router.get('/doctors', adminCtrl.getDoctors);

// ── Add Doctor ────────────────────────────────────────────
// GET  /admin/doctors/new  → render form
// POST /admin/doctors      → save to DB (with image upload)
router.get('/doctors/new', adminCtrl.getAddDoctor);
router.post('/doctors', upload.single('image'), adminCtrl.postAddDoctor);

// ── Edit Doctor ───────────────────────────────────────────
// GET /admin/doctors/:id/edit  → render form with existing data
// PUT /admin/doctors/:id       → save updated data (method-override)
router.get('/doctors/:id/edit', adminCtrl.getEditDoctor);
router.put('/doctors/:id', upload.single('image'), adminCtrl.putDoctor);

// ── Delete Doctor ─────────────────────────────────────────
// DELETE /admin/doctors/:id   (method-override from form)
router.delete('/doctors/:id', adminCtrl.deleteDoctor);

module.exports = router;
