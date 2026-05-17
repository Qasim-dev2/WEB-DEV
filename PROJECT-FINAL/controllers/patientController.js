// controllers/patientController.js — Patient Dashboard
const Doctor = require('../models/Doctor');
const User   = require('../models/User');

// GET /patient/dashboard
exports.getDashboard = async (req, res) => {
    try {
        const [topDoctors, categoryCount, totalDoctors] = await Promise.all([
            Doctor.find({ availability: 'Available' }).sort({ rating: -1 }).limit(6),
            Doctor.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
            Doctor.countDocuments(),
        ]);

        res.render('patient/dashboard', {
            activePage  : 'dashboard',
            topDoctors,
            categoryCount,
            totalDoctors,
        });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Could not load your dashboard.');
        res.redirect('/');
    }
};
