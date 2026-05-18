// routes/patient.js — Patient Dashboard Routes
const express         = require('express');
const router          = express.Router();
const isLoggedIn      = require('../middleware/isLoggedIn');
const isPatient       = require('../middleware/isPatient');
const patientCtrl     = require('../controllers/patientController');

// All patient routes require login AND patient/customer role
router.use(isLoggedIn, isPatient);

router.get('/dashboard', patientCtrl.getDashboard);

module.exports = router;
