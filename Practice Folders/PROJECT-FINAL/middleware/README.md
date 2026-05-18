# middleware/

Purpose
- Custom Express middleware functions enforcing authentication and authorization, and other reusable request-level checks.

Key files
- `isLoggedIn.js` — Redirects to `/login` if `req.session.user` is missing.
- `isDoctor.js` — Allows access only if `req.session.user.role === 'doctor'`.
- `isAdmin.js` — Allows access only for admin users.
- `verifyToken.js` — Verifies JWT tokens for API routes.

Usage
- `routes/doctor.js` uses `isLoggedIn` and `isDoctor` to protect doctor dashboard routes.
- `server.js` and `app.js` mount routes that import this middleware.
