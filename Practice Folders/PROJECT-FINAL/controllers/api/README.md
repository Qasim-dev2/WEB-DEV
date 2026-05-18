# controllers/api/

Purpose
- API controller implementations used by the separate API server (`app.js`) or API routes under `routes/api/`.

Contents
- Implement RESTful endpoints for resources like doctors, appointments, and users.
- Use JWT authentication (`jsonwebtoken`) for protected endpoints.

Notes
- Keep API controllers focused on JSON input/output (no EJS rendering).
- Reuse model logic where possible; keep common validation helpers in a shared utility if needed.
