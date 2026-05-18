// models/Appointment.js — Patient appointment booking
// Status lifecycle: pending → approved → completed
//                   pending → rejected
//                   any     → cancelled (by patient)
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
    {
        // The patient who booked
        patient: {
            type    : mongoose.Schema.Types.ObjectId,
            ref     : 'User',
            required: [true, 'Patient is required'],
        },
        // The doctor being seen
        doctor: {
            type    : mongoose.Schema.Types.ObjectId,
            ref     : 'Doctor',
            required: [true, 'Doctor is required'],
        },
        // Preferred appointment date/time
        appointmentDate: {
            type    : Date,
            required: [true, 'Appointment date is required'],
        },
        // Patient contact number for clinic to call back
        phone: {
            type     : String,
            required : [true, 'Contact phone number is required'],
            trim     : true,
            match    : [/^[0-9+\-\s()]{7,20}$/, 'Enter a valid phone number'],
        },
        // Patient-described symptoms / chief complaint
        symptoms: {
            type     : String,
            required : [true, 'Please describe your symptoms or reason for visit'],
            trim     : true,
            minlength: [5,   'Please provide at least 5 characters'],
            maxlength: [1000, 'Symptoms cannot exceed 1000 characters'],
        },
        // Optional extra notes from patient
        notes: {
            type     : String,
            default  : '',
            trim     : true,
            maxlength: [500, 'Notes cannot exceed 500 characters'],
        },
        // Admin-managed status — mirrors e-commerce order tracking
        // pending   → newly submitted, awaiting admin review
        // approved  → clinic confirmed the appointment
        // rejected  → clinic declined (e.g., slot unavailable)
        // completed → appointment took place
        // cancelled → patient cancelled before appointment
        status: {
            type   : String,
            enum   : ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
            default: 'pending',
        },
        // Admin-facing internal notes (reason for rejection, follow-up, etc.)
        adminNotes: {
            type   : String,
            default: '',
            trim   : true,
            maxlength: [500, 'Admin notes cannot exceed 500 characters'],
        },
    },
    { timestamps: true }   // createdAt, updatedAt
);

// Index for fast patient-specific queries (patient dashboard)
appointmentSchema.index({ patient: 1, createdAt: -1 });
// Index for admin date-range filtering
appointmentSchema.index({ appointmentDate: 1, status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
