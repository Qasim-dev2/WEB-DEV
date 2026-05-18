# routes/

Purpose
- Express route definitions that map URLs to controller actions.

Key route files
- `auth.js` — Authentication routes (login, register, logout).
- `admin.js` — Admin panel routes (manage doctors/users).
- `doctors.js` — Public doctor listing and search routes.
- `doctor.js` — Doctor dashboard routes (mounted at `/doctor`, protected by `isLoggedIn` and `isDoctor`).
- `appointments.js` — Booking endpoints.
- `patient.js` — Patient-specific pages.
- `api/` — API route definitions for JWT/API server.

Mounting
- `server.js` mounts route files with `app.use()` (example: `app.use('/doctor', doctorDashRoutes)`).
