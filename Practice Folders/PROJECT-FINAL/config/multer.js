// ─────────────────────────────────────────────────────────
// config/multer.js — Multer Image Upload Configuration
// Handles doctor profile image uploads for the admin panel
// ─────────────────────────────────────────────────────────

const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// ── Ensure upload directory exists before any upload ──────
const UPLOAD_DIR = path.join(__dirname, '../public/uploads/doctors');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ── Disk Storage: where and what filename to use ──────────
const storage = multer.diskStorage({

    // Save all uploaded doctor images here
    destination: (_req, _file, cb) => {
        cb(null, UPLOAD_DIR);
    },

    // Generate a unique filename: doctor-<timestamp>-<random>.<ext>
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `doctor-${uniqueSuffix}${ext}`);
    },
});

// ── File Filter: only allow image MIME types ──────────────
const fileFilter = (_req, file, cb) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);   // Accept file
    } else {
        cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed!'), false);
    }
};

// ── Export configured multer instance ─────────────────────
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB max per file
    },
});

module.exports = upload;
