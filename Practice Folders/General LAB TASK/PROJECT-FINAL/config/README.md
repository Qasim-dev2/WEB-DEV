# config/

Purpose
- Contains configuration helpers used by the app.

Key files
- `db.js` — Connection helper to MongoDB using Mongoose. Exports a `connect` function used at app startup.
- `multer.js` — Multer configuration for file uploads (limits, storage path, file filters), used by routes/controllers that accept images/files.

How it's used
- `server.js` and `app.js` require `config/db.js` to establish the DB connection before starting the server.
- `multer.js` is required by routes that handle file uploads (doctor images, profile pictures).
