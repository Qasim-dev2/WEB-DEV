// controllers/appointmentController.js
// Web UI appointment booking flow (session-authenticated patients)
//
// REQUEST LIFECYCLE:
//   Patient clicks "Book Appointment" on /doctors/:id
//   → GET  /appointments/book?doctor=:id  (show form pre-filled with doctor)
//   → POST /appointments                  (save to MongoDB, redirect to dashboard)
//   → Patient sees appointment on /patient/dashboard

const Appointment = require('../models/Appointment');
const Doctor      = require('../models/Doctor');

// ─────────────────────────────────────────────────────────────────────────────
// GET /appointments/book?doctor=:id
// Render the booking form. If ?doctor= is provided, pre-select that doctor.
// Auth: must be logged in (isLoggedIn middleware applied in route)
// ─────────────────────────────────────────────────────────────────────────────
exports.getBookingForm = async (req, res) => {
    try {
        // Load ALL available doctors for the select dropdown
        const doctors = await Doctor.find({ availability: { $ne: 'Fully Booked' } })
            .sort({ rating: -1 })
            .select('name category charges rating availability isOnSale discountedFee discountPercentage');

        // Pre-select doctor if ?doctor= query param is provided
        let selectedDoctor = null;
        if (req.query.doctor) {
            selectedDoctor = await Doctor.findById(req.query.doctor)
                .select('name category charges rating qualification availability image isOnSale discountedFee discountPercentage originalFee');
            // If ID is invalid or doctor not found, just show the form without pre-selection
        }

        res.render('appointments/book', {
            doctors,
            selectedDoctor,
            errors  : [],
            formData: {},
        });
    } catch (err) {
        console.error('Booking form error:', err);
        req.flash('error', 'Could not load booking form. Please try again.');
        res.redirect('/doctors');
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /appointments
// Save appointment to MongoDB.
// Auth: must be logged in (isLoggedIn middleware applied in route)
//
// Form fields: doctor, appointmentDate, phone, symptoms, notes
// ─────────────────────────────────────────────────────────────────────────────
exports.postBookAppointment = async (req, res) => {
    const { doctor, appointmentDate, appointmentTime, phone, symptoms, notes } = req.body;

    // ── Server-side validation ─────────────────────────────────────────────
    const errors = [];
    if (!doctor)          errors.push('Please select a doctor.');
    if (!appointmentDate) errors.push('Please choose an appointment date.');
    if (!appointmentTime) errors.push('Please choose a time slot.');
    if (!phone || !phone.trim()) errors.push('Contact phone number is required.');
    if (!symptoms || !symptoms.trim()) errors.push('Please describe your symptoms or reason for visit.');
    if (symptoms && symptoms.trim().length < 5)
                          errors.push('Symptom description must be at least 5 characters.');

    // Combine date + time, then verify it's in the future
    let parsedDate = null;
    if (appointmentDate && appointmentTime) {
        parsedDate = new Date(`${appointmentDate}T${appointmentTime}`);
        if (isNaN(parsedDate.getTime())) errors.push('Invalid date/time combination.');
        else if (parsedDate < new Date()) errors.push('Appointment date/time cannot be in the past.');
    } else if (appointmentDate) {
        parsedDate = new Date(appointmentDate);
        if (parsedDate < new Date(new Date().setHours(0, 0, 0, 0)))
            errors.push('Appointment date cannot be in the past.');
    }

    if (errors.length) {
        // Re-load doctors list for the form
        const doctors = await Doctor.find({ availability: { $ne: 'Fully Booked' } })
            .sort({ rating: -1 })
            .select('name category charges rating availability isOnSale discountedFee discountPercentage');

        let selectedDoctor = null;
        if (doctor) selectedDoctor = await Doctor.findById(doctor).select('name category charges rating availability image isOnSale discountedFee discountPercentage originalFee').catch(() => null);

        return res.render('appointments/book', {
            doctors,
            selectedDoctor,
            errors,
            formData: req.body,
        });
    }

    try {
        // Confirm doctor still exists and is not fully booked
        const doctorDoc = await Doctor.findById(doctor);
        if (!doctorDoc) {
            req.flash('error', 'Selected doctor not found. Please choose again.');
            return res.redirect('/appointments/book');
        }

        await Appointment.create({
            patient        : req.session.user._id,
            doctor,
            appointmentDate: parsedDate,
            phone          : phone.trim(),
            symptoms       : symptoms.trim(),
            notes          : notes ? notes.trim() : '',
            status         : 'pending',
        });

        req.flash('success', `Your appointment with ${doctorDoc.name} has been submitted. The clinic will confirm shortly.`);
        res.redirect('/patient/dashboard');

    } catch (err) {
        console.error('Appointment creation error:', err);

        const doctors = await Doctor.find({ availability: { $ne: 'Fully Booked' } })
            .sort({ rating: -1 })
            .select('name category charges rating availability isOnSale discountedFee discountPercentage');

        return res.render('appointments/book', {
            doctors,
            selectedDoctor: null,
            errors        : ['Could not submit your appointment. Please try again.'],
            formData      : req.body,
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /appointments/:id/cancel
// Patient cancels their own appointment (only if status is pending/approved)
// ─────────────────────────────────────────────────────────────────────────────
exports.cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findOne({
            _id    : req.params.id,
            patient: req.session.user._id,   // ensure patient owns this appointment
        });

        if (!appointment) {
            req.flash('error', 'Appointment not found.');
            return res.redirect('/patient/dashboard');
        }

        if (['completed', 'cancelled', 'rejected'].includes(appointment.status)) {
            req.flash('error', 'This appointment cannot be cancelled.');
            return res.redirect('/patient/dashboard');
        }

        appointment.status = 'cancelled';
        await appointment.save();

        req.flash('success', 'Your appointment has been cancelled.');
        res.redirect('/patient/dashboard');
    } catch (err) {
        console.error('Cancel appointment error:', err);
        req.flash('error', 'Could not cancel appointment. Please try again.');
        res.redirect('/patient/dashboard');
    }
};
