// controllers/api/authController.js — JWT Register & Login
const jwt  = require('jsonwebtoken');
const User = require('../../models/User');

// ── Helper ────────────────────────────────────────────────────────────────────
const generateToken = (user) =>
    jwt.sign(
        { user_id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

// ── POST /api/v1/auth/register ────────────────────────────────────────────────
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required.',
            });
        }

        // Check for existing email
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'An account with this email already exists.',
            });
        }

        // Create user — role defaults to 'patient' in the schema
        // Prevent self-registration as admin
        const user = await User.create({ name, email, password, role: 'patient' });

        const token = generateToken(user);

        return res.status(201).json({
            success: true,
            message: 'Account created successfully.',
            data: {
                token,
                expiresIn: '1h',
                user: { _id: user._id, name: user.name, email: user.email, role: user.role },
            },
        });
    } catch (err) {
        // Mongoose validation errors
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({ success: false, message: messages.join(' | ') });
        }
        return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
};

// ── POST /api/v1/auth/login ───────────────────────────────────────────────────
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required.',
            });
        }

        // Fetch user WITH password field (select: false in schema)
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const token = generateToken(user);

        return res.json({
            success: true,
            message: 'Login successful.',
            data: {
                token,
                expiresIn: '1h',
                user: { _id: user._id, name: user.name, email: user.email, role: user.role },
            },
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
};
