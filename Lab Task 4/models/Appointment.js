// models/Appointment.js — Patient appointment booking
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
    {
        user: {
            type    : mongoose.Schema.Types.ObjectId,
            ref     : 'User',
            required: [true, 'User is required'],
        },
        doctor: {
            type    : mongoose.Schema.Types.ObjectId,
            ref     : 'Doctor',
            required: [true, 'Doctor is required'],
        },
        appointmentDate: {
            type    : Date,
            required: [true, 'Appointment date is required'],
            validate: {
                validator: (v) => v >= new Date(),
                message  : 'Appointment date must be in the future',
            },
        },
        symptoms: {
            type     : String,
            required : [true, 'Please describe your symptoms'],
            trim     : true,
            minlength: [5, 'Symptoms must be at least 5 characters'],
            maxlength: [500, 'Symptoms cannot exceed 500 characters'],
        },
        status: {
            type   : String,
            enum   : ['pending', 'confirmed', 'completed', 'cancelled'],
            default: 'pending',
        },
        notes: {
            type   : String,
            default: '',
            trim   : true,
            maxlength: [1000, 'Notes cannot exceed 1000 characters'],
        },
    },
    { timestamps: true }
);

// Compound index — one active appointment per patient per doctor per day
appointmentSchema.index({ user: 1, doctor: 1, appointmentDate: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
