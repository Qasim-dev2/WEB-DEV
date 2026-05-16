// models/User.js — User Account with bcrypt password hashing + RBAC
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type     : String,
            required : [true, 'Full name is required'],
            trim     : true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        email: {
            type     : String,
            required : [true, 'Email is required'],
            unique   : true,
            lowercase: true,
            trim     : true,
            match    : [/^\S+@\S+\.\S+$/, 'Enter a valid email address'],
        },
        // Stored as HASH — never plain text
        password: {
            type     : String,
            required : [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
        },
        // RBAC: 'customer' (patient), 'doctor', or 'admin'
        role: {
            type   : String,
            enum   : ['customer', 'doctor', 'admin'],
            default: 'customer',
        },
        // For doctors: link to their Doctor profile
        doctorProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', default: null },
        profileImage: { type: String, default: '' },
    },
    { timestamps: true }
);

// Auto-hash password before every save (new user OR password change)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare plain-text candidate with stored hash
// Usage: const ok = await user.comparePassword('rawPassword');
userSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
