// ─────────────────────────────────────────────────────────
// controllers/adminController.js
// Admin Panel CRUD Logic — Multisensa Rehabilitation Center
// ─────────────────────────────────────────────────────────

const Doctor = require('../models/Doctor');
const fs     = require('fs');
const path   = require('path');

// All valid specialization categories
const ALL_CATEGORIES = [
    'Physiotherapist',
    'Psychologist',
    'Orthopedic Specialist',
    'Neurologist',
    'Occupational Therapist',
    'Speech Therapist',
    'Rehabilitation Consultant',
];

// ── Helper: delete a locally uploaded image ───────────────
function deleteLocalImage(imagePath) {
    if (imagePath && imagePath.startsWith('/uploads/')) {
        const fullPath = path.join(__dirname, '../public', imagePath);
        if (fs.existsSync(fullPath)) {
            fs.unlink(fullPath, (err) => {
                if (err) console.warn('Could not delete old image:', err.message);
            });
        }
    }
}

// ─────────────────────────────────────────────────────────
// GET /admin
// Dashboard: stats, recent doctors, category breakdown
// ─────────────────────────────────────────────────────────
exports.getDashboard = async (req, res) => {
    try {
        // Run all queries in parallel for speed
        const [
            totalDoctors,
            recentDoctors,
            categoryStats,
            chargesAgg,
            ratingAgg,
        ] = await Promise.all([
            Doctor.countDocuments(),
            Doctor.find().sort({ createdAt: -1 }).limit(5),
            Doctor.aggregate([
                { $group: { _id: '$category', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            Doctor.aggregate([{ $group: { _id: null, avg: { $avg: '$charges' } } }]),
            Doctor.aggregate([{ $group: { _id: null, avg: { $avg: '$rating'  } } }]),
        ]);

        const avgCharges      = chargesAgg[0] ? Math.round(chargesAgg[0].avg) : 0;
        const avgRating       = ratingAgg[0]  ? ratingAgg[0].avg.toFixed(1)   : '0.0';
        const totalCategories = categoryStats.length;

        res.render('admin/dashboard', {
            totalDoctors,
            totalCategories,
            avgCharges,
            avgRating,
            recentDoctors,
            categoryStats,
        });

    } catch (err) {
        console.error('Dashboard error:', err);
        res.status(500).send('Server error loading dashboard.');
    }
};

// ─────────────────────────────────────────────────────────
// GET /admin/doctors
// List all doctors with search, filter, pagination
// ─────────────────────────────────────────────────────────
exports.getDoctors = async (req, res) => {
    try {
        const { search = '', category = '', page = '1' } = req.query;

        // Build filter
        const filter = {};
        if (search.trim())  filter.name     = { $regex: search.trim(), $options: 'i' };
        if (category)       filter.category = category;

        // Pagination
        const LIMIT       = 10;
        const currentPage = Math.max(1, parseInt(page) || 1);
        const skip        = (currentPage - 1) * LIMIT;

        const [totalDoctors, doctors] = await Promise.all([
            Doctor.countDocuments(filter),
            Doctor.find(filter).sort({ createdAt: -1 }).skip(skip).limit(LIMIT),
        ]);

        const totalPages = Math.ceil(totalDoctors / LIMIT) || 1;

        res.render('admin/doctors', {
            doctors,
            categories: ALL_CATEGORIES,
            totalDoctors,
            currentPage,
            totalPages,
            search,
            category,
        });

    } catch (err) {
        console.error('Admin doctors list error:', err);
        res.status(500).send('Server error loading doctors list.');
    }
};

// ─────────────────────────────────────────────────────────
// GET /admin/doctors/new
// Render the Add Doctor form
// ─────────────────────────────────────────────────────────
exports.getAddDoctor = (req, res) => {
    res.render('admin/addDoctor', {
        categories : ALL_CATEGORIES,
        errors     : [],
        formData   : {},
    });
};

// ─────────────────────────────────────────────────────────
// POST /admin/doctors
// Create a new doctor record
// ─────────────────────────────────────────────────────────
exports.postAddDoctor = async (req, res) => {
    const {
        name, charges, category, rating,
        availability, experience, qualification, description,
    } = req.body;

    // ── Server-side validation ─────────────────────────
    const errors = [];
    if (!name        || !name.trim())         errors.push('Doctor name is required.');
    if (!charges     || isNaN(charges)   || Number(charges) < 0)
                                              errors.push('Valid consultation charges are required.');
    if (!category)                            errors.push('Specialization category is required.');
    if (rating && (isNaN(rating) || Number(rating) < 1 || Number(rating) > 5))
                                              errors.push('Rating must be between 1 and 5.');
    if (!qualification || !qualification.trim()) errors.push('Qualification is required.');
    if (!description   || !description.trim())   errors.push('Description is required.');

    // If validation fails, remove uploaded file and re-render form
    if (errors.length > 0) {
        if (req.file) fs.unlink(req.file.path, () => {});
        return res.render('admin/addDoctor', {
            categories : ALL_CATEGORIES,
            errors,
            formData   : req.body,
        });
    }

    try {
        const imagePath = req.file
            ? `/uploads/doctors/${req.file.filename}`
            : '';

        await Doctor.create({
            name         : name.trim(),
            charges      : Number(charges),
            category,
            rating       : rating       ? Number(rating)       : 4.0,
            availability : availability || 'Available',
            experience   : experience   ? Number(experience)   : 0,
            qualification: qualification.trim(),
            description  : description.trim(),
            image        : imagePath,
        });

        req.flash('success', `Dr. ${name.trim()} has been added successfully!`);
        res.redirect('/admin/doctors');

    } catch (err) {
        console.error('Add doctor error:', err);
        if (req.file) fs.unlink(req.file.path, () => {});
        res.render('admin/addDoctor', {
            categories : ALL_CATEGORIES,
            errors     : ['Failed to save doctor. Please try again.'],
            formData   : req.body,
        });
    }
};

// ─────────────────────────────────────────────────────────
// GET /admin/doctors/:id/edit
// Render the Edit Doctor form pre-populated with data
// ─────────────────────────────────────────────────────────
exports.getEditDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            req.flash('error', 'Doctor not found.');
            return res.redirect('/admin/doctors');
        }

        res.render('admin/editDoctor', {
            doctor,
            categories : ALL_CATEGORIES,
            errors     : [],
        });

    } catch (err) {
        console.error('Edit doctor GET error:', err);
        req.flash('error', 'Could not load doctor data.');
        res.redirect('/admin/doctors');
    }
};

// ─────────────────────────────────────────────────────────
// PUT /admin/doctors/:id
// Update an existing doctor record
// ─────────────────────────────────────────────────────────
exports.putDoctor = async (req, res) => {
    const {
        name, charges, category, rating,
        availability, experience, qualification, description,
    } = req.body;

    // ── Validation ─────────────────────────────────────
    const errors = [];
    if (!name        || !name.trim())         errors.push('Doctor name is required.');
    if (!charges     || isNaN(charges)   || Number(charges) < 0)
                                              errors.push('Valid consultation charges are required.');
    if (!category)                            errors.push('Specialization category is required.');
    if (rating && (isNaN(rating) || Number(rating) < 1 || Number(rating) > 5))
                                              errors.push('Rating must be between 1 and 5.');
    if (!qualification || !qualification.trim()) errors.push('Qualification is required.');
    if (!description   || !description.trim())   errors.push('Description is required.');

    if (errors.length > 0) {
        if (req.file) fs.unlink(req.file.path, () => {});
        try {
            const doctor = await Doctor.findById(req.params.id);
            return res.render('admin/editDoctor', {
                doctor,
                categories : ALL_CATEGORIES,
                errors,
            });
        } catch (_) {
            return res.redirect('/admin/doctors');
        }
    }

    try {
        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            if (req.file) fs.unlink(req.file.path, () => {});
            req.flash('error', 'Doctor not found.');
            return res.redirect('/admin/doctors');
        }

        // Replace image only if a new one was uploaded
        if (req.file) {
            deleteLocalImage(doctor.image);
            doctor.image = `/uploads/doctors/${req.file.filename}`;
        }

        // Update all text fields
        doctor.name          = name.trim();
        doctor.charges       = Number(charges);
        doctor.category      = category;
        doctor.rating        = rating       ? Number(rating)     : doctor.rating;
        doctor.availability  = availability || doctor.availability;
        doctor.experience    = experience   ? Number(experience) : doctor.experience;
        doctor.qualification = qualification.trim();
        doctor.description   = description.trim();

        await doctor.save();

        req.flash('success', `Dr. ${doctor.name} has been updated successfully!`);
        res.redirect('/admin/doctors');

    } catch (err) {
        console.error('Update doctor error:', err);
        if (req.file) fs.unlink(req.file.path, () => {});
        req.flash('error', 'Failed to update doctor. Please try again.');
        res.redirect(`/admin/doctors/${req.params.id}/edit`);
    }
};

// ─────────────────────────────────────────────────────────
// DELETE /admin/doctors/:id
// Remove a doctor record and their uploaded image
// ─────────────────────────────────────────────────────────
exports.deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);

        if (doctor) {
            deleteLocalImage(doctor.image);
            req.flash('success', `Dr. ${doctor.name} has been removed successfully.`);
        } else {
            req.flash('error', 'Doctor not found.');
        }

        res.redirect('/admin/doctors');

    } catch (err) {
        console.error('Delete doctor error:', err);
        req.flash('error', 'Failed to delete doctor. Please try again.');
        res.redirect('/admin/doctors');
    }
};
