# views/

Purpose
- EJS templates used to render HTML for the web UI.

Top-level templates
- `homepage.ejs` — Landing page showing featured doctors.
- `doctors.ejs` — Doctor listing for patients.
- `doctor-detail.ejs` — Detailed doctor profile page.
- `profile.ejs` — User profile page.
- `404.ejs` — Not found page.

Subfolders
- `views/admin/` — Admin panel templates.
- `views/doctor/` — Doctor dashboard templates (`appointments.ejs`, `dashboard.ejs`, etc.).
- `views/appointments/` — Booking and appointment forms.
- `views/auth/` — Login/register pages.
- `views/partials/` — Header, footer, nav and shared partials.
- `views/patient/` — Patient-specific pages.

Notes
- Partials are included with `<%- include('partials/header') %>`.
- Keep view logic minimal — heavy lifting belongs in controllers.
