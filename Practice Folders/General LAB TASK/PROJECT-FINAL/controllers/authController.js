// controllers/authController.js — Register, Login, Logout
const User = require('../models/User');

// GET /register
exports.getRegister = (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('auth/register', { errors: [], formData: {} });
};

// POST /register
exports.postRegister = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    const errors = [];

    if (!name     || !name.trim())              errors.push('Full name is required.');
    if (!email    || !email.trim())             errors.push('Email address is required.');
    if (email     && !/^\S+@\S+\.\S+$/.test(email)) errors.push('Enter a valid email address.');
    if (!password)                              errors.push('Password is required.');
    if (password  && password.length < 6)       errors.push('Password must be at least 6 characters.');
    if (password  !== confirmPassword)          errors.push('Passwords do not match.');

    if (errors.length) return res.render('auth/register', { errors, formData: req.body });

    try {
        const exists = await User.findOne({ email: email.toLowerCase().trim() });
        if (exists) {
            return res.render('auth/register', {
                errors  : ['An account with this email already exists. Please log in.'],
                formData: req.body,
            });
        }

        // Password is hashed automatically by the pre-save hook in User.js
        const user = await User.create({
            name    : name.trim(),
            email   : email.toLowerCase().trim(),
            password,
            role    : 'patient',
        });

        req.session.user = { _id: user._id, name: user.name, email: user.email, role: user.role };
        req.flash('success', `Welcome to Multisensa, ${user.name}! Your account is ready.`);
        res.redirect('/patient/dashboard');
    } catch (err) {
        if (err.code === 11000) {
            return res.render('auth/register', {
                errors: ['An account with this email already exists.'], formData: req.body,
            });
        }
        res.render('auth/register', { errors: ['Registration failed. Please try again.'], formData: req.body });
    }
};

// GET /login
exports.getLogin = (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('auth/login', { errors: [], formData: {} });
};

// POST /login
exports.postLogin = async (req, res) => {
    const { email, password, rememberMe } = req.body;
    const errors = [];

    if (!email    || !email.trim()) errors.push('Email is required.');
    if (!password)                  errors.push('Password is required.');
    if (errors.length) return res.render('auth/login', { errors, formData: req.body });

    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user || !(await user.comparePassword(password))) {
            return res.render('auth/login', {
                errors: ['Invalid email or password.'], formData: req.body,
            });
        }

        req.session.user = { _id: user._id, name: user.name, email: user.email, role: user.role };

        if (rememberMe) req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

        req.flash('success', `Welcome back, ${user.name}!`);

        const roleHome = { admin: '/admin', doctor: '/doctor/dashboard', patient: '/patient/dashboard', customer: '/patient/dashboard' };
        const returnTo = req.session.returnTo || roleHome[user.role] || '/';
        delete req.session.returnTo;
        res.redirect(returnTo);
    } catch (err) {
        res.render('auth/login', { errors: ['Login failed. Please try again.'], formData: req.body });
    }
};

// GET /logout
exports.logout = (req, res) => {
    const name = req.session.user ? req.session.user.name : 'User';
    delete req.session.user; // Keep session alive so flash message persists
    req.flash('success', `Goodbye, ${name}! You have been logged out.`);
    res.redirect('/login');
};
