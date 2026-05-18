// models/Doctor.js
// This defines the Doctor "blueprint" (schema) for our MongoDB collection

const mongoose = require('mongoose');

// Define the schema — this is like a template for every doctor document
const doctorSchema = new mongoose.Schema(
    {
        // Doctor's full name (e.g., "Dr. Ahmed Raza")
        name: {
            type: String,
            required: [true, 'Doctor name is required'],
            trim: true,
        },

        // Consultation charges in PKR (e.g., 2500)
        charges: {
            type: Number,
            required: [true, 'Charges are required'],
            min: [0, 'Charges cannot be negative'],
        },

        // Medical specialization / category
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: [
                'Physiotherapist',
                'Psychologist',
                'Orthopedic Specialist',
                'Neurologist',
                'Occupational Therapist',
                'Speech Therapist',
                'Rehabilitation Consultant',
            ],
        },

        // Patient rating out of 5.0
        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: 4.0,
        },

        // Slot availability status
        availability: {
            type: String,
            enum: ['Available', 'Limited Slots', 'Fully Booked'],
            default: 'Available',
        },

        // URL to doctor's profile image
        image: {
            type: String,
            default: '',
        },

        // Years of professional experience
        experience: {
            type: Number,
            default: 1,
            min: 0,
        },

        // Academic/professional qualifications
        qualification: {
            type: String,
            required: [true, 'Qualification is required'],
            trim: true,
        },

        // Brief description/bio of the doctor
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
        },

        // Linked user account (optional — set when doctor has a login)
        user: {
            type    : mongoose.Schema.Types.ObjectId,
            ref     : 'User',
            default : null,
            sparse  : true,
        },

        // ── SALE / DISCOUNT FIELDS ────────────────────────────
        // Is this doctor's consultation fee currently on sale?
        isOnSale: {
            type    : Boolean,
            default : false,
        },

        // Discount percentage (e.g., 20 means 20% OFF)
        discountPercentage: {
            type    : Number,
            default : 0,
            min     : 0,
            max     : 100,
        },

        // Original fee before the discount (stored explicitly for display)
        originalFee: {
            type    : Number,
            default : 0,
            min     : 0,
        },

        // Pre-computed discounted fee = originalFee - (originalFee * discountPercentage / 100)
        discountedFee: {
            type    : Number,
            default : 0,
            min     : 0,
        },
    },
    {
        // Automatically adds createdAt and updatedAt timestamps
        timestamps: true,
    }
);

// Export the model — Mongoose will create a "doctors" collection in MongoDB
module.exports = mongoose.model('Doctor', doctorSchema);
