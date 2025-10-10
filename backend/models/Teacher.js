
const mongoose = require('mongoose');
const TeacherSchema = new mongoose.Schema({
  name: String,
  email: String,
  department: String,
  availability: { type: Object, default: {} } // optional: store available periods as { 'year-section-day-period': true }
});
module.exports = mongoose.model('Teacher', TeacherSchema);
