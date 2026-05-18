// controllers/patientController.js — Patient Dashboard
const Doctor      = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// GET /patient/dashboard
exports.getDashboard = async (req, res) => {
    try {
        const patientId = req.session.user._id;

        const [
            topDoctors,
            categoryCount,
            totalDoctors,
            myAppointments,
            pendingCount,
            approvedCount,
        ] = await Promise.all([
            Doctor.find({ availability: { $ne: 'Fully Booked' } })
                  .sort({ rating: -1 })
                  .limit(6),
            Doctor.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
            Doctor.countDocuments(),
            // Patient's most recent 10 appointments (newest first)
            Appointment.find({ patient: patientId })
                       .sort({ createdAt: -1 })
                       .limit(10)
                       .populate('doctor', 'name category image charges'),
            Appointment.countDocuments({ patient: patientId, status: 'pending' }),
            Appointment.countDocuments({ patient: patientId, status: 'approved' }),
        ]);

        const totalMyAppointments = await Appointment.countDocuments({ patient: patientId });

        res.render('patient/dashboard', {
            activePage          : 'dashboard',
            topDoctors,
            categoryCount,
            totalDoctors,
            myAppointments,
            totalMyAppointments,
            pendingCount,
            approvedCount,
        });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Could not load your dashboard.');
        res.redirect('/');
    }
};
