const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');

// Get all subjects
router.get('/', async (req, res) => {
  const subjects = await Subject.find();
  res.json(subjects);
});

// Add subject
router.post('/', async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const { year, section } = req.query;
  const filter = {};
  if (year) filter.year = Number(year);
  if (section) filter.section = section;
  try {
    const subs = await Subject.find(filter);
    res.json(subs);
  } catch (e) { res.status(500).json({error: e.message}); }
});

// Delete subject
router.delete('/:id', async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
