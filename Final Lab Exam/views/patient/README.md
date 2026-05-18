# views/patient/

Purpose
- Patient-facing pages such as appointments, profile, and history.

Typical files
- `appointments.ejs` — Patient view of booked appointments.
- `profile.ejs` — Patient profile and account settings.

Notes
- Patient routes are often protected by `isLoggedIn` middleware and use data from `Appointment` and `Doctor` models.
