// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
console.log("🧠 Using Mongo URI:", process.env.MONGO_URI);


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI not set in .env');
  process.exit(1);
}
console.log('🧠 Using Mongo URI:', MONGO_URI);

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Models
const Admin = require('./models/Admin');
const Teacher = require('./models/Teacher');
const Subject = require('./models/Subject');
const Timetable = require('./models/Timetable');

// Routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/timetable', require('./routes/timetable'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
