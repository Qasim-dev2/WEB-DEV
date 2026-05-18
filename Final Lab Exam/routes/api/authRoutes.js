// routes/api/authRoutes.js
// POST /api/v1/auth/register
// POST /api/v1/auth/login
const express = require('express');
const router  = express.Router();
const { register, login } = require('../../controllers/api/authController');

// Public routes — no token required
router.post('/register', register);
router.post('/login',    login);

module.exports = router;
