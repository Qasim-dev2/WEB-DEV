// seedTestUsers.js - Populate database with test users
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/multisensa_rehabilitation';

async function seedTestUsers() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('✓ Connected to MongoDB');

        // Clear existing test users
        await User.deleteMany({ email: { $regex: '@gmail.com$' } });
        console.log('✓ Cleared existing test users');

        // Test users data
        const testUsers = [
            // 1 Admin
            {
                name: 'Admin User',
                email: 'admin@gmail.com',
                password: '123456a',
                role: 'admin',
            },
            // 2 Doctors
            {
                name: 'Dr. Ahmed Khan',
                email: 'doctor1@gmail.com',
                password: '123456a',
                role: 'doctor',
            },
            {
                name: 'Dr. Fatima Ali',
                email: 'doctor2@gmail.com',
                password: '123456a',
                role: 'doctor',
            },
            // 3 Patients
            {
                name: 'Patient One',
                email: 'patient1@gmail.com',
                password: '123456a',
                role: 'patient',
            },
            {
                name: 'Patient Two',
                email: 'patient2@gmail.com',
                password: '123456a',
                role: 'patient',
            },
            {
                name: 'Patient Three',
                email: 'patient3@gmail.com',
                password: '123456a',
                role: 'patient',
            },
        ];

        // Create users
        const createdUsers = await User.create(testUsers);
        console.log(`✓ Created ${createdUsers.length} test users`);

        // Create sample doctors and link to doctor users
        const doctorUsers = createdUsers.filter(u => u.role === 'doctor');
        
        if (doctorUsers.length > 0) {
            const sampleDoctors = [
                {
                    name: doctorUsers[0].name,
                    charges: 500,
                    category: 'Physiotherapist',
                    rating: 4.8,
                    availability: 'Available',
                    experience: 10,
                    qualification: 'DPT, CSCS',
                    description: 'Specialist in orthopedic rehabilitation',
                    user: doctorUsers[0]._id,
                },
                {
                    name: doctorUsers[1].name,
                    charges: 600,
                    category: 'Neurologist',
                    rating: 4.9,
                    availability: 'Available',
                    experience: 8,
                    qualification: 'DPT, Neurology Cert',
                    description: 'Expert in neurological disorders',
                    user: doctorUsers[1]._id,
                },
            ];

            await Doctor.create(sampleDoctors);
            console.log(`✓ Created ${sampleDoctors.length} sample doctor profiles`);
        }

        console.log('\n📋 Test Users Created:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n🔐 ADMIN:');
        console.log('  Email: admin@gmail.com');
        console.log('  Password: 123456a');
        console.log('\n👨‍⚕️ DOCTORS:');
        console.log('  1. Email: doctor1@gmail.com | Password: 123456a');
        console.log('  2. Email: doctor2@gmail.com | Password: 123456a');
        console.log('\n👥 PATIENTS:');
        console.log('  1. Email: patient1@gmail.com | Password: 123456a');
        console.log('  2. Email: patient2@gmail.com | Password: 123456a');
        console.log('  3. Email: patient3@gmail.com | Password: 123456a');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding users:', err.message);
        process.exit(1);
    }
}

seedTestUsers();
