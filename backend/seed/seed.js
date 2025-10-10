// seed.js
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');
require('dotenv').config();

(async () => {
  try {
    console.log('🌍 Using MONGO_URI:', process.env.MONGO_URI);
    if (!process.env.MONGO_URI) {
      throw new Error('❌ MONGO_URI not found in .env');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB Atlas for seeding');

    // Clear existing data
    await Admin.deleteMany({});
    await Teacher.deleteMany({});
    await Subject.deleteMany({});

    // Store plain password
    const plainPassword = 'admin123';
    console.log('Plain password:', plainPassword);

    await new Admin({
      username: 'admin',
      password: plainPassword, // store plain password (no hash)
    }).save();

    console.log('✅ Admin created: admin/admin123');

    // Teachers
    const teachers = [
      { name: 'Prof A', email: 'a@college.edu', department: 'CSE' },
      { name: 'Prof B', email: 'b@college.edu', department: 'CSE' },
      { name: 'Prof C', email: 'c@college.edu', department: 'ECE' },
    ];
    await Teacher.insertMany(teachers);

    // Subjects
    const subjects = [
      { name: 'Maths', code: 'MTH101', year: 1, section: 'A', type: 'theory' },
      { name: 'Physics Lab', code: 'PHYL101', year: 1, section: 'A', type: 'lab' },
      { name: 'Programming', code: 'CS101', year: 1, section: 'A', type: 'theory+lab' },
    ];
    await Subject.insertMany(subjects);

    console.log('🌱 Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('💥 Seeding error:', err);
    process.exit(1);
  }
})();
