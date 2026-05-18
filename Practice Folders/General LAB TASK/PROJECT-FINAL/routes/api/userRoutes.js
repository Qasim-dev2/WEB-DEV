// routes/api/userRoutes.js
// GET /api/v1/user/profile   — auth user
// PUT /api/v1/user/profile   — auth user
const express     = require('express');
const router      = express.Router();
const ctrl        = require('../../controllers/api/userController');
const verifyToken = require('../../middleware/verifyToken');

router.use(verifyToken);

router.get('/profile', ctrl.getProfile);
router.put('/profile', ctrl.updateProfile);

module.exports = router;
