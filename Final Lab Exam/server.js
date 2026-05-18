// server.js — Multisensa Rehabilitation Center
// Session-based web app: auth, appointment booking, patient dashboard, admin panel
require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const express        = require("express");
const expressLayouts = require("express-ejs-layouts");   // NEW — used by onsale-doctors page
const path           = require("path");
const session        = require("express-session");
const MongoStore     = require("connect-mongo");
const flash          = require("connect-flash");
const methodOverride = require("method-override");
const connectDB      = require("./config/db");
const authRoutes        = require("./routes/auth");
const adminRoutes       = require("./routes/admin");
const doctorRoutes      = require("./routes/doctors");
const doctorDashRoutes  = require("./routes/doctor");
const patientRoutes     = require("./routes/patient");
const appointmentRoutes = require("./routes/appointments");
const onsaleRoutes      = require("./routes/onsale");     // NEW — on-sale doctors
const isLoggedIn     = require("./middleware/isLoggedIn");

connectDB();

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// express-ejs-layouts — ONLY used when a route explicitly passes { layout: '...' }
// Setting layout:false globally means existing views are NOT affected at all.
app.use(expressLayouts);
app.set("layout", false);   // default = no layout; onsale-doctors overrides this per-render

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Sessions stored in MongoDB (survive server restarts)
app.use(session({
    secret: process.env.SESSION_SECRET || "multisensa-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: "sessions",
        ttl: 86400,
        autoRemove: "native",
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
    },
}));

app.use(flash());

// Globals available in every EJS template
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    res.locals.success     = req.flash("success");
    res.locals.error       = req.flash("error");
    next();
});

const Doctor = require("./models/Doctor");
// ── Routes ────────────────────────────────────────────────
app.get("/", async (req, res) => {
    try {
        const featuredDoctors = await Doctor.find({ availability: { $ne: 'Fully Booked' } })
            .sort({ rating: -1 }).limit(4);
        res.render("homepage", { featuredDoctors });
    } catch (e) {
        res.render("homepage", { featuredDoctors: [] });
    }
});
app.use("/",             authRoutes);
app.use("/doctors",      doctorRoutes);
app.use("/doctor",       doctorDashRoutes);
app.use("/admin",        adminRoutes);
app.use("/patient",      patientRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/onsale-doctors", onsaleRoutes);   // NEW — Doctors On Sale page

app.get("/profile",       isLoggedIn, (req, res) => res.render("profile"));

// 404
app.use((req, res) => res.status(404).render("404", { url: req.originalUrl }));

// Global error handler
app.use((err, req, res, _next) => {
    console.error(err.stack);
    req.flash("error", err.message || "Something went wrong.");
    res.redirect("back");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log("\n✅  Server:       http://localhost:" + PORT);
    console.log("🔑  Login:        http://localhost:" + PORT + "/login");
    console.log("🏥  Book Appt:    http://localhost:" + PORT + "/appointments/book");
    console.log("🔧  Admin:        http://localhost:" + PORT + "/admin");
    console.log("    Admin   : admin@gmail.com    / 123456");
    console.log("    Doctor1 : doctor1@gmail.com  / 123456");
    console.log("    Patient1: patient1@gmail.com / 123456\n");
});
