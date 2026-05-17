// seed.js
// Populates the database with sample data for BOTH:
//   - server.js  (session-based web app, port 3001)
//   - app.js     (JWT REST API, port 4000)
//
// Run: npm run seed   OR   node seed.js

require('dotenv').config();
const mongoose    = require('mongoose');
const Doctor      = require('./models/Doctor');
const User        = require('./models/User');
const Appointment = require('./models/Appointment');

// ============================================================
// SAMPLE DOCTOR DATA — 30 realistic Pakistani doctors
// ============================================================
const doctors = [

    // ─────────────── PHYSIOTHERAPISTS (5) ───────────────
    {
        name: 'Dr. Ahmed Raza',
        charges: 2500,
        category: 'Physiotherapist',
        rating: 4.8,
        availability: 'Available',
        image: 'https://randomuser.me/api/portraits/men/10.jpg',
        experience: 8,
        qualification: 'DPT, MSPT (UK)',
        description: 'Specialist in musculoskeletal physiotherapy with expertise in post-surgical rehabilitation and sports injuries. Has successfully treated over 3,000 patients at leading hospitals in Lahore.',
    },
    {
        name: 'Dr. Sana Tariq',
        charges: 2000,
        category: 'Physiotherapist',
        rating: 4.6,
        availability: 'Available',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        experience: 5,
        qualification: 'DPT, Certified Manual Therapist',
        description: 'Expert in neurological physiotherapy and pediatric rehabilitation. Known for her compassionate, patient-centered approach and use of evidence-based treatment protocols.',
    },
    {
        name: 'Dr. Talha Qureshi',
        charges: 3000,
        category: 'Physiotherapist',
        rating: 4.9,
        availability: 'Limited Slots',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        experience: 12,
        qualification: 'DPT, PhD Rehabilitation Sciences',
        description: 'Senior physiotherapist and faculty member at University of Health Sciences. Extensive expertise in spinal rehabilitation, chronic pain management, and post-stroke motor recovery.',
    },
    {
        name: 'Dr. Lubna Farooq',
        charges: 2200,
        category: 'Physiotherapist',
        rating: 4.7,
        availability: 'Available',
        image: 'https://randomuser.me/api/portraits/women/22.jpg',
        experience: 6,
        qualification: 'DPT, MSc Sports Medicine',
        description: "Specializes in women's health physiotherapy and post-partum rehabilitation. Certified in dry needling, cupping therapy, and manual therapy techniques.",
    },
    {
        name: 'Dr. Kashif Aziz',
        charges: 2800,
        category: 'Physiotherapist',
        rating: 4.5,
        availability: 'Available',
        image: 'https://randomuser.me/api/portraits/men/14.jpg',
        experience: 9,
        qualification: 'DPT, Diploma in Acupuncture',
        description: 'Expert in electrotherapy, ultrasound therapy, and traction techniques. Highly experienced in treating chronic pain conditions, fracture rehabilitation, and post-operative recovery.',
    },

    // ─────────────── PSYCHOLOGISTS (5) ───────────────
    {
        name: 'Dr. Fatima Khan',
        charges: 3500,
        category: 'Psychologist',
        rating: 4.9,
        availability: 'Limited Slots',
        image: 'https://randomuser.me/api/portraits/women/65.jpg',
        experience: 10,
        qualification: 'PhD Clinical Psychology (UK)',
        description: 'Specialist in cognitive behavioral therapy (CBT) and trauma-focused therapy. Experienced in treating anxiety disorders, clinical depression, PTSD, and phobias.',
    },
    {
        name: 'Dr. Imran Shafi',
        charges: 4000,
        category: 'Psychologist',
        rating: 4.8,
        availability: 'Available',
        image: 'https://randomuser.me/api/portraits/men/44.jpg',
        experience: 15,
        qualification: 'PhD Psychology, Certified EMDR Therapist',
        description: 'Senior psychologist with expertise in EMDR therapy for trauma and PTSD. Formerly worked with WHO mental health programs in Pakistan and published research internationally.',
    },
    {
        name: 'Dr. Hina Baig',
        charges: 3000,
        category: 'Psychologist',
        rating: 4.6,
        availability: 'Available',
        image: 'https://randomuser.me/api/portraits/women/30.jpg',
        experience: 7,
        qualification: 'MPhil Clinical Psychology',
        description: 'Specialist in child and adolescent psychology. Experienced in diagnosing and treating ADHD, autism spectrum disorder, developmental delays, and behavioral issues in children.',
    },
    {
        name: 'Dr. Jawad Anwar',
        charges: 3500,
        category: 'Psychologist',
        rating: 4.7,
        availability: 'Available',
        image: 'https://randomuser.me/api/portraits/men/52.jpg',
        experience: 8,
        qualification: 'PhD Psychology, DBT Certified',
        description: 'Expert in dialectical behavior therapy (DBT) and mindfulness-based interventions. Specializes in personality disorders, emotional dysregulation, and self-harm prevention.',
    },
    {
        name: 'Dr. Rukhsana Pasha',
        charges: 2500,
        category: 'Psychologist',
        rating: 4.5,
        availability: 'Fully Booked',
        image: 'https://randomuser.me/api/portraits/women/58.jpg',
        experience: 5,
        qualification: 'MPhil Clinical Psychology',
        description: 'Specializes in couple counseling and family therapy. Experienced in helping individuals and families navigate relationship conflicts, grief, and major life transitions.',
    },

    // ─────────────── ORTHOPEDIC SPECIALISTS (4) ───────────────
    {
        name: 'Dr. Muhammad Saleem',
        charges: 5000,
        category: 'Orthopedic Specialist',
        rating: 4.9,
        availability: 'Limited Slots',
        image: 'https://randomuser.me/api/portraits/men/3.jpg',
        experience: 18,
        qualification: 'MBBS, FCPS Orthopedics',
        description: 'Senior orthopedic surgeon with unmatched expertise in joint replacement, spinal surgery, and complex fracture management. Has performed over 2,500 successful orthopedic procedures.',
    },
    {
        name: 'Dr. Nadia Malik',
        charges: 4500,
        category: 'Orthopedic Specialist',
        rating: 4.7,
        availability: 'Available',
        image: 'https://randomuser.me/api/portraits/women/7.jpg',
        experience: 12,
        qualification: 'MBBS, FCPS Orthopedics, Fellowship (Germany)',
        description: 'Pioneer in pediatric orthopedics and minimally invasive spinal procedures in Pakistan. Specialist in scoliosis correction, limb deformity management, and developmental hip dysplasia.',
    },
    {
        name: 'Dr. Faisal Iqbal',
        charges: 5500,
        category: 'Orthopedic Specialist',
        rating: 4.8,
        availability: 'Available',
        image: 'https://randomuser.me/api/portraits/men/60.jpg',
        experience: 14,
        qualification: 'MBBS, FRCS Orthopedics (UK)',
        description: 'Expert in sports medicine and arthroscopic surgery. Team orthopedic consultant for Pakistan national sports programs and multiple premier league cricket clubs.',
    },
    {
        name: 'Dr. Samina Yousaf',
        charges: 4000,
        category: 'Orthopedic Specialist',
        rating: 4.6,
        availability: 'Available',
        image: 'https://randomuser.me/api/portraits/women/18.jpg',
        experience: 9,
        qualification: 'MBBS, FCPS Orthopedics',
        description: 'Specialist in bone and joint disorders, osteoporosis management, and post-fracture rehabilitation. Known for exceptional patient communication and superior post-surgical outcomes.',
    },

    // ─────────────── NEUROLOGISTS (4) ───────────────
    {
        name: 'Dr. Ayesha Siddiqui',
        charges: 6000,
        category: 'Neurologist',
        rating: 4.9,
        availability: 'Limited Slots',
        image: 'https://randomuser.me/api/portraits/women/25.jpg',
        experience: 16,
        qualification: 'MBBS, FCPS Neurology, Fellowship (USA)',
        description: 'Leading neurologist and researcher specializing in stroke rehabilitation, Parkinson\'s disease management, and neuro-degenerative conditions. Published over 20 peer-reviewed papers internationally.',
    },
    {
        name: 'Dr. Hassan Javed',
        charges: 5500,
        category: 'Neurologist',
        rating: 4.8,
        availability: 'Available',
        image: 'https://randomuser.me/api/portraits/men/20.jpg',
        experience: 13,
        qualification: 'MBBS, FCPS Neurology',
        description: 'Expert in epilepsy management, headache disorders, and neurodiagnostics. Specialist in EEG interpretation, nerve conduction studies, and advanced neuroimaging analysis.',
    },
    {
        name: 'Dr. Amna Riaz',
        charges: 5000,
        category: 'Neurologist',
        rating: 4.7,
        availability: 'Available',
        image: 'https://randomuser.me/api/portraits/women/35.jpg',
        experience: 10,
        qualification: 'MBBS, FCPS Neurology',
        description: 'Specialist in multiple sclerosis, autoimmune neurological disorders, and pediatric neurology. Active member of the Pakistan Neurological Society and international MS advisory board.',
    },
    {
        name: 'Dr. Nauman Rafi',
        charges: 6500,
        category: 'Neurologist',
        rating: 4.9,
        availability: 'Fully Booked',
        image: 'https://randomuser.me/api/portraits/men/41.jpg',
        experience: 20,
        qualification: 'MBBS, PhD Neuroscience (USA)',
        description: 'Internationally renowned neurologist and researcher. Expert in deep brain stimulation, advanced neurological rehabilitation, and rare movement disorders. Trained at Johns Hopkins University.',
    },

    // ─────────────── OCCUPATIONAL THERAPISTS (4) ───────────────
    {
        name: 'Dr. Bilal Mahmood',
        charges: 2500,
        category: 'Occupational Therapist',
        rating: 4.7,
        availability: 'Available',
        image: 'https://randomuser.me/api/portraits/men/15.jpg',
        experience: 7,
        qualification: 'B.Sc OT, MSc Rehabilitation (UK)',
        description: 'Expert in sensory integration therapy and hand rehabilitation. Specializes in helping post-stroke and spinal injury patients regain independence in daily activities and work.',
    },
    {
        name: 'Dr. Mehreen Akhtar',
        charges: 2200,
        category: 'Occupational Therapist',
        rating: 4.6,
        availability: 'Available',
        image: 'https://randomuser.me/api/portraits/women/40.jpg',
        experience: 6,
        qualification: 'B.Sc OT, Certified Sensory Integration Therapist',
        description: 'Specialist in pediatric occupational therapy and autism intervention. Certified in the Ayres Sensory Integration approach and Early Intensive Behavioral Intervention (EIBI).',
    },
    {
        name: 'Dr. Saad Mirza',
        charges: 3000,
        category: 'Occupational Therapist',
        rating: 4.8,
        availability: 'Limited Slots',
        image: 'https://randomuser.me/api/portraits/men/25.jpg',
        experience: 10,
        qualification: 'B.Sc OT, MSc Neurorehabilitation',
        description: 'Expert in neurological occupational therapy for TBI, stroke, and spinal cord injury patients. Certified in robotic rehabilitation and virtual reality-based therapy techniques.',
    },
    {
        name: 'Dr. Aisha Zahid',
        charges: 2000,
        category: 'Occupational Therapist',
        rating: 4.5,
        availability: 'Available',
        image: 'https://randomuser.me/api/portraits/women/50.jpg',
        experience: 4,
        qualification: 'B.Sc OT, Diploma Vocational Rehabilitation',
        description: 'Specialist in vocational rehabilitation, ergonomics assessment, and return-to-work programs. Helps patients rebuild confidence and professional skills after illness or injury.',
    },

    // ─────────────── SPEECH THERAPISTS (4) ───────────────
    {
        name: 'Dr. Zara Hussain',
        charges: 2500,
        category: 'Speech Therapist',
        rating: 4.8,
        availability: 'Available',
        image: 'https://randomuser.me/api/portraits/women/55.jpg',
        experience: 8,
        qualification: 'M.Sc Speech Language Pathology (USA)',
        description: 'Expert in articulation disorders, stuttering therapy, and voice rehabilitation. Specialist in Augmentative and Alternative Communication (AAC) for non-verbal patients.',
    },
    {
        name: 'Dr. Asad Butt',
        charges: 2000,
        category: 'Speech Therapist',
        rating: 4.6,
        availability: 'Available',
        image: 'https://randomuser.me/api/portraits/men/35.jpg',
        experience: 5,
        qualification: 'B.Sc SLP, M.Sc Communication Disorders',
        description: 'Specialist in pediatric speech and language disorders. Experienced in treating autism-related communication challenges, late talkers, and school-age language difficulties.',
    },
    {
        name: 'Dr. Komal Sheikh',
        charges: 2800,
        category: 'Speech Therapist',
        rating: 4.7,
        availability: 'Limited Slots',
        image: 'https://randomuser.me/api/portraits/women/62.jpg',
        experience: 9,
        qualification: 'M.Sc SLP, Certified PROMPT Therapist',
        description: 'Specialist in dysphagia (swallowing disorders) and neurogenic speech conditions. Certified PROMPT articulation intervention therapist with expertise in post-stroke communication recovery.',
    },
    {
        name: 'Dr. Rizwan Haider',
        charges: 3200,
        category: 'Speech Therapist',
        rating: 4.9,
        availability: 'Available',
        image: 'https://randomuser.me/api/portraits/men/55.jpg',
        experience: 12,
        qualification: 'PhD Communication Disorders (Australia)',
        description: 'Senior speech pathologist and consultant to multiple hospitals in Lahore. Expert in voice disorders, laryngeal conditions, and professional voice rehabilitation for singers and public speakers.',
    },

    // ─────────────── REHABILITATION CONSULTANTS (4) ───────────────
    {
        name: 'Dr. Usman Ali',
        charges: 4500,
        category: 'Rehabilitation Consultant',
        rating: 4.8,
        availability: 'Available',
        image: 'https://randomuser.me/api/portraits/men/22.jpg',
        experience: 14,
        qualification: 'MBBS, FCPS Rehabilitation Medicine',
        description: 'Specialist in comprehensive rehabilitation programs for post-stroke, spinal cord injury, and traumatic brain injury patients. Designs multi-disciplinary care plans for complex cases.',
    },
    {
        name: 'Dr. Rabia Nawaz',
        charges: 4000,
        category: 'Rehabilitation Consultant',
        rating: 4.7,
        availability: 'Available',
        image: 'https://randomuser.me/api/portraits/women/68.jpg',
        experience: 11,
        qualification: 'MBBS, Diploma Rehabilitation Medicine (UK)',
        description: 'Expert in pain rehabilitation, fibromyalgia management, and chronic fatigue syndrome. Uses a holistic approach combining medical, physiotherapy, and psychological interventions.',
    },
    {
        name: 'Dr. Waqas Chaudhry',
        charges: 5000,
        category: 'Rehabilitation Consultant',
        rating: 4.9,
        availability: 'Limited Slots',
        image: 'https://randomuser.me/api/portraits/men/46.jpg',
        experience: 17,
        qualification: 'MBBS, FCPS PM&R, Fellowship (Canada)',
        description: 'Senior rehabilitation consultant and director of rehabilitation at three leading hospitals in Lahore. Expert in prosthetics, orthotics, and advanced neuro-muscular rehabilitation.',
    },
    {
        name: 'Dr. Sadaf Pervez',
        charges: 3500,
        category: 'Rehabilitation Consultant',
        rating: 4.6,
        availability: 'Available',
        image: 'https://randomuser.me/api/portraits/women/48.jpg',
        experience: 8,
        qualification: 'MBBS, MSc Rehabilitation Medicine',
        description: 'Specialist in geriatric rehabilitation, fall prevention programs, and balance disorders. Experienced in managing complex multi-system rehabilitation cases for elderly patients.',
    },
];

// ============================================================
// SEED FUNCTION — connects, clears, inserts, disconnects
// ============================================================
const seedDatabase = async () => {
    try {
        // Step 1: Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Step 2: Delete all existing records
        await User.deleteMany({});
        await Doctor.deleteMany({});
        await Appointment.deleteMany({});
        console.log('🗑️  Cleared existing Users, Doctors, and Appointments');

        // Step 3: Create demo users (passwords hashed by pre-save hook)
        const adminUser = await User.create({
            name    : 'Admin User',
            email   : 'admin@multisensa.com',
            password: 'Admin@123',
            role    : 'admin',
        });
        // 'patient' role — used by the JWT API (app.js / port 4000)
        const patientUser = await User.create({
            name    : 'Ahmed Khan',
            email   : 'patient@multisensa.com',
            password: 'Patient@123',
            role    : 'patient',
        });
        // 'customer' role — used by the session-based app (server.js / port 3001)
        const customerUser = await User.create({
            name    : 'Sara Ali',
            email   : 'customer@multisensa.com',
            password: 'Customer@123',
            role    : 'customer',
        });
        const doctorUser = await User.create({
            name    : 'Dr. Talha Qureshi',
            email   : 'doctor@multisensa.com',
            password: 'Doctor@123',
            role    : 'doctor',
        });
        console.log(`👤 Created admin   : ${adminUser.email}`);
        console.log(`👤 Created patient : ${patientUser.email}`);
        console.log(`👤 Created customer: ${customerUser.email}`);
        console.log(`👤 Created doctor  : ${doctorUser.email}`);

        // Step 4: Insert all sample doctors at once
        const inserted = await Doctor.insertMany(doctors);
        console.log(`🌱 Seeded ${inserted.length} doctors`);

        // Step 5: Create a sample appointment (JWT API demo)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        await Appointment.create({
            user           : patientUser._id,
            doctor         : inserted[0]._id,
            appointmentDate: tomorrow,
            symptoms       : 'Lower back pain after a fall, difficulty walking.',
            status         : 'confirmed',
            notes          : 'Patient advised to bring previous X-ray reports.',
        });
        console.log(`📅 Created sample appointment: ${patientUser.name} → ${inserted[0].name}`);

        // Step 6: Disconnect cleanly
        await mongoose.disconnect();
        console.log('\n════════════════════════════════════════════');
        console.log('  ✅  Seeding complete!');
        console.log('════════════════════════════════════════════');
        console.log('  Demo Credentials');
        console.log('  Admin   : admin@multisensa.com    / Admin@123');
        console.log('  Patient : patient@multisensa.com  / Patient@123  (JWT API)');
        console.log('  Customer: customer@multisensa.com / Customer@123 (Web App)');
        console.log('  Doctor  : doctor@multisensa.com   / Doctor@123');
        console.log('════════════════════════════════════════════');
        console.log('  JWT API  → node app.js    (port 4000)');
        console.log('  Web App  → node server.js (port 3001)\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
};

// Run the seed function
seedDatabase();
