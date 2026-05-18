// routes/api/doctorRoutes.js
// GET    /api/v1/doctors         — public
// GET    /api/v1/doctors/:id     — public
// POST   /api/v1/doctors         — admin only
// PUT    /api/v1/doctors/:id     — admin only
// DELETE /api/v1/doctors/:id     — admin only
const express     = require('express');
const router      = express.Router();
const ctrl        = require('../../controllers/api/doctorController');
const verifyToken = require('../../middleware/verifyToken');
const isAdmin     = require('../../middleware/isAdminJwt');

// Public
router.get('/',    ctrl.getAllDoctors);
router.get('/:id', ctrl.getDoctorById);

// Admin-protected
router.post('/',    verifyToken, isAdmin, ctrl.createDoctor);
router.put('/:id',  verifyToken, isAdmin, ctrl.updateDoctor);
router.delete('/:id', verifyToken, isAdmin, ctrl.deleteDoctor);

module.exports = router;
