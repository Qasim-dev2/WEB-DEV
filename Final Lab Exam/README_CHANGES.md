**Overview**
- **Summary:** This README documents the changes implemented to support "Doctors On Sale" behavior: segregating on-sale doctors to a dedicated page, ensuring booking uses the discounted price everywhere, and wiring real doctor images using Multer uploads.

**Changes Made**
- **Controller:** [controllers/doctorController.js](controllers/doctorController.js) — `getAllDoctors` now excludes on-sale doctors from the Specialists listing; `getOnSaleDoctors` already serves all on-sale doctors.
- **Views:**
  - [views/onsale-doctors.ejs](views/onsale-doctors.ejs) — fixed image path usage and client-side pagination remains.
  - [views/doctors.ejs](views/doctors.ejs) — Specialists grid unchanged visually, but receives only non-sale doctors now (filtering in controller).
  - [views/doctor-detail.ejs](views/doctor-detail.ejs) — Consultation Fee section updated to display discounted pricing for on-sale doctors (badge, discounted amount, original strikethrough, savings).
  - [views/appointments/book.ejs](views/appointments/book.ejs) — booking form updated to show discounted fee for a pre-selected on-sale doctor and dropdown shows discount summary.
- **Appointment Flow:** [controllers/appointmentController.js](controllers/appointmentController.js) — queries updated to include sale-related fields (isOnSale, discountedFee, discountPercentage, originalFee) so the booking view can present/use them.
- **Uploads / Multer:** [config/multer.js](config/multer.js) — Multer already configured to store uploads under `public/uploads/doctors`; admin controller already writes `doctor.image = '/uploads/doctors/<filename>'` on upload.
- **Seed Data:** [seed.js](seed.js) — seed uses a `sale()` helper and 14 doctors are marked on sale with `originalFee`, `discountPercentage`, and `discountedFee`. Seed images use files in `public/uploads/doctors`.

**Why these changes were needed (Problem before)**
- Previously, on-sale doctors and their discounted presentation were introduced on a new `/onsale-doctors` page, but:
  - The main Specialists listing (`/doctors`) still showed on-sale doctors, causing duplication and confusing pricing.
  - The booking flow and appointment creation used `doctor.charges` (original price) — so patients could book but not be charged the discounted price.
  - Some templates incorrectly built image URLs (double `/uploads/…`) or prepended segments incorrectly, causing broken avatars or reliance on UI-Avatars fallback.

**What changed (Behavior now)**
- Specialists page (`/doctors`): on-sale doctors are excluded. Only normal-priced specialists are listed. This is implemented server-side in `getAllDoctors` by starting the filter with `isOnSale: { $ne: true }`.
- On Sale page (`/onsale-doctors`): shows every doctor where `isOnSale === true`. Uses the dedicated layout and client-side jQuery pagination as implemented earlier.
- Doctor profile (`/doctors/:id`): if the doctor is on sale, the profile highlights the discounted price, shows the percentage off, original price (struck-through), and the amount saved.
- Booking flow (`/appointments/book`): when a patient chooses or pre-selects an on-sale doctor, the booking form displays the discounted fee. The server now fetches `isOnSale` and `discountedFee` so the view can present them. Appointment creation still saves appointment data (doctor link, patient, date, phone, symptoms); pricing is shown to the user as discounted where applicable (the Appointment model itself is not storing a fee field by default — see notes).
- Images: `doctor.image` stores full path values such as `/uploads/doctors/doctor-...jpg`. Templates now use the value directly (`doctor.image`) and fall back to UI-Avatars when missing. Multer stores uploads under `public/uploads/doctors/` so admin uploads work and seed image files already exist there.

**Technical details (how it works now)**
- Specialist filtering: `getAllDoctors` builds a Mongo filter that begins with `isOnSale: { $ne: true }`. This ensures a single DB query returns only non-sale doctors for pagination and search.
- On-sale listing: `getOnSaleDoctors` runs `Doctor.find({ isOnSale: true }).sort({ discountPercentage: -1 })`, returns the full array to the EJS view, and client-side jQuery paginates the cards in the browser (no extra server requests).
- Booking UI & server fields: `appointmentController.getBookingForm` and related queries now `.select('... isOnSale discountedFee discountPercentage originalFee')`. Views conditionally render discounted pricing when `isOnSale === true`.
- Images: Admin uploads handled by Multer (`config/multer.js`) are saved to `public/uploads/doctors/` and `controllers/adminController.js` sets `doctor.image = '/uploads/doctors/<filename>'` when a file is present. Views use `doctor.image` as the `src` and fall back to `https://ui-avatars.com/api/...` if the image fails to load.

**Files changed (quick reference)**
- [controllers/doctorController.js](controllers/doctorController.js)
- [controllers/appointmentController.js](controllers/appointmentController.js)
- [controllers/adminController.js](controllers/adminController.js) (already writing `/uploads/doctors/...`) 
- [views/onsale-doctors.ejs](views/onsale-doctors.ejs)
- [views/doctors.ejs](views/doctors.ejs)
- [views/doctor-detail.ejs](views/doctor-detail.ejs)
- [views/appointments/book.ejs](views/appointments/book.ejs)
- [config/multer.js](config/multer.js)
- [seed.js](seed.js)

**How to start the project locally**
- 1) Install dependencies:

  `npm install`

- 2) (Optional) Seed the database (this will clear and recreate users/doctors/appointments):

  `node seed.js`

- 3) Start the server (dev):

  `npm run dev`

  or start directly:

  `node server.js`

- 4) Open the site in your browser: `http://localhost:3001/`

**Test / verification checklist**
- Specialists page: Visit `http://localhost:3001/doctors` — verify on-sale doctors (e.g., "Dr. Ahmed Raza") are not present and normal doctors (e.g., "Dr. Imran Shafi") are present.
- On Sale page: Visit `http://localhost:3001/onsale-doctors` — verify listed doctors match the seeded on-sale set, show discount badges, discounted price, and pagination.
- Doctor profile: Visit `http://localhost:3001/doctors/<doctorId>` for an on-sale doctor — verify the Consultation Fee section shows the discounted fee, original strikethrough, and savings.
- Booking form: Log in as a seeded patient (example credentials from seed output: `patient1@gmail.com / 123456`) and open `http://localhost:3001/appointments/book?doctor=<onSaleDoctorId>` — verify the booking form shows the discounted price and displays the on-sale badge.
- Image check: On the on-sale and profile pages confirm doctor images render. If an image is missing the UI-Avatar fallback will be used.

**Notes, assumptions & important caveats**
- Appointment records: The current `Appointment` schema does not contain a dedicated `fee` field. Appointment creation still records the doctor reference; pricing is presented to the user in the UI but not persisted on the appointment. If you need the booked fee stored for billing/audit, add a `fee` or `chargedAmount` field to `models/Appointment.js` and save the selected amount in `postBookAppointment`.
- Authentication: Booking routes require a logged-in patient. To test booking flows, use seeded patient accounts created by `seed.js`.
- Admin uploads: The admin flow that accepts `req.file` is already updating `doctor.image` to `/uploads/doctors/<filename>`; Multer config ensures uploads are placed in `public/uploads/doctors`. Ensure `public/uploads/doctors` is writable by the running process.
- Layout & express-ejs-layouts: The on-sale page relies on passing `layout: 'layouts/main'` in `res.render` options to override the global `app.set('layout', false)`. Do not move that layout setting to `res.locals`; express-ejs-layouts requires it in the render options.

**Suggested next steps (optional improvements)**
- Persist booked fee: add a `fee` field to `models/Appointment.js` and save `doctor.isOnSale ? doctor.discountedFee : doctor.charges` at appointment creation time.
- Show price on patient dashboard: include the saved fee on appointment list entries (if you persist fees).
- Add admin UI to bulk-manage sales: admin form to flip `isOnSale`, set `discountPercentage`, recalc `discountedFee`.
- Add unit/integration tests for pricing logic and templates.

**Rollback instructions**
- To revert specialists filtering quickly, edit `controllers/doctorController.js` and remove or change the `isOnSale: { $ne: true }` line. Re-seed is not required to revert behavior.

---
If you want, I can:
- Add `fee` persistence to `models/Appointment.js` and update `postBookAppointment` so bookings record the charged amount (I can implement and run a migration to backfill existing appointments if desired).
- Create a small admin page to bulk-assign images or update sale flags.

Tell me which follow-up you'd like me to implement next.