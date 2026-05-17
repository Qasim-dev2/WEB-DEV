// controllers/doctorDashboardController.js — Doctor Dashboard
const Doctor = require('../models/Doctor');
const User   = require('../models/User');

// GET /doctor/dashboard
exports.getDashboard = async (req, res) => {
    try {
        // Try to find the linked Doctor profile (if any)
        let doctorProfile = null;
        if (req.session.user.doctorProfile) {
            doctorProfile = await Doctor.findById(req.session.user.doctorProfile);
        } else {
            // Try matching by name
            doctorProfile = await Doctor.findOne({ name: new RegExp(req.session.user.name, 'i') });
        }

        // Stats for the doctor's own card
        const [totalPatients, allDoctors] = await Promise.all([
            User.countDocuments({ role: 'customer' }),
            Doctor.find().sort({ rating: -1 }).limit(5),
        ]);

        res.render('doctor/dashboard', {
            activePage   : 'dashboard',
            doctorProfile,
            totalPatients,
            allDoctors,
        });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Could not load your dashboard.');
        res.redirect('/');
    }
};
