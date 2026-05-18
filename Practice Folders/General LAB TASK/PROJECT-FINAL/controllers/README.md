# controllers/

Purpose
- Controller layer implementing business logic for routes. Each controller handles request validation, DB operations, and response rendering or JSON output.

Key controllers
- `authController.js` — Login, logout, registration, session management.
- `adminController.js` — Admin dashboard actions: manage doctors, users, site data.
- `doctorController.js` — Public doctor listing and doctor detail pages.
- `doctorDashboardController.js` — Doctor-only dashboard: appointments, status updates, profile.
- `appointmentController.js` — Appointment booking and management logic.
- `patientController.js` — Patient profile and appointment views.
- `api/` — Controllers for API endpoints (JWT-protected routes).

Style
- Controllers are async and use Mongoose models (in `/models`).
- Use `req.flash()` for user messages and redirect/render for web flows.
