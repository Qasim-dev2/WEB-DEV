// controllers/api/doctorController.js — CRUD + search/filter/sort/paginate
const Doctor = require('../../models/Doctor');

const VALID_CATEGORIES = [
    'Physiotherapist',
    'Psychologist',
    'Orthopedic Specialist',
    'Neurologist',
    'Occupational Therapist',
    'Speech Therapist',
    'Rehabilitation Consultant',
];

// ── GET /api/v1/doctors ───────────────────────────────────────────────────────
// Public — no auth required
// Query: search, category, min, max, sort (low|high|rating), page, limit
exports.getAllDoctors = async (req, res) => {
    try {
        const {
            search   = '',
            category = '',
            min      = '',
            max      = '',
            sort     = '',
            page     = '1',
            limit    = '10',
        } = req.query;

        // Build filter
        const filter = {};
        if (search.trim()) {
            filter.$or = [
                { name        : { $regex: search.trim(), $options: 'i' } },
                { description : { $regex: search.trim(), $options: 'i' } },
            ];
        }
        if (category && VALID_CATEGORIES.includes(category)) {
            filter.category = category;
        }
        if (min || max) {
            filter.charges = {};
            if (min) filter.charges.$gte = parseFloat(min);
            if (max) filter.charges.$lte = parseFloat(max);
        }

        // Sort option
        let sortOption = { createdAt: -1 };
        if (sort === 'low')    sortOption = { charges: 1  };
        if (sort === 'high')   sortOption = { charges: -1 };
        if (sort === 'rating') sortOption = { rating : -1 };
        if (sort === 'name')   sortOption = { name   :  1 };

        // Pagination
        const LIMIT       = Math.min(Math.max(parseInt(limit) || 10, 1), 50);
        const currentPage = Math.max(parseInt(page) || 1, 1);
        const skip        = (currentPage - 1) * LIMIT;

        const [totalDoctors, doctors] = await Promise.all([
            Doctor.countDocuments(filter),
            Doctor.find(filter).sort(sortOption).skip(skip).limit(LIMIT),
        ]);

        const totalPages = Math.ceil(totalDoctors / LIMIT) || 1;

        return res.json({
            success: true,
            message: 'Doctors fetched successfully.',
            data   : doctors,
            pagination: {
                total     : totalDoctors,
                page      : currentPage,
                totalPages,
                limit     : LIMIT,
                hasNext   : currentPage < totalPages,
                hasPrev   : currentPage > 1,
            },
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ── GET /api/v1/doctors/:id ───────────────────────────────────────────────────
// Public
exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found.' });
        }
        return res.json({ success: true, message: 'Doctor fetched successfully.', data: doctor });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid doctor ID format.' });
        }
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ── POST /api/v1/doctors ─ (Admin only) ──────────────────────────────────────
exports.createDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.create(req.body);
        return res.status(201).json({
            success: true,
            message: 'Doctor created successfully.',
            data   : doctor,
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: messages.join(' | ') });
        }
        return res.status(400).json({ success: false, message: err.message });
    }
};

// ── PUT /api/v1/doctors/:id ─ (Admin only) ───────────────────────────────────
exports.updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found.' });
        }
        return res.json({ success: true, message: 'Doctor updated successfully.', data: doctor });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid doctor ID format.' });
        }
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: messages.join(' | ') });
        }
        return res.status(400).json({ success: false, message: err.message });
    }
};

// ── DELETE /api/v1/doctors/:id ─ (Admin only) ────────────────────────────────
exports.deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found.' });
        }
        return res.json({ success: true, message: 'Doctor deleted successfully.', data: null });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid doctor ID format.' });
        }
        return res.status(500).json({ success: false, message: err.message });
    }
};
