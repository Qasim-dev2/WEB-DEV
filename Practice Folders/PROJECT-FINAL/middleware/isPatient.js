// middleware/isPatient.js — Allow only patient/customer roles (use AFTER isLoggedIn)
module.exports = (req, res, next) => {
    const allowedRoles = ['patient', 'customer'];
    if (req.session && req.session.user && allowedRoles.includes(req.session.user.role)) {
        return next();
    }
    req.flash('error', 'This area is for patients only. Doctors and admins cannot access this.');
    res.redirect('/');
};
