require('dotenv').config();
const mongoose    = require('mongoose');
const bcrypt      = require('bcryptjs');
const Doctor      = require('./models/Doctor');
const User        = require('./models/User');
const Appointment = require('./models/Appointment');

const pics = [
    '/uploads/doctors/OIP.jpg',
    '/uploads/doctors/OIP (1).jpg',
    '/uploads/doctors/OIP (2).jpg',
    '/uploads/doctors/OIP (3).jpg',
    '/uploads/doctors/OIP (4).jpg',
    '/uploads/doctors/doctor-1779055617090-868188044.jpeg',
];
const p = (i) => pics[i % pics.length];

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected');

    await Appointment.deleteMany({});
    await Doctor.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared all collections');

    // ── ADMIN ──────────────────────────────────────────────────
    const admin = await User.create({ name: 'Admin', email: 'admin@gmail.com', password: '123456', role: 'admin' });

    // ── DOCTOR USERS ──────────────────────────────────────────
    const doctorUsers = await User.insertMany([
        { name: 'Dr. Ahmed Raza',      email: 'doctor1@gmail.com', password: '123456', role: 'doctor' },
        { name: 'Dr. Sana Tariq',      email: 'doctor2@gmail.com', password: '123456', role: 'doctor' },
        { name: 'Dr. Fatima Khan',     email: 'doctor3@gmail.com', password: '123456', role: 'doctor' },
        { name: 'Dr. Hassan Javed',    email: 'doctor4@gmail.com', password: '123456', role: 'doctor' },
        { name: 'Dr. Ayesha Siddiqui', email: 'doctor5@gmail.com', password: '123456', role: 'doctor' },
    ]);
    // hash passwords (pre-save hook only runs on save(), not insertMany)
    // Re-create them one by one so hook fires
    await User.deleteMany({ role: 'doctor' });
    const d1 = await User.create({ name: 'Dr. Ahmed Raza',      email: 'doctor1@gmail.com', password: '123456', role: 'doctor' });
    const d2 = await User.create({ name: 'Dr. Sana Tariq',      email: 'doctor2@gmail.com', password: '123456', role: 'doctor' });
    const d3 = await User.create({ name: 'Dr. Fatima Khan',     email: 'doctor3@gmail.com', password: '123456', role: 'doctor' });
    const d4 = await User.create({ name: 'Dr. Hassan Javed',    email: 'doctor4@gmail.com', password: '123456', role: 'doctor' });
    const d5 = await User.create({ name: 'Dr. Ayesha Siddiqui', email: 'doctor5@gmail.com', password: '123456', role: 'doctor' });
    const dUsers = [d1, d2, d3, d4, d5];

    // ── PATIENT USERS ─────────────────────────────────────────
    const p1 = await User.create({ name: 'Ali Hassan',    email: 'patient1@gmail.com', password: '123456', role: 'patient' });
    const p2 = await User.create({ name: 'Sara Ahmed',    email: 'patient2@gmail.com', password: '123456', role: 'patient' });
    const p3 = await User.create({ name: 'Bilal Khan',    email: 'patient3@gmail.com', password: '123456', role: 'patient' });
    const p4 = await User.create({ name: 'Mariam Raza',   email: 'patient4@gmail.com', password: '123456', role: 'patient' });
    const p5 = await User.create({ name: 'Usman Farooq',  email: 'patient5@gmail.com', password: '123456', role: 'patient' });
    const pUsers = [p1, p2, p3, p4, p5];

    console.log('Created all users');

    // ── DOCTORS (linked to user accounts) ─────────────────────
    // Helper: compute discounted fee
    const sale = (charges, pct) => ({
        isOnSale: true,
        discountPercentage: pct,
        originalFee: charges,
        discountedFee: Math.round(charges - (charges * pct / 100)),
    });

    const docData = [
        { name: 'Dr. Ahmed Raza',      charges: 2500, category: 'Physiotherapist',        rating: 4.8, availability: 'Available',     image: p(0), experience: 8,  qualification: 'DPT, MSPT (UK)',                         description: 'Specialist in musculoskeletal physiotherapy with expertise in post-surgical rehabilitation and sports injuries.',        ...sale(2500, 20) },
        { name: 'Dr. Sana Tariq',      charges: 2000, category: 'Physiotherapist',        rating: 4.6, availability: 'Available',     image: p(1), experience: 5,  qualification: 'DPT, Certified Manual Therapist',        description: 'Expert in neurological physiotherapy and pediatric rehabilitation with evidence-based treatment protocols.',          ...sale(2000, 15) },
        { name: 'Dr. Fatima Khan',     charges: 3500, category: 'Psychologist',           rating: 4.9, availability: 'Limited Slots', image: p(2), experience: 10, qualification: 'PhD Clinical Psychology (UK)',            description: 'Specialist in CBT and trauma-focused therapy. Expert in anxiety, depression, and PTSD treatment.',                   ...sale(3500, 10) },
        { name: 'Dr. Hassan Javed',    charges: 5500, category: 'Neurologist',            rating: 4.8, availability: 'Available',     image: p(3), experience: 13, qualification: 'MBBS, FCPS Neurology',                    description: 'Expert in epilepsy management and headache disorders. Specialist in EEG interpretation.',                           ...sale(5500, 25) },
        { name: 'Dr. Ayesha Siddiqui', charges: 6000, category: 'Neurologist',            rating: 4.9, availability: 'Limited Slots', image: p(4), experience: 16, qualification: 'MBBS, FCPS Neurology, Fellowship (USA)',  description: 'Leading neurologist specializing in stroke rehabilitation and Parkinson disease management.',                        ...sale(6000, 30) },
        { name: 'Dr. Talha Qureshi',   charges: 3000, category: 'Physiotherapist',        rating: 4.9, availability: 'Limited Slots', image: p(5), experience: 12, qualification: 'DPT, PhD Rehabilitation Sciences',       description: 'Senior physiotherapist with expertise in spinal rehabilitation and chronic pain management.',                       ...sale(3000, 20) },
        { name: 'Dr. Lubna Farooq',    charges: 2200, category: 'Physiotherapist',        rating: 4.7, availability: 'Available',     image: p(0), experience: 6,  qualification: 'DPT, MSc Sports Medicine',                description: 'Specializes in post-partum rehabilitation. Certified in dry needling and manual therapy.',                          ...sale(2200, 15) },
        { name: 'Dr. Imran Shafi',     charges: 4000, category: 'Psychologist',           rating: 4.8, availability: 'Available',     image: p(1), experience: 15, qualification: 'PhD Psychology, Certified EMDR Therapist', description: 'Senior psychologist with EMDR expertise. Formerly with WHO mental health programs in Pakistan.' },
        { name: 'Dr. Hina Baig',       charges: 3000, category: 'Psychologist',           rating: 4.6, availability: 'Available',     image: p(2), experience: 7,  qualification: 'MPhil Clinical Psychology',               description: 'Specialist in child and adolescent psychology. Expert in ADHD and autism spectrum disorder.' },
        { name: 'Dr. Muhammad Saleem', charges: 5000, category: 'Orthopedic Specialist',  rating: 4.9, availability: 'Limited Slots', image: p(3), experience: 18, qualification: 'MBBS, FCPS Orthopedics',                  description: 'Senior orthopedic surgeon with expertise in joint replacement and spinal surgery.',                                  ...sale(5000, 50) },
        { name: 'Dr. Nadia Malik',     charges: 4500, category: 'Orthopedic Specialist',  rating: 4.7, availability: 'Available',     image: p(4), experience: 12, qualification: 'MBBS, FCPS Orthopedics, Fellowship (Germany)', description: 'Pioneer in pediatric orthopedics and minimally invasive spinal procedures.',                                    ...sale(4500, 25) },
        { name: 'Dr. Faisal Iqbal',    charges: 5500, category: 'Orthopedic Specialist',  rating: 4.8, availability: 'Available',     image: p(5), experience: 14, qualification: 'MBBS, FRCS Orthopedics (UK)',             description: 'Expert in sports medicine and arthroscopic surgery.' },
        { name: 'Dr. Amna Riaz',       charges: 5000, category: 'Neurologist',            rating: 4.7, availability: 'Available',     image: p(0), experience: 10, qualification: 'MBBS, FCPS Neurology',                    description: 'Specialist in multiple sclerosis, autoimmune neurological disorders and pediatric neurology.' },
        { name: 'Dr. Bilal Mahmood',   charges: 2500, category: 'Occupational Therapist', rating: 4.7, availability: 'Available',     image: p(1), experience: 7,  qualification: 'B.Sc OT, MSc Rehabilitation (UK)',        description: 'Expert in sensory integration therapy and hand rehabilitation for post-stroke patients.',                           ...sale(2500, 20) },
        { name: 'Dr. Mehreen Akhtar',  charges: 2200, category: 'Occupational Therapist', rating: 4.6, availability: 'Available',     image: p(2), experience: 6,  qualification: 'B.Sc OT, Certified Sensory Integration Therapist', description: 'Specialist in pediatric occupational therapy and autism intervention.' },
        { name: 'Dr. Saad Mirza',      charges: 3000, category: 'Occupational Therapist', rating: 4.8, availability: 'Limited Slots', image: p(3), experience: 10, qualification: 'B.Sc OT, MSc Neurorehabilitation',       description: 'Expert in neurological OT for TBI, stroke and spinal cord injury patients.',                                        ...sale(3000, 35) },
        { name: 'Dr. Zara Hussain',    charges: 2500, category: 'Speech Therapist',       rating: 4.8, availability: 'Available',     image: p(4), experience: 8,  qualification: 'M.Sc Speech Language Pathology (USA)',    description: 'Expert in articulation disorders, stuttering therapy and voice rehabilitation.',                                    ...sale(2500, 10) },
        { name: 'Dr. Rizwan Haider',   charges: 3200, category: 'Speech Therapist',       rating: 4.9, availability: 'Available',     image: p(5), experience: 12, qualification: 'PhD Communication Disorders (Australia)',  description: 'Senior speech pathologist. Expert in voice disorders and post-stroke communication recovery.',                     ...sale(3200, 30) },
        { name: 'Dr. Usman Ali',       charges: 4500, category: 'Rehabilitation Consultant', rating: 4.8, availability: 'Available', image: p(0), experience: 14, qualification: 'MBBS, FCPS Rehabilitation Medicine',      description: 'Specialist in comprehensive rehabilitation for post-stroke and spinal cord injury patients.',                       ...sale(4500, 20) },
        { name: 'Dr. Rabia Nawaz',     charges: 4000, category: 'Rehabilitation Consultant', rating: 4.7, availability: 'Available', image: p(1), experience: 11, qualification: 'MBBS, Diploma Rehabilitation Medicine (UK)', description: 'Expert in pain rehabilitation, fibromyalgia and chronic fatigue syndrome.' },
    ];

    // Link first 5 doctors to user accounts
    for (let i = 0; i < 5; i++) docData[i].user = dUsers[i]._id;

    const doctors = await Promise.all(docData.map(d => new Doctor(d).save()));
    console.log('Created ' + doctors.length + ' doctors');

    // ── APPOINTMENTS ──────────────────────────────────────────
    const d = (daysFromNow) => { const dt = new Date(); dt.setDate(dt.getDate() + daysFromNow); return dt; };

    const appointments = [
        // patient1 - Ali Hassan (multiple bookings)
        { patient: p1._id, doctor: doctors[0]._id, appointmentDate: d(-5), appointmentTime: '10:00', phone: '03001111111', symptoms: 'Lower back pain after gym injury. Difficulty bending forward.', status: 'completed', notes: 'Bring previous physiotherapy records.' },
        { patient: p1._id, doctor: doctors[0]._id, appointmentDate: d(3),  appointmentTime: '10:00', phone: '03001111111', symptoms: 'Follow-up: knee pain and stiffness after the last session.', status: 'approved' },
        { patient: p1._id, doctor: doctors[2]._id, appointmentDate: d(7),  appointmentTime: '14:00', phone: '03001111111', symptoms: 'Anxiety and work-related stress. Trouble sleeping at night.', status: 'pending' },

        // patient2 - Sara Ahmed
        { patient: p2._id, doctor: doctors[1]._id, appointmentDate: d(-10), appointmentTime: '11:00', phone: '03002222222', symptoms: 'Shoulder pain after car accident. Limited range of motion.', status: 'completed', notes: 'X-Ray reports reviewed.' },
        { patient: p2._id, doctor: doctors[3]._id, appointmentDate: d(-2),  appointmentTime: '15:00', phone: '03002222222', symptoms: 'Frequent migraines, twice a week for the last month.', status: 'approved' },
        { patient: p2._id, doctor: doctors[4]._id, appointmentDate: d(5),   appointmentTime: '09:00', phone: '03002222222', symptoms: 'Numbness in left hand and tingling sensation in fingers.', status: 'pending' },

        // patient3 - Bilal Khan
        { patient: p3._id, doctor: doctors[0]._id, appointmentDate: d(-7), appointmentTime: '09:30', phone: '03003333333', symptoms: 'Sports injury to right ankle. Pain while walking.', status: 'completed' },
        { patient: p3._id, doctor: doctors[9]._id, appointmentDate: d(-3), appointmentTime: '11:30', phone: '03003333333', symptoms: 'Knee joint pain and swelling after running.', status: 'rejected', adminNotes: 'Patient should get MRI done first before consultation.' },
        { patient: p3._id, doctor: doctors[2]._id, appointmentDate: d(2),  appointmentTime: '16:00', phone: '03003333333', symptoms: 'Depression and mood swings. Referred by GP.', status: 'pending' },
        { patient: p3._id, doctor: doctors[1]._id, appointmentDate: d(10), appointmentTime: '10:30', phone: '03003333333', symptoms: 'Wrist pain and weakness after repetitive strain.', status: 'pending' },

        // patient4 - Mariam Raza
        { patient: p4._id, doctor: doctors[4]._id, appointmentDate: d(-1), appointmentTime: '12:00', phone: '03004444444', symptoms: 'Severe headaches and vision disturbances. History of hypertension.', status: 'approved' },
        { patient: p4._id, doctor: doctors[7]._id, appointmentDate: d(4),  appointmentTime: '13:00', phone: '03004444444', symptoms: 'PTSD symptoms after a road accident three months ago.', status: 'pending' },
        { patient: p4._id, doctor: doctors[3]._id, appointmentDate: d(8),  appointmentTime: '15:00', phone: '03004444444', symptoms: 'Memory loss and confusion episodes reported by family.', status: 'pending' },

        // patient5 - Usman Farooq
        { patient: p5._id, doctor: doctors[1]._id, appointmentDate: d(-4), appointmentTime: '14:30', phone: '03005555555', symptoms: 'Neck stiffness and upper back pain. Office worker, desk-bound.', status: 'completed', notes: 'Posture correction exercises prescribed.' },
        { patient: p5._id, doctor: doctors[6]._id, appointmentDate: d(-1), appointmentTime: '10:00', phone: '03005555555', symptoms: 'Post-partum back pain. 3 months after delivery.', status: 'approved' },
        { patient: p5._id, doctor: doctors[0]._id, appointmentDate: d(1),  appointmentTime: '11:00', phone: '03005555555', symptoms: 'Hip pain radiating down the left leg (sciatica symptoms).', status: 'pending' },
        { patient: p5._id, doctor: doctors[5]._id, appointmentDate: d(6),  appointmentTime: '09:00', phone: '03005555555', symptoms: 'Chronic lower back pain — physiotherapy evaluation needed.', status: 'pending' },
    ];

    for (const appt of appointments) await new Appointment(appt).save();
    console.log('Created ' + appointments.length + ' appointments');

    await mongoose.disconnect();
    console.log('\n===================================================');
    console.log('  SEED COMPLETE');
    console.log('===================================================');
    console.log('  Admin  : admin@gmail.com    / 123456');
    console.log('  Doctor1: doctor1@gmail.com  / 123456  (Dr. Ahmed Raza - Physiotherapist)');
    console.log('  Doctor2: doctor2@gmail.com  / 123456  (Dr. Sana Tariq - Physiotherapist)');
    console.log('  Doctor3: doctor3@gmail.com  / 123456  (Dr. Fatima Khan - Psychologist)');
    console.log('  Doctor4: doctor4@gmail.com  / 123456  (Dr. Hassan Javed - Neurologist)');
    console.log('  Doctor5: doctor5@gmail.com  / 123456  (Dr. Ayesha Siddiqui - Neurologist)');
    console.log('  Patient1: patient1@gmail.com / 123456  (Ali Hassan)');
    console.log('  Patient2: patient2@gmail.com / 123456  (Sara Ahmed)');
    console.log('  Patient3: patient3@gmail.com / 123456  (Bilal Khan)');
    console.log('  Patient4: patient4@gmail.com / 123456  (Mariam Raza)');
    console.log('  Patient5: patient5@gmail.com / 123456  (Usman Farooq)');
    console.log('===================================================\n');
    process.exit(0);
}

seed().catch(e => { console.error(e.message); process.exit(1); });
