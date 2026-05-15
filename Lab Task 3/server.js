// ─────────────────────────────────────────────────────────
// server.js — Main entry point for Multisensa Rehabilitation
// Assignment 4: Admin Management System
// ─────────────────────────────────────────────────────────

// Step 1: Load .env variables FIRST
require('dotenv').config();

// Step 2: Import required packages
const express        = require('express');
const path           = require('path');
const session        = require('express-session');
const flash          = require('connect-flash');
const methodOverride = require('method-override');
const connectDB      = require('./config/db');
const doctorsRouter  = require('./routes/doctors');
const adminRouter    = require('./routes/admin');

// Step 3: Connect to MongoDB
connectDB();

// Step 4: Create Express application
const app = express();

// Step 5: Set EJS as view engine and set views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Step 6: Serve static files from 'public' folder
// This makes /css, /js, /uploads accessible as static assets
app.use(express.static(path.join(__dirname, 'public')));

// Step 7: Parse URL-encoded form data (for forms)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Step 8: Method-override — allows PUT/DELETE from HTML forms
// Usage: add ?_method=PUT or hidden <input name="_method" value="DELETE">
app.use(methodOverride('_method'));

// Step 9: Session (required for flash messages)
app.use(session({
    secret           : process.env.SESSION_SECRET || 'multisensa-rehab-secret-2024',
    resave           : false,
    saveUninitialized: false,
    cookie           : { maxAge: 60 * 60 * 1000 }, // 1 hour
}));

// Step 10: Flash messages middleware
app.use(flash());

// Step 11: Make flash messages available in ALL EJS views via res.locals
// No need to pass them manually in every render() call
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error   = req.flash('error');
    next();
});

// ─── ROUTES ───────────────────────────────────────────────

// Homepage
app.get('/', (req, res) => {
    res.render('homepage');
});

// Public doctors catalog (Assignment 3 functionality)
app.use('/doctors', doctorsRouter);

// Admin panel — all admin routes under /admin
app.use('/admin', adminRouter);

// 404 catch-all — must be last
app.use((req, res) => {
    res.status(404).send(`
        <div style="text-align:center; font-family:sans-serif; padding:80px 20px;">
            <h2 style="color:#0f766e;">404 — Page Not Found</h2>
            <p style="color:#6b7280;">The page you're looking for doesn't exist.</p>
            <a href="/" style="color:#0f766e; font-weight:600;">← Back to Home</a>
        </div>
    `);
});

// Global error handler (e.g. Multer file-type errors)
app.use((err, req, res, _next) => {
    console.error(err.stack);
    req.flash('error', err.message || 'Something went wrong.');
    res.redirect('back');
});

// ─── START SERVER ─────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅  Server running at  http://localhost:${PORT}`);
    console.log(`👨‍⚕️  Doctors page:     http://localhost:${PORT}/doctors`);
    console.log(`🔧  Admin panel:      http://localhost:${PORT}/admin`);
});
