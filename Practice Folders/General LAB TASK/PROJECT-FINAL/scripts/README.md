# scripts/

Purpose
- Utility scripts used for one-off tasks like linking users and doctors.

Key files
- `create_doctor_user.js` — Creates a `doctor@multisensa.com` user and links it to the first unlinked `Doctor` record.

How to run
```powershell
node scripts/create_doctor_user.js
```

Notes
- Run these scripts from project root. They assume `MONGO_URI` is set in `.env` or environment.
