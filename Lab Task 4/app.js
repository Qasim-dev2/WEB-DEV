// app.js — Multisensa Rehabilitation Center: JWT REST API (Lab Assignment 4)
// Port: 4000  |  Base URL: /api/v1/
// Separate from server.js (session-based web app on port 3001)
require('dotenv').config();

const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');

const app = express();

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

// ── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet());                        // Sets secure HTTP headers
app.use(cors({
    origin : '*',                         // Allow any origin (restrict in production)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Rate limiting — 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max     : 100,
    message : { success: false, message: 'Too many requests from this IP. Please try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders  : false,
});
app.use('/api/', apiLimiter);

// ── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));           // JSON bodies (prevent large payloads)
app.use(express.urlencoded({ extended: true }));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/v1/auth',         require('./routes/api/authRoutes'));
app.use('/api/v1/doctors',      require('./routes/api/doctorRoutes'));
app.use('/api/v1/appointments', require('./routes/api/appointmentRoutes'));
app.use('/api/v1/user',         require('./routes/api/userRoutes'));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/v1', (req, res) => {
    res.json({
        success  : true,
        message  : 'Multisensa Rehabilitation API',
        version  : '1.0.0',
        status   : 'running',
        endpoints: {
            auth        : { register: 'POST /api/v1/auth/register', login: 'POST /api/v1/auth/login' },
            doctors     : { list: 'GET /api/v1/doctors', single: 'GET /api/v1/doctors/:id' },
            appointments: { book: 'POST /api/v1/appointments', mine: 'GET /api/v1/appointments/my' },
            user        : { profile: 'GET /api/v1/user/profile' },
        },
    });
});

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} does not exist.`,
    });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

// ── Start Server ──────────────────────────────────────────────────────────────
const API_PORT = process.env.API_PORT || 4000;
app.listen(API_PORT, () => {
    console.log('\n════════════════════════════════════════════════');
    console.log('  🚀  Multisensa JWT API  —  Lab Assignment 4');
    console.log('════════════════════════════════════════════════');
    console.log(`  📡  http://localhost:${API_PORT}/api/v1`);
    console.log(`  🔑  POST http://localhost:${API_PORT}/api/v1/auth/login`);
    console.log(`  📝  POST http://localhost:${API_PORT}/api/v1/auth/register`);
    console.log(`  🏥  GET  http://localhost:${API_PORT}/api/v1/doctors`);
    console.log('════════════════════════════════════════════════\n');
});

module.exports = app;
