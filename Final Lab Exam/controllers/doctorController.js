// controllers/doctorController.js — Public-facing doctor pages
const Doctor = require('../models/Doctor');

const CATEGORIES = [
    'Physiotherapist','Psychologist','Orthopedic Specialist',
    'Neurologist','Occupational Therapist','Speech Therapist','Rehabilitation Consultant',
];

// GET /doctors
exports.getAllDoctors = async (req, res) => {
    try {
        const { search = '', category = '', min = '', max = '', sort = '', page = '1' } = req.query;
        const filter = {};
        if (search.trim()) filter.name     = { $regex: search.trim(), $options: 'i' };
        if (category)      filter.category = category;
        if (min || max) {
            filter.charges = {};
            if (min) filter.charges.$gte = parseFloat(min);
            if (max) filter.charges.$lte = parseFloat(max);
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'low')    sortOption = { charges: 1 };
        if (sort === 'high')   sortOption = { charges: -1 };
        if (sort === 'rating') sortOption = { rating: -1 };

        const LIMIT = 9;
        const currentPage = Math.max(1, parseInt(page) || 1);
        const skip        = (currentPage - 1) * LIMIT;

        const [totalDoctors, doctors] = await Promise.all([
            Doctor.countDocuments(filter),
            Doctor.find(filter).sort(sortOption).skip(skip).limit(LIMIT),
        ]);

        res.render('doctors', {
            doctors, categories: CATEGORIES, totalDoctors,
            currentPage, totalPages: Math.ceil(totalDoctors / LIMIT) || 1,
            search, category, min, max, sort,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading doctors.');
    }
};

// GET /doctors/:id
exports.getDoctorDetail = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) { req.flash('error', 'Doctor not found.'); return res.redirect('/doctors'); }

        const related = await Doctor.find({ category: doctor.category, _id: { $ne: doctor._id } }).limit(3);
        res.render('doctor-detail', { doctor, relatedDoctors: related });
    } catch (err) {
        req.flash('error', 'Could not load doctor profile.');
        res.redirect('/doctors');
    }
};
