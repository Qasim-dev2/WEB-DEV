# WEB-DEV — Complete Web Development Portfolio

This repository contains a comprehensive collection of web development projects progressing from basic HTML/CSS to full-stack Node.js + Express + MongoDB applications. Each folder represents a learning milestone with increasing complexity and real-world features.

---

## 📚 Repository Structure & Project Guide

### **Beginner Projects (HTML/CSS)**

#### **1. Assignment 1 - Simple HTML/CSS**
- **Location:** `Assignment 1/`
- **What it is:** A basic static HTML page with CSS styling
- **Topics covered:** HTML5 structure, CSS styling, responsive design basics
- **Files:**
  - `index.html` — Main page structure
  - `style.css` — Styling
- **How to view:** Open `Assignment 1/index.html` in a browser (no server required)
- **Purpose:** Introduction to HTML and CSS fundamentals

#### **2. Assignment 2 - HTML/CSS + JavaScript**
- **Location:** `Assignment-2/`
- **What it is:** Static site with JavaScript interactivity
- **Topics covered:** DOM manipulation, event listeners, client-side JavaScript, forms
- **Files:**
  - `index.html` — Page structure
  - `style.css` — Styling
  - `script.js` — Client-side JavaScript logic
- **How to view:** Open `Assignment-2/index.html` in a browser
- **Purpose:** Learn how JavaScript adds interactivity to web pages

---

### **Intermediate Projects (Frontend + Simple Backend)**

#### **3. Lab Task 1 - Static Frontend**
- **Location:** `Lab Task 1/`
- **What it is:** A polished static website for a rehabilitation clinic
- **Topics covered:** Advanced CSS, responsive layouts, semantic HTML, professional UI/UX
- **Files:**
  - `index.html` — Main page
  - `style.css` — Professional styling
- **How to view:** Open `Lab Task 1/index.html` in a browser
- **Purpose:** Create a professional-looking static website

#### **4. Lab Task 2 - Node.js + Express (No Database)**
- **Location:** `Lab Task 2/`
- **What it is:** First backend project — Express server rendering EJS views (no database)
- **Topics covered:** Node.js basics, Express routing, EJS templates, static files, npm
- **Tech stack:** Node.js, Express, EJS
- **How to run:**
  ```powershell
  cd "Lab Task 2"
  npm install
  npm start
  # Visit http://localhost:3000
  ```
- **Key files:**
  - `server.js` — Express setup and routes
  - `views/` — EJS templates (similar to HTML but with dynamic content)
  - `public/` — Static CSS, JavaScript, images
- **Purpose:** Learn how to build a backend server and render dynamic pages

#### **5. Lab Task 3 - Node.js + Express + MongoDB**
- **Location:** `Lab Task 3/`
- **What it is:** A rehabilitation clinic app with users, authentication, doctors, and appointment booking
- **Topics covered:** 
  - Database (MongoDB + Mongoose)
  - User authentication (sessions, bcrypt password hashing)
  - User roles (admin, doctor, patient)
  - CRUD operations
  - Middleware for route protection
  - File uploads (Multer)
- **Tech stack:** Node.js, Express, MongoDB, Mongoose, bcryptjs, express-session, Multer
- **How to run:**
  ```powershell
  cd "Lab Task 3"
  npm install
  # Create .env file (see setup section below)
  npm run seed     # Optional: seed with sample data
  npm run dev
  # Visit http://localhost:3001
  ```
- **Key folders:**
  - `models/` — Database schemas (User, Doctor, Appointment)
  - `controllers/` — Business logic for each route
  - `routes/` — API endpoints
  - `views/` — EJS templates
  - `middleware/` — Authentication guards, role checks
  - `public/` — Static files and uploads
  - `config/` — Database and Multer configuration
- **Features:**
  - Admin dashboard to manage doctors
  - Doctor profiles with appointment management
  - Patient appointment booking
  - Session-based authentication
  - Form validation
- **Purpose:** Learn full-stack development with database integration

#### **6. Lab Task 4 - Advanced Full-Stack**
- **Location:** `Lab Task 4/`
- **What it is:** Expanded version of Lab Task 3 with API routes and dual-server architecture
- **Topics covered:**
  - REST API with JSON responses
  - Dual-server setup (web UI + API)
  - JWT authentication (in addition to session auth)
  - Advanced controller patterns
- **Tech stack:** Node.js, Express, MongoDB, Mongoose, JWT, Multer
- **How to run:**
  ```powershell
  cd "Lab Task 4"
  npm install
  npm run seed
  npm run dev
  # Web server: http://localhost:3001
  # API server: http://localhost:4000
  ```
- **Key additions:**
  - `app.js` — Separate API server (port 4000)
  - `controllers/api/` — API-specific logic
  - JWT middleware for API auth
- **Purpose:** Learn API development and architecture scaling

---

### **Capstone Project (Production-Ready)**

#### **7. Final Lab Exam - Multisensa Rehabilitation Center**
- **Location:** `Final Lab Exam/`
- **What it is:** Production-ready full-stack clinic management system with premium features
- **Topics covered:**
  - Everything from Lab Task 4
  - Plus: **Doctors On Sale** feature (segregated listing, discounted pricing, promotional badges)
  - Express-EJS-Layouts for layout management
  - Advanced EJS templating with conditionals
  - Client-side pagination with jQuery
  - Discounted pricing logic throughout the app
- **Tech stack:** Node.js, Express, MongoDB, Mongoose, EJS, jQuery, Multer, express-ejs-layouts
- **How to run:**
  ```powershell
  cd "Final Lab Exam"
  npm install
  npm run seed
  npm run dev
  # Visit http://localhost:3001
  ```

**📋 Detailed Feature Breakdown:**

| Feature | Purpose | User Role |
|---------|---------|-----------|
| **Doctor Listing** | View specialists by category, price, rating | Patient/Guest |
| **On Sale Page** | Browse discounted doctors with savings badges | Patient/Guest |
| **Doctor Profiles** | Detailed info, pricing (with discounts), availability | Patient/Guest |
| **Appointment Booking** | Schedule visits (uses discounted price if on sale) | Patient (authenticated) |
| **Admin Dashboard** | Manage doctors, approvals, upload images | Admin |
| **Doctor Dashboard** | View assigned appointments, manage schedule | Doctor |
| **Patient Dashboard** | View personal appointments, booking history | Patient |

**🆕 Recent Changes (Doctors On Sale Feature):**

See [README_CHANGES.md](Final%20Lab%20Exam/README_CHANGES.md) for complete documentation.

**Summary of changes:**
- ✅ On-sale doctors are now **excluded from the main Specialists page** (`/doctors`)
- ✅ On-sale doctors appear only on the dedicated **On Sale page** (`/onsale-doctors`)
- ✅ **Booking shows discounted pricing** everywhere (booking form, doctor profile, dropdown)
- ✅ **Doctor images** now render correctly (fixed path handling in templates)
- ✅ **Discounted fee is prominently displayed** with strikethrough original price, savings amount, and discount badge

---

## 🚀 Quick Start Guide

### **Prerequisites**
- **Node.js** (v14 or higher) — [Download here](https://nodejs.org/)
- **MongoDB** (local or cloud) — [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** (optional) — For version control

### **For Any Node.js Project (Lab Task 2+, Final Exam)**

#### **Step 1: Navigate to the project**
```powershell
cd "Final Lab Exam"   # Or any other project folder
```

#### **Step 2: Install dependencies**
```powershell
npm install
```

#### **Step 3: Create `.env` file**
Create a `.env` file in the project root:
```
MONGO_URI=mongodb://localhost:27017/multisensa_rehabilitation
SESSION_SECRET=your-secret-key-change-this
PORT=3001
```

**If using MongoDB Atlas (cloud):**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
SESSION_SECRET=your-secret-key-change-this
PORT=3001
```

#### **Step 4: Seed the database (optional but recommended)**
```powershell
npm run seed
```
This creates sample data:
- 1 admin user
- 5 doctor users with 14 of them on sale
- 5 patient users
- 17 sample appointments

#### **Step 5: Start the development server**
```powershell
npm run dev
```

#### **Step 6: Open in browser**
```
http://localhost:3001
```

### **Test Credentials (after seed)**
- **Admin:** `admin@gmail.com` / `123456`
- **Doctor:** `doctor1@gmail.com` / `123456`
- **Patient:** `patient1@gmail.com` / `123456`

---

## 📖 How Each Project Teaches You

### **Your Learning Journey:**

1. **Assignment 1** → Learn HTML/CSS basics
2. **Assignment 2** → Add interactivity with JavaScript
3. **Lab Task 1** → Polish your frontend skills
4. **Lab Task 2** → First backend: server rendering & routing
5. **Lab Task 3** → Add database & authentication (core full-stack)
6. **Lab Task 4** → Scale with API & dual servers
7. **Final Exam** → Production features (pricing logic, layouts, optimizations)

Each project builds on the previous one. If you want to understand the progression:
- Start with **Lab Task 2** for basic backend concepts
- Move to **Lab Task 3** to understand databases and auth
- Then **Lab Task 4** for APIs
- Finally **Final Lab Exam** for real-world features

---

## 🛠️ Technology Stack Breakdown

| Technology | Used in | Purpose |
|-----------|---------|---------|
| **HTML5** | All projects | Page structure |
| **CSS3** | All projects | Styling & layout |
| **JavaScript** | Assignment 2+, Frontend | Client-side interactivity |
| **jQuery** | Lab Task 3+, Final Exam | DOM manipulation, pagination |
| **Bootstrap 5** | Lab Task 3+, Final Exam | Responsive UI framework |
| **Node.js** | Lab Task 2+ | Backend runtime |
| **Express** | Lab Task 2+ | Web framework |
| **EJS** | Lab Task 2+ | Template engine |
| **MongoDB** | Lab Task 3+ | NoSQL database |
| **Mongoose** | Lab Task 3+ | MongoDB ODM |
| **bcryptjs** | Lab Task 3+ | Password hashing |
| **express-session** | Lab Task 3+ | Session management |
| **Multer** | Lab Task 3+ | File uploads |
| **JWT** | Lab Task 4+ | API authentication |
| **express-ejs-layouts** | Final Exam | Layout template system |

---

## 📁 Project Structure (Lab Task 3+ / Final Exam)

```
project/
├── models/              # Mongoose schemas (User, Doctor, Appointment)
├── controllers/         # Business logic for routes
├── routes/              # Express route definitions
├── views/               # EJS templates
├── middleware/          # Auth & role protection
├── config/              # Database & Multer setup
├── public/              # Static files (CSS, JS, uploads)
│   ├── css/
│   ├── js/
│   └── uploads/         # User-uploaded files (doctor images)
├── server.js            # Main web server
├── app.js               # Separate API server (Lab Task 4+)
├── seed.js              # Database seeder
├── package.json         # Dependencies
└── .env                 # Environment variables
```

---

## 🔍 Key Features Explained

### **User Roles & Permissions**

| Role | Can Do | Cannot Do |
|------|--------|-----------|
| **Guest** | View doctors, on-sale list | Book appointments, upload |
| **Patient** | Book appointments, view profile | Admin operations |
| **Doctor** | View own appointments, update availability | Admin operations, modify other doctors |
| **Admin** | Everything | None (has all permissions) |

### **Authentication Flow**
1. User registers or logs in
2. Password is hashed with bcryptjs
3. Session is created (stored in database with connect-mongo)
4. On each request, session is verified via middleware
5. Middleware checks user role and grants/denies access

### **Appointment Booking Flow**
1. Patient logs in
2. Browses doctors on `/doctors` or on-sale doctors on `/onsale-doctors`
3. Clicks "Book" → Opens booking form with doctor pre-selected
4. Fills in date, time, phone, symptoms
5. Submits → Appointment saved to database with status "pending"
6. Admin reviews and approves/rejects
7. Patient sees status on their dashboard

---

## 🐛 Troubleshooting

### **"Port 3001 already in use"**
```powershell
# Kill the process using port 3001
Get-NetTCPConnection -LocalPort 3001 | Stop-Process -Force
# Or restart your terminal/computer
```

### **"Cannot connect to MongoDB"**
- Ensure MongoDB is running
  ```powershell
  # On Windows with MongoDB installed:
  mongod
  ```
- OR use MongoDB Atlas (cloud) and update `.env` with correct connection string

### **"500 error on page load"**
- Check `.env` file exists and has correct values
- Check MongoDB is running
- Check `npm install` completed without errors
- Look at terminal output for specific error message

### **"Images not loading"**
- Images use `/uploads/doctors/` directory
- Ensure `public/uploads/doctors/` exists
- Check Multer is correctly configured in `config/multer.js`
- Fallback to UI-Avatars API if image missing

### **"Sessions not persisting"**
- Ensure MongoDB connection is correct
- Ensure `express-session` and `connect-mongo` are installed
- Check `.env` SESSION_SECRET is set

---

## 📝 Database Schema Overview (Final Exam)

### **User**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "admin" | "doctor" | "patient",
  createdAt: Date
}
```

### **Doctor**
```javascript
{
  name: String,
  category: String, // "Physiotherapist", "Psychologist", etc.
  charges: Number,
  rating: Number,
  availability: String,
  image: String, // path to uploaded image
  experience: Number,
  qualification: String,
  description: String,
  isOnSale: Boolean, // ← New: marks as promotional
  discountPercentage: Number, // ← New: discount %
  originalFee: Number, // ← New: original price
  discountedFee: Number, // ← New: sale price
  user: ObjectId (ref: User),
  createdAt: Date
}
```

### **Appointment**
```javascript
{
  patient: ObjectId (ref: User),
  doctor: ObjectId (ref: Doctor),
  appointmentDate: Date,
  phone: String,
  symptoms: String,
  notes: String,
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled",
  adminNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## ✨ Advanced Topics (Final Exam)

### **Doctors On Sale Feature**
- Implemented in Final Exam with `isOnSale`, `discountPercentage`, `discountedFee` fields
- Segregates on-sale doctors to `/onsale-doctors` (excluded from main `/doctors`)
- Shows discounted pricing in booking form, doctor profile, and dropdown
- Uses discount badges and strikethrough original pricing for visual prominence
- See [README_CHANGES.md](Final%20Lab%20Exam/README_CHANGES.md) for implementation details

### **Express-EJS-Layouts**
- Used in Final Exam for consistent layout across pages
- Wraps every page with a main layout (navbar, footer, etc.)
- Allows per-page layout override for special pages like `/onsale-doctors`

### **Client-Side Pagination**
- On-sale doctors page uses jQuery to paginate 10 cards per page
- No server-side requests after initial load (performance optimization)
- All data fetched once, sorted by discount % descending

---

## 📚 Next Steps for Learning

### **To deepen your understanding:**
1. Add a **search & filter** feature to doctor listings
2. Implement **email notifications** on appointment status changes
3. Add **payment integration** (Stripe/PayPal)
4. Create **admin analytics dashboard** (revenue, appointment trends)
5. Build **mobile app** with React Native using the API
6. Deploy to **cloud** (Heroku, AWS, Azure, etc.)

---

## 📄 Additional Documentation

- [Final Exam README](Final%20Lab%20Exam/README.md) — Project-specific setup
- [Recent Changes (Doctors On Sale)](Final%20Lab%20Exam/README_CHANGES.md) — Feature details and implementation guide

---

## 👤 Author

This portfolio represents a complete learning journey from HTML/CSS fundamentals to full-stack development with Node.js, Express, and MongoDB.

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Seed database | `npm run seed` |
| Start dev server | `npm run dev` |
| Start production | `npm start` |
| Kill port 3001 | `Get-NetTCPConnection -LocalPort 3001 \| Stop-Process` |

---

**Happy coding! 🚀**