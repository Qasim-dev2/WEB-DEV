# views/auth/

Purpose
- Authentication views: login, registration, forgot password (if present).

Common files
- `login.ejs` — Login form.
- `register.ejs` — User registration form.

Notes
- Authentication uses session-based login stored in `req.session.user` and `req.flash()` for messages.
