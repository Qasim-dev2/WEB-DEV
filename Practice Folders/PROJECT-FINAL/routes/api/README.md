# routes/api/

Purpose
- API routes (JSON) used by `app.js` or by external API clients.

Notes
- These routes should use `verifyToken` middleware for protected endpoints and return JSON responses rather than rendering views.
- Keep route handlers thin; delegate logic to `controllers/api`.
