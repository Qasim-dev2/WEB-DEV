// middleware/isAdmin.js — Allow only admin role (use AFTER isLoggedIn)
module.exports = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') return next();
    req.flash('error', 'Access Denied. Administrators only.');
    res.redirect('/');
};
