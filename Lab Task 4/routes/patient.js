// routes/patient.js — Patient Dashboard Routes
const express         = require('express');
const router          = express.Router();
const isLoggedIn      = require('../middleware/isLoggedIn');
const patientCtrl     = require('../controllers/patientController');

// All patient routes require login; no role restriction (admins can view too)
router.use(isLoggedIn);

router.get('/dashboard', patientCtrl.getDashboard);

module.exports = router;
