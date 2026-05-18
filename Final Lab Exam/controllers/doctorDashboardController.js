// controllers/doctorDashboardController.js — Doctor Dashboard
const Doctor      = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// Helper: get Doctor document linked to the logged-in user
async function getLinkedDoctor(userId) {
    return Doctor.findOne({ user: userId });
}

// GET /doctor/dashboard
exports.getDashboard = async (req, res) => {
    try {
        const doctor = await getLinkedDoctor(req.session.user._id);
        if (!doctor) {
            req.flash('error', 'Your account is not yet linked to a doctor profile. Please ask the admin to link your profile.');
            return res.redirect('/');
        }

        const today      = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const todayEnd   = new Date(todayStart.getTime() + 86400000);

        const [
            totalAppointments,
            pendingCount,
            approvedCount,
            completedCount,
            todayCount,
            recentAppointments,
            allDoctors,
        ] = await Promise.all([
            Appointment.countDocuments({ doctor: doctor._id }),
            Appointment.countDocuments({ doctor: doctor._id, status: 'pending' }),
            Appointment.countDocuments({ doctor: doctor._id, status: 'approved' }),
            Appointment.countDocuments({ doctor: doctor._id, status: 'completed' }),
            Appointment.countDocuments({ doctor: doctor._id, appointmentDate: { $gte: todayStart, $lt: todayEnd } }),
            Appointment.find({ doctor: doctor._id })
                       .sort({ appointmentDate: 1, createdAt: -1 })
                       .limit(8)
                       .populate('patient', 'name email'),
            Doctor.find({ _id: { $ne: doctor._id } }).limit(6).select('name category rating availability image'),
        ]);

        res.render('doctor/dashboard', {
            activePage: 'dashboard',
            doctor,
            totalAppointments,
            pendingCount,
            approvedCount,
            completedCount,
            todayCount,
            recentAppointments,
            allDoctors,
        });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Could not load your dashboard.');
        res.redirect('/');
    }
};

// GET /doctor/appointments
exports.getAppointments = async (req, res) => {
    try {
        const doctor = await getLinkedDoctor(req.session.user._id);
        if (!doctor) return res.redirect('/');

        const { status = '', page = '1' } = req.query;
        const LIMIT       = 12;
        const currentPage = Math.max(1, parseInt(page) || 1);
        const filter      = { doctor: doctor._id };
        if (status) filter.status = status;

        const [total, appointments, rawCounts] = await Promise.all([
            Appointment.countDocuments(filter),
            Appointment.find(filter)
                       .sort({ appointmentDate: 1, createdAt: -1 })
                       .skip((currentPage - 1) * LIMIT)
                       .limit(LIMIT)
                       .populate('patient', 'name email'),
            Promise.all(['pending','approved','completed','rejected','cancelled'].map(s =>
                Appointment.countDocuments({ doctor: doctor._id, status: s }).then(c => ({ status: s, count: c }))
            )),
        ]);

        const statusCounts = {};
        rawCounts.forEach(({ status: s, count: c }) => { statusCounts[s] = c; });

        res.render('doctor/appointments', {
            activePage: 'appointments',
            doctor,
            appointments,
            total,
            statusCounts,
            currentPage,
            totalPages: Math.ceil(total / LIMIT) || 1,
            selectedStatus: status,
        });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Could not load appointments.');
        res.redirect('/doctor/dashboard');
    }
};

// POST /doctor/appointments/:id/status
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const doctor = await getLinkedDoctor(req.session.user._id);
        if (!doctor) return res.redirect('/');

        const { status } = req.body;
        const allowed = ['approved', 'rejected', 'completed'];
        if (!allowed.includes(status)) {
            req.flash('error', 'Invalid status.');
            return res.redirect('/doctor/appointments');
        }

        const appt = await require('../models/Appointment').findOne({
            _id: req.params.id,
            doctor: doctor._id,
        });
        if (!appt) {
            req.flash('error', 'Appointment not found.');
            return res.redirect('/doctor/appointments');
        }

        appt.status = status;
        await appt.save();
        req.flash('success', `Appointment marked as ${status}.`);
        res.redirect('/doctor/appointments');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Could not update appointment status.');
        res.redirect('/doctor/appointments');
    }
};

// GET /doctor/profile
exports.getProfile = async (req, res) => {
    try {
        const doctor = await getLinkedDoctor(req.session.user._id);
        if (!doctor) return res.redirect('/');
        res.render('doctor/profile', { activePage: 'profile', doctor });
    } catch (err) {
        console.error(err);
        res.redirect('/doctor/dashboard');
    }
};

