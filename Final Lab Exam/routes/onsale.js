// routes/onsale.js — On-Sale Doctors Route
// Mounted in server.js at: app.use('/onsale-doctors', onsaleRoutes)
// Final URL: GET /onsale-doctors

const express          = require('express');
const router           = express.Router();
const doctorController = require('../controllers/doctorController');

// GET /onsale-doctors
// 1. Express receives the request
// 2. Routes to doctorController.getOnSaleDoctors
// 3. Controller runs Mongoose query: Doctor.find({ isOnSale: true })
// 4. Passes ALL matching doctors to EJS template (no backend pagination)
// 5. EJS renders all cards into the DOM
// 6. jQuery then hides/shows 10 at a time — zero extra requests
router.get('/', doctorController.getOnSaleDoctors);

module.exports = router;
