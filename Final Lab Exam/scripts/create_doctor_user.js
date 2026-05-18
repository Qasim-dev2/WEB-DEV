require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Create doctor user
    const email = 'doctor@multisensa.com';
    const password = 'Doctor@123';
    const name = 'Doctor Account';

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, password, role: 'doctor' });
      console.log('Created user:', email);
    } else {
      console.log('User already exists:', email);
    }

    // Link to first doctor without user
    const doc = await Doctor.findOne({ user: null });
    if (!doc) {
      console.log('No unlinked doctor found. Exiting.');
      await mongoose.disconnect();
      return;
    }

    doc.user = user._id;
    await doc.save();
    console.log(`Linked user ${email} -> doctor ${doc.name}`);

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
