// routes/api/appointmentRoutes.js
// All routes require a valid JWT
// GET  /api/v1/appointments        — admin only  (all)
// POST /api/v1/appointments        — any auth user (book)
// GET  /api/v1/appointments/my     — any auth user (own)
// PUT  /api/v1/appointments/:id/status — admin only
const express     = require('express');
const router      = express.Router();
const ctrl        = require('../../controllers/api/appointmentController');
const verifyToken = require('../../middleware/verifyToken');
const isAdmin     = require('../../middleware/isAdminJwt');

// Every appointment route requires login
router.use(verifyToken);

// NOTE: /my must be declared before /:id/status to avoid Express treating
//       "my" as an :id param — the order matters here.
router.get('/my',            ctrl.getMyAppointments);
router.post('/',             ctrl.bookAppointment);
router.get('/',    isAdmin,  ctrl.getAllAppointments);
router.put('/:id/status', isAdmin, ctrl.updateAppointmentStatus);

module.exports = router;
