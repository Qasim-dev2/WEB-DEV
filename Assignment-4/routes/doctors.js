// routes/doctors.js
// Handles all routes under /doctors

const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// All 7 specialization categories
const ALL_CATEGORIES = [
    'Physiotherapist',
    'Psychologist',
    'Orthopedic Specialist',
    'Neurologist',
    'Occupational Therapist',
    'Speech Therapist',
    'Rehabilitation Consultant',
];

// ============================================================
// GET /doctors
// Main listing page — search, filter, sort, paginate
// ============================================================
router.get('/', async (req, res) => {
    try {
        // ── Step 1: Extract query parameters from URL ──
        const {
            search   = '',   // ?search=ahmed
            category = '',   // ?category=Physiotherapist
            min      = '',   // ?min=1000
            max      = '',   // ?max=5000
            sort     = '',   // ?sort=low | high | rating
            page     = '1',  // ?page=2
        } = req.query;

        // ── Step 2: Build MongoDB filter object ──
        const filter = {};

        // 2a. Search by doctor name (case-insensitive)
        if (search.trim()) {
            filter.name = { $regex: search.trim(), $options: 'i' };
        }

        // 2b. Filter by category/specialization
        if (category) {
            filter.category = category;
        }

        // 2c. Filter by consultation charges range
        if (min || max) {
            filter.charges = {};
            if (min) filter.charges.$gte = Number(min);
            if (max) filter.charges.$lte = Number(max);
        }

        // ── Step 3: Build sort option ──
        let sortOption = { createdAt: -1 }; // default: newest first
        if (sort === 'low')    sortOption = { charges: 1 };   // lowest price first
        if (sort === 'high')   sortOption = { charges: -1 };  // highest price first
        if (sort === 'rating') sortOption = { rating: -1 };   // best rating first

        // ── Step 4: Pagination setup ──
        const DOCTORS_PER_PAGE = 8;
        const currentPage = Math.max(1, parseInt(page) || 1);
        const skip = (currentPage - 1) * DOCTORS_PER_PAGE;

        // ── Step 5: Run queries in parallel for efficiency ──
        const [totalDoctors, doctors] = await Promise.all([
            Doctor.countDocuments(filter),                          // total count for pagination
            Doctor.find(filter)                                     // actual paginated results
                  .sort(sortOption)
                  .skip(skip)
                  .limit(DOCTORS_PER_PAGE),
        ]);

        // ── Step 6: Calculate total pages ──
        const totalPages = Math.ceil(totalDoctors / DOCTORS_PER_PAGE) || 1;

        // ── Step 7: Render the doctors view with all data ──
        res.render('doctors', {
            doctors,
            categories: ALL_CATEGORIES,
            currentPage,
            totalPages,
            totalDoctors,
            search,
            category,
            min,
            max,
            sort,
        });

    } catch (err) {
        console.error('Error fetching doctors:', err);
        res.status(500).render('error', { message: 'Failed to load doctors. Please try again.' });
    }
});

// ============================================================
// GET /doctors/:id
// Doctor detail / profile page
// ============================================================
router.get('/:id', async (req, res) => {
    try {
        // Find doctor by MongoDB ObjectId
        const doctor = await Doctor.findById(req.params.id);

        // If no doctor found with that ID, return 404
        if (!doctor) {
            return res.status(404).send(`
                <div style="text-align:center;font-family:sans-serif;padding:80px 20px;">
                    <h2>Doctor Not Found</h2>
                    <p>The specialist you are looking for does not exist.</p>
                    <a href="/doctors" style="color:#0f766e;">← Back to Specialists</a>
                </div>
            `);
        }

        // Fetch up to 3 related doctors (same specialization, excluding current)
        const relatedDoctors = await Doctor.find({
            category: doctor.category,
            _id: { $ne: doctor._id },       // $ne = "not equal"
        }).limit(3);

        res.render('doctor-detail', { doctor, relatedDoctors });

    } catch (err) {
        // Handle invalid MongoDB ObjectId format
        if (err.name === 'CastError') {
            return res.status(400).send(`
                <div style="text-align:center;font-family:sans-serif;padding:80px 20px;">
                    <h2>Invalid Doctor ID</h2>
                    <a href="/doctors" style="color:#0f766e;">← Back to Specialists</a>
                </div>
            `);
        }
        console.error('Error fetching doctor detail:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
