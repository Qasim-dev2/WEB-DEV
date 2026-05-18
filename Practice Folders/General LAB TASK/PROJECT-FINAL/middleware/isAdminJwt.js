// middleware/isAdmin.js (JWT version) — Allow only admin role
// Must be used AFTER verifyToken
// Usage: router.delete('/:id', verifyToken, isAdmin, handler)

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') return next();
    return res.status(403).json({
        success: false,
        message: 'Forbidden: Administrator access required.',
    });
};

module.exports = isAdmin;
