// ─────────────────────────────────────────────────────────
// controllers/adminController.js
// Admin Panel CRUD Logic — Multisensa Rehabilitation Center
// ─────────────────────────────────────────────────────────

const Doctor      = require('../models/Doctor');
const User        = require('../models/User');
const Appointment = require('../models/Appointment');
const fs          = require('fs');
const path        = require('path');

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
// Dashboard: stats for doctors AND appointments
// ─────────────────────────────────────────────────────────
exports.getDashboard = async (req, res) => {
    try {
        const [
            totalDoctors,
            recentDoctors,
            categoryStats,
            chargesAgg,
            ratingAgg,
            totalAppointments,
            pendingCount,
            approvedCount,
            completedCount,
            recentAppointments,
        ] = await Promise.all([
            Doctor.countDocuments(),
            Doctor.find().sort({ createdAt: -1 }).limit(5),
            Doctor.aggregate([
                { $group: { _id: '$category', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            Doctor.aggregate([{ $group: { _id: null, avg: { $avg: '$charges' } } }]),
            Doctor.aggregate([{ $group: { _id: null, avg: { $avg: '$rating'  } } }]),
            Appointment.countDocuments(),
            Appointment.countDocuments({ status: 'pending' }),
            Appointment.countDocuments({ status: 'approved' }),
            Appointment.countDocuments({ status: 'completed' }),
            Appointment.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('patient', 'name email')
                .populate('doctor',  'name category'),
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
            totalAppointments,
            pendingCount,
            approvedCount,
            completedCount,
            recentAppointments,
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
        loginEmail, loginPassword,
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

    // Credentials validation (only if either field is filled)
    const hasCredentials = (loginEmail && loginEmail.trim()) || (loginPassword && loginPassword.trim());
    if (hasCredentials) {
        if (!loginEmail || !loginEmail.trim())       errors.push('Login email is required when providing credentials.');
        if (!loginPassword || loginPassword.length < 6) errors.push('Password must be at least 6 characters.');
        if (loginEmail && loginEmail.trim()) {
            const existing = await User.findOne({ email: loginEmail.trim().toLowerCase() });
            if (existing) errors.push(`Email "${loginEmail.trim()}" is already registered.`);
        }
    }

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

        // Create login account only when credentials were provided
        let linkedUserId = null;
        if (hasCredentials) {
            const newUser = await User.create({
                name    : name.trim(),
                email   : loginEmail.trim().toLowerCase(),
                password: loginPassword,
                role    : 'doctor',
            });
            linkedUserId = newUser._id;
        }

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
            user         : linkedUserId,
        });

        const msg = linkedUserId
            ? `${name.trim()} added with a login account (${loginEmail.trim()}).`
            : `${name.trim()} added as a specialist profile (no login).`;
        req.flash('success', msg);
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

        req.flash('success', `${doctor.name} has been updated successfully!`);
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

// ─────────────────────────────────────────────────────────
// POST /admin/doctors/:id/link
// Link a user account (by email) to this doctor profile
// ─────────────────────────────────────────────────────────
exports.linkDoctorUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            req.flash('error', 'No user account found with that email address.');
            return res.redirect(`/admin/doctors/${req.params.id}/edit`);
        }
        // Set or upgrade role to doctor
        user.role = 'doctor';
        await user.save();

        // Unlink any other doctor profile that was pointing to this user
        await Doctor.updateMany({ user: user._id }, { $set: { user: null } });

        // Link this doctor
        await Doctor.findByIdAndUpdate(req.params.id, { user: user._id });
        req.flash('success', `Account linked! ${user.name} can now log in as a doctor.`);
        res.redirect(`/admin/doctors/${req.params.id}/edit`);
    } catch (err) {
        console.error('Link doctor user error:', err);
        req.flash('error', 'Failed to link account. Please try again.');
        res.redirect(`/admin/doctors/${req.params.id}/edit`);
    }
};

// ─────────────────────────────────────────────────────────
// POST /admin/doctors/:id/unlink
// Remove user account link from this doctor profile
// ─────────────────────────────────────────────────────────
exports.unlinkDoctorUser = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate('user');
        if (doctor && doctor.user) {
            doctor.user.role = 'patient';
            await doctor.user.save();
            doctor.user = null;
            await doctor.save();
            req.flash('success', 'Doctor account unlinked successfully.');
        }
        res.redirect(`/admin/doctors/${req.params.id}/edit`);
    } catch (err) {
        console.error('Unlink doctor user error:', err);
        req.flash('error', 'Failed to unlink account.');
        res.redirect(`/admin/doctors/${req.params.id}/edit`);
    }
};

// ═════════════════════════════════════════════════════════
// APPOINTMENT MANAGEMENT
// ═════════════════════════════════════════════════════════

// Valid statuses the admin can set
const APPOINTMENT_STATUSES = ['pending', 'approved', 'rejected', 'completed', 'cancelled'];

// ─────────────────────────────────────────────────────────
// GET /admin/appointments
// List all appointments with search + status filter + pagination
// ─────────────────────────────────────────────────────────
exports.getAppointments = async (req, res) => {
    try {
        const { status = '', search = '', page = '1' } = req.query;

        // Build filter
        const filter = {};
        if (status && APPOINTMENT_STATUSES.includes(status)) filter.status = status;

        // Pagination
        const LIMIT       = 15;
        const currentPage = Math.max(1, parseInt(page) || 1);
        const skip        = (currentPage - 1) * LIMIT;

        // Count per status for summary pills
        const [
            statusCounts,
            totalFiltered,
            appointments,
        ] = await Promise.all([
            Appointment.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
            Appointment.countDocuments(filter),
            Appointment.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(LIMIT)
                .populate('patient', 'name email')
                .populate('doctor',  'name category image'),
        ]);

        // Convert statusCounts array to a convenient object  { pending: 5, approved: 3, ... }
        const counts = { pending: 0, approved: 0, rejected: 0, completed: 0, cancelled: 0, total: 0 };
        statusCounts.forEach(s => {
            if (counts[s._id] !== undefined) counts[s._id] = s.count;
            counts.total += s.count;
        });

        const totalPages = Math.ceil(totalFiltered / LIMIT) || 1;

        res.render('admin/appointments', {
            appointments,
            counts,
            totalFiltered,
            currentPage,
            totalPages,
            statusFilter   : status,
            searchQuery    : search,
            allStatuses    : APPOINTMENT_STATUSES,
        });
    } catch (err) {
        console.error('Admin appointments list error:', err);
        req.flash('error', 'Could not load appointments.');
        res.redirect('/admin');
    }
};

// ─────────────────────────────────────────────────────────
// GET /admin/appointments/new
// Form for admin to create an appointment on behalf of a patient
// ─────────────────────────────────────────────────────────
exports.getCreateAppointment = async (req, res) => {
    try {
        const [doctors, patients] = await Promise.all([
            Doctor.find({ availability: { $ne: 'Fully Booked' } }).sort({ name: 1 }),
            User.find({ role: { $in: ['patient', 'customer'] } }).sort({ name: 1 }).select('name email'),
        ]);
        res.render('admin/create-appointment', {
            doctors,
            patients,
            allStatuses : APPOINTMENT_STATUSES,
            errors      : [],
            formData    : {},
        });
    } catch (err) {
        console.error('Create appointment form error:', err);
        req.flash('error', 'Could not load appointment form.');
        res.redirect('/admin/appointments');
    }
};

// ─────────────────────────────────────────────────────────
// POST /admin/appointments/create
// Admin creates an appointment on behalf of a patient
// ─────────────────────────────────────────────────────────
exports.postCreateAppointment = async (req, res) => {
    const { patient, doctor, appointmentDate, phone, symptoms, notes, status } = req.body;

    const errors = [];
    if (!patient)                              errors.push('Please select a patient.');
    if (!doctor)                               errors.push('Please select a doctor.');
    if (!appointmentDate)                      errors.push('Appointment date is required.');
    if (!phone || !phone.trim())               errors.push('Contact phone number is required.');
    if (!symptoms || !symptoms.trim())         errors.push('Please describe the symptoms or reason.');
    if (symptoms && symptoms.trim().length < 5) errors.push('Symptom description must be at least 5 characters.');

    let parsedDate = null;
    if (appointmentDate) {
        parsedDate = new Date(appointmentDate);
        if (isNaN(parsedDate.getTime())) errors.push('Invalid appointment date.');
    }

    if (errors.length) {
        const [doctors, patients] = await Promise.all([
            Doctor.find({ availability: { $ne: 'Fully Booked' } }).sort({ name: 1 }),
            User.find({ role: { $in: ['patient', 'customer'] } }).sort({ name: 1 }).select('name email'),
        ]);
        return res.render('admin/create-appointment', {
            doctors,
            patients,
            allStatuses : APPOINTMENT_STATUSES,
            errors,
            formData    : req.body,
        });
    }

    try {
        const appointmentStatus = APPOINTMENT_STATUSES.includes(status) ? status : 'pending';

        await Appointment.create({
            patient        : patient,
            doctor         : doctor,
            appointmentDate: parsedDate,
            phone          : phone.trim(),
            symptoms       : symptoms.trim(),
            notes          : notes ? notes.trim() : '',
            status         : appointmentStatus,
        });

        req.flash('success', 'Appointment created successfully!');
        res.redirect('/admin/appointments');
    } catch (err) {
        console.error('Admin create appointment error:', err);
        const [doctors, patients] = await Promise.all([
            Doctor.find({ availability: { $ne: 'Fully Booked' } }).sort({ name: 1 }),
            User.find({ role: { $in: ['patient', 'customer'] } }).sort({ name: 1 }).select('name email'),
        ]);
        res.render('admin/create-appointment', {
            doctors,
            patients,
            allStatuses : APPOINTMENT_STATUSES,
            errors      : ['Failed to create appointment. Please try again.'],
            formData    : req.body,
        });
    }
};

// ─────────────────────────────────────────────────────────
// GET /admin/appointments/:id
// View a single appointment with full detail + status update form
// ─────────────────────────────────────────────────────────
exports.getAppointmentDetail = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('patient', 'name email createdAt')
            .populate('doctor',  'name category charges qualification image experience');

        if (!appointment) {
            req.flash('error', 'Appointment not found.');
            return res.redirect('/admin/appointments');
        }

        res.render('admin/appointment-detail', {
            appointment,
            allStatuses: APPOINTMENT_STATUSES,
        });
    } catch (err) {
        console.error('Appointment detail error:', err);
        req.flash('error', 'Could not load appointment.');
        res.redirect('/admin/appointments');
    }
};

// ─────────────────────────────────────────────────────────
// POST /admin/appointments/:id/status
// Admin updates status (and optional internal note)
// ─────────────────────────────────────────────────────────
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { status, adminNotes } = req.body;

        if (!APPOINTMENT_STATUSES.includes(status)) {
            req.flash('error', 'Invalid status value.');
            return res.redirect(`/admin/appointments/${req.params.id}`);
        }

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            {
                status,
                adminNotes: adminNotes ? adminNotes.trim() : '',
            },
            { new: true, runValidators: true }
        ).populate('doctor', 'name');

        if (!appointment) {
            req.flash('error', 'Appointment not found.');
            return res.redirect('/admin/appointments');
        }

        req.flash('success', `Appointment status updated to "${status}" successfully.`);
        res.redirect('/admin/appointments');
    } catch (err) {
        console.error('Update appointment status error:', err);
        req.flash('error', 'Could not update appointment status.');
        res.redirect('/admin/appointments');
    }
};
