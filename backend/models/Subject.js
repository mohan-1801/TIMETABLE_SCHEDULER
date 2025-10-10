
const mongoose = require('mongoose');
const SubjectSchema = new mongoose.Schema({
  name: String,
  code: String,
  year: Number,
  section: String,
  type: { type: String, enum: ['theory','lab','theory+lab'] }
});
module.exports = mongoose.model('Subject', SubjectSchema);
