# views/doctor/

Purpose
- Doctor dashboard templates used by authenticated doctors.

Key files
- `appointments.ejs` — Doctor's appointment list with status-change buttons.
- `dashboard.ejs` — Overview stats for the doctor.
- `profile.ejs` — Doctor's own profile management view.

Notes
- These routes are protected by `isLoggedIn` + `isDoctor` middleware in `routes/doctor.js`.
