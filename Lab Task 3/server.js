// server.js — Multisensa Rehabilitation Center (Lab Task 3)
// Authentication + Authorization + RBAC
require("dotenv").config();

const express        = require("express");
const path           = require("path");
const session        = require("express-session");
const MongoStore     = require("connect-mongo");
const flash          = require("connect-flash");
const methodOverride = require("method-override");
const connectDB      = require("./config/db");
const authRoutes     = require("./routes/auth");
const adminRoutes    = require("./routes/admin");
const doctorRoutes   = require("./routes/doctors");
const patientRoutes  = require("./routes/patient");
const doctorDashRoutes = require("./routes/doctor");
const isLoggedIn     = require("./middleware/isLoggedIn");

connectDB();

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Sessions stored in MongoDB (survive server restarts)
app.use(session({
    secret: process.env.SESSION_SECRET || "lab3-secret-change-me",
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

// ── Routes ────────────────────────────────────────────────
app.get("/", (req, res) => res.render("homepage"));
app.use("/",           authRoutes);
app.use("/doctors",    doctorRoutes);
app.use("/admin",      adminRoutes);
app.use("/patient",    patientRoutes);
app.use("/doctor",     doctorDashRoutes);
app.get("/profile",    isLoggedIn, (req, res) => res.render("profile"));

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
    console.log("\n✅  Server: http://localhost:" + PORT);
    console.log("🔑  Login:  http://localhost:" + PORT + "/login");
    console.log("🔧  Admin:  http://localhost:" + PORT + "/admin");
    console.log("    Credentials: admin@multisensa.com / Admin@123\n");
});
