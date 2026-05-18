# public/

Purpose
- Publicly served static assets: CSS, client-side JS, images and uploaded files.

Subfolders
- `css/` — Site stylesheets (Bootstrap overrides, custom styles).
- `js/` — Front-end JavaScript (UI interactions, form handling, AJAX helpers).
- `uploads/` — Uploaded images (doctor photos, profile pictures). Seeded images live here.

Notes
- `server.js` serves this directory via `express.static(path.join(__dirname, 'public'))`.
- Keep any uploaded content out of version control (add to `.gitignore`).
