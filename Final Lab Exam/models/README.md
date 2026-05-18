# models/

Purpose
- Mongoose schema definitions for the application's primary data models.

Key models
- `User.js` — User schema (name, email, password, role). Handles password hashing (pre-save) and `comparePassword` helper.
- `Doctor.js` — Doctor profile (name, category/specialization, charges, experience, image path, linked `user` ObjectId).
- `Appointment.js` — Appointment schema (patient ref, doctor ref, date/time, status, phone, symptoms, notes).

Notes
- Indexing and relations: `Appointment` references both `User` (patient) and `Doctor`.
- Keep model-specific helper methods (e.g., virtuals, instance methods) inside model files.
