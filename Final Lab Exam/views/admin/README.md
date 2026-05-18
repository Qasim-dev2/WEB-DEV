# views/admin/

Purpose
- EJS views for the admin dashboard: manage doctors, users, and site settings.

Typical files
- `doctors.ejs` — Admin view of doctor table (edit/delete actions).
- `users.ejs` — Admin list of user accounts (if present).

Notes
- These views are only reachable by users with the `admin` role via `isAdmin` middleware.
