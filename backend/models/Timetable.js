
const mongoose = require('mongoose');
const TimetableSchema = new mongoose.Schema({
  year: Number,
  section: String,
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  data: Object, // store timetable as nested object: day -> period -> {subject, teacher, type}
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Timetable', TimetableSchema);
