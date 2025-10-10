
const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');
const Teacher = require('../models/Teacher');

// Save timetable
router.post('/save', async (req,res)=>{
  const {year, section, data, adminId} = req.body;
  const t = new Timetable({year, section, data, generatedBy: adminId});
  await t.save();
  res.json(t);
});

// Get timetable by year+section
router.get('/:year/:section', async (req,res)=>{
  const {year,section} = req.params;
  const t = await Timetable.findOne({year: Number(year), section});
  res.json(t);
});

// Simple auto-fill: fill empty slots with available subjects/teachers
router.post('/autofill', async (req,res)=>{
  // req.body should contain: year, section, template (days->periods), subjects[], teachers[]
  // Basic greedy fill without deep optimization
  const {template, subjects, teachers} = req.body;
  // Convert subjects and teachers to simple arrays
  const filled = JSON.parse(JSON.stringify(template));
  const teacherIndex = {};
  teachers.forEach((t,i)=> teacherIndex[i]=t);

  // Flatten subject list by required slots (subject.type rules handled on client)
  const subjList = [...subjects];
  let si = 0;
  for(const day of Object.keys(filled)){
    for(const period of Object.keys(filled[day])){
      if(filled[day][period] && filled[day][period].subject) continue;
      const subj = subjList[si % subjList.length];
      const teacher = teachers[si % teachers.length];
      filled[day][period] = { subject: subj.name, subjectCode: subj.code, teacher: teacher.name, type: subj.type || 'theory' };
      si++;
    }
  }
  res.json({filled});
});

module.exports = router;
