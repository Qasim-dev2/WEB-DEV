# PROJECT-FINAL — Multisensa Rehabilitation Center

Purpose
- Full-stack Node.js + Express web application for a rehabilitation clinic featuring user roles (admin, doctor, patient), appointment booking, and a doctor dashboard.

Key files
- `server.js` — Main web server (EJS views, session auth).
- `app.js` — Separate API/JWT server (port 4000).
- `package.json` — Scripts: `npm run dev`, `npm run seed`, `npm start`.
- `seed.js` / `seedTestUsers.js` — Database seeders (create users, doctors, appointments).
- `.env` — Environment variables: `MONGO_URI`, `SESSION_SECRET`, `PORT`.

Run (development)
```powershell
cd PROJECT-FINAL
npm install
# create .env (example below)
# optional: npm run seed
npm run dev
```

Example `.env`
```
MONGO_URI=mongodb://localhost:27017/multisensa_rehabilitation
SESSION_SECRET=change-this-secret
PORT=3001
```

Credentials (after running `npm run seed`)
- Admin: `admin@gmail.com` / `123456`
- Doctors: `doctor1@gmail.com`...`doctor5@gmail.com` / `123456`
- Patients: `patient1@gmail.com`...`patient5@gmail.com` / `123456`

Notes
- Views use EJS. Uploads are stored in `public/uploads`.
- Use `taskkill /IM node.exe /F` on Windows if you see `EADDRINUSE` when restarting.
