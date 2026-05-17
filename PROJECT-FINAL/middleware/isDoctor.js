// middleware/isDoctor.js — Allow only doctor role (use AFTER isLoggedIn)
module.exports = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'doctor') return next();
    req.flash('error', 'Access Denied. This area is for registered doctors only.');
    res.redirect('/');
};
