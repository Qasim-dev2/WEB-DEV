// ─────────────────────────────────────────────────────────
// server.js — Main entry point for Multisensa Rehabilitation
// ─────────────────────────────────────────────────────────

// Step 1: Load .env variables FIRST (before anything else)
require('dotenv').config();

// Step 2: Import required packages
const express = require('express');
const connectDB = require('./config/db');        // MongoDB connection helper
const doctorsRouter = require('./routes/doctors'); // Doctor routes

// Step 3: Connect to MongoDB
connectDB();

// Step 4: Create Express application
const app = express();

// Step 5: Set EJS as the template/view engine
app.set('view engine', 'ejs');

// Step 6: Serve static files (CSS, JS, images) from the 'public' folder
app.use(express.static('public'));

// Step 7: Parse URL-encoded form data (for future forms)
app.use(express.urlencoded({ extended: false }));

// ─── ROUTES ───────────────────────────────────────────────

// Homepage route — renders views/homepage.ejs
app.get('/', (req, res) => {
    res.render('homepage');
});

// Doctors routes — handles /doctors and /doctors/:id
app.use('/doctors', doctorsRouter);

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

// ─── START SERVER ─────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    console.log(`📋 Doctors page:  http://localhost:${PORT}/doctors`);
});
