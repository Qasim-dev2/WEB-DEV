// controllers/api/appointmentController.js — Booking & management
const Appointment = require('../../models/Appointment');
const Doctor      = require('../../models/Doctor');

// ── POST /api/v1/appointments ─────────────────────────────────────────────────
// Auth: any logged-in patient (or admin)
exports.bookAppointment = async (req, res) => {
    try {
        const { doctor, appointmentDate, symptoms, notes } = req.body;

        if (!doctor || !appointmentDate || !symptoms) {
            return res.status(400).json({
                success: false,
                message: 'doctor (id), appointmentDate, and symptoms are required.',
            });
        }

        // Confirm doctor exists
        const doctorExists = await Doctor.findById(doctor);
        if (!doctorExists) {
            return res.status(404).json({ success: false, message: 'Doctor not found.' });
        }

        // Ensure date is in the future
        const date = new Date(appointmentDate);
        if (isNaN(date.getTime()) || date <= new Date()) {
            return res.status(400).json({
                success: false,
                message: 'appointmentDate must be a valid future date (ISO 8601 format).',
            });
        }

        const appointment = await Appointment.create({
            patient        : req.user.user_id,
            doctor,
            appointmentDate: date,
            symptoms,
            notes          : notes || '',
        });

        // Populate references for response
        await appointment.populate([
            { path: 'doctor',  select: 'name category charges qualification' },
            { path: 'patient', select: 'name email' },
        ]);

        return res.status(201).json({
            success: true,
            message: 'Appointment booked successfully.',
            data   : appointment,
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid doctor ID format.' });
        }
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: messages.join(' | ') });
        }
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ── GET /api/v1/appointments/my ───────────────────────────────────────────────
// Auth: patient — own appointments only
exports.getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user.user_id })
            .populate('doctor', 'name category charges rating image')
            .sort({ appointmentDate: -1 });

        return res.json({
            success: true,
            message: 'Your appointments fetched successfully.',
            total  : appointments.length,
            data   : appointments,
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ── GET /api/v1/appointments ──────────────────────────────────────────────────
// Auth: admin only — all appointments
exports.getAllAppointments = async (req, res) => {
    try {
        const { status, page = '1', limit = '20' } = req.query;

        const filter = {};
        if (status) filter.status = status;

        const LIMIT       = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
        const currentPage = Math.max(parseInt(page) || 1, 1);
        const skip        = (currentPage - 1) * LIMIT;

        const [total, appointments] = await Promise.all([
            Appointment.countDocuments(filter),
            Appointment.find(filter)
                .populate('doctor', 'name category charges')
                .populate('patient', 'name email role')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(LIMIT),
        ]);

        return res.json({
            success: true,
            message: 'All appointments fetched.',
            total,
            data   : appointments,
            pagination: {
                page      : currentPage,
                totalPages: Math.ceil(total / LIMIT) || 1,
                hasNext   : currentPage < Math.ceil(total / LIMIT),
                hasPrev   : currentPage > 1,
            },
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ── PUT /api/v1/appointments/:id/status ───────────────────────────────────────
// Auth: admin only — update appointment status
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { status, notes } = req.body;
        const VALID_STATUSES = ['pending', 'approved', 'rejected', 'completed', 'cancelled'];

        if (!status || !VALID_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `status must be one of: ${VALID_STATUSES.join(', ')}.`,
            });
        }

        const updates = { status };
        if (notes !== undefined) updates.notes = notes;

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        )
            .populate('doctor', 'name category charges')
            .populate('patient', 'name email');

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found.' });
        }

        return res.json({
            success: true,
            message: `Appointment status updated to "${status}".`,
            data   : appointment,
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid appointment ID format.' });
        }
        return res.status(500).json({ success: false, message: err.message });
    }
};
