// controllers/api/userController.js — Profile get & update
const User        = require('../../models/User');
const Appointment = require('../../models/Appointment');

// ── GET /api/v1/user/profile ──────────────────────────────────────────────────
// Returns authenticated user's profile (password excluded)
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.user_id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        return res.json({ success: true, message: 'Profile fetched successfully.', data: user });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// ── PUT /api/v1/user/profile ──────────────────────────────────────────────────
// Update name / email only — password changes need a separate flow
exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const updates = {};
        if (name)  updates.name  = name.trim();
        if (email) updates.email = email.toLowerCase().trim();

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Provide at least one field to update: name or email.',
            });
        }

        // Check email uniqueness if being changed
        if (updates.email) {
            const taken = await User.findOne({ email: updates.email, _id: { $ne: req.user.user_id } });
            if (taken) {
                return res.status(409).json({
                    success: false,
                    message: 'This email is already in use by another account.',
                });
            }
        }

        const user = await User.findByIdAndUpdate(
            req.user.user_id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        return res.json({ success: true, message: 'Profile updated successfully.', data: user });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: messages.join(' | ') });
        }
        return res.status(400).json({ success: false, message: err.message });
    }
};
