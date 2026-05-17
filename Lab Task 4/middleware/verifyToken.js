// middleware/verifyToken.js — JWT authentication guard
// Usage: router.get('/protected', verifyToken, handler)
//
// Expects:  Authorization: Bearer <token>
// Attaches: req.user = { user_id, role, iat, exp }

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // 1. Token must be present and formatted as "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: No token provided. Include "Authorization: Bearer <token>" header.',
        });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify signature & expiry
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;   // { user_id, role, iat, exp }
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please log in again.',
            });
        }
        return res.status(403).json({
            success: false,
            message: 'Forbidden: Invalid token.',
        });
    }
};

module.exports = verifyToken;
