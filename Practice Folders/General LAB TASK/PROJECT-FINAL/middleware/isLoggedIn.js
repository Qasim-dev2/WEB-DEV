// middleware/isLoggedIn.js — Redirect guests to /login
module.exports = (req, res, next) => {
    if (req.session && req.session.user) return next();
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'Please log in to access this page.');
    res.redirect('/login');
};
