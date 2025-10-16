// backend/routes/timetable.js
const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');
const Teacher = require('../models/Teacher');
const PDFDocument = require('pdfkit');

// ✅ 1️⃣ Save timetable
router.post('/save', async (req, res) => {
  const { year, section, data, adminId } = req.body;
  try {
    const t = new Timetable({ year, section, data, generatedBy: adminId });
    await t.save();
    res.json(t);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ✅ 2️⃣ Get timetable by year + section
router.get('/:year/:section', async (req, res) => {
  const { year, section } = req.params;
  try {
    const t = await Timetable.findOne({ year: Number(year), section });
    if (!t) return res.status(404).json({ message: 'Timetable not found' });
    res.json(t);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ✅ 3️⃣ Generate timetable (basic round-robin)
router.post('/generate', async (req, res) => {
  const { allocations, days, periodsPerDay } = req.body;

  const slots = [];
  allocations.forEach(a => {
    const count = Number(a.hoursPerWeek || 0);
    for (let i = 0; i < count; i++) {
      slots.push({
        subjectId: a.subjectId,
        subjectName: a.name,
        subjectCode: a.code,
        teacherId: a.teacherId,
        teacherName: a.teacherId ? "" : "", // can lookup teacher name later
        type: a.type
      });
    }
  });

  const template = {};
  days.forEach(d => {
    template[d] = {};
    for (let p = 1; p <= periodsPerDay; p++) template[d][p] = null;
  });

  let sIdx = 0;
  for (let d of days) {
    for (let p = 1; p <= periodsPerDay; p++) {
      if (sIdx >= slots.length) break;
      const s = slots[sIdx++];
      template[d][p] = {
        subjectCode: s.subjectCode,
        teacher: s.teacherName || "TBD",
        type: s.type || "theory"
      };
    }
  }

  res.json({ template });
});

// ✅ 4️⃣ Auto-fill timetable (simple greedy fill)
router.post('/autofill', async (req, res) => {
  const { template, subjects, teachers } = req.body;
  try {
    const filled = JSON.parse(JSON.stringify(template));
    const subjList = [...subjects];
    let si = 0;

    for (const day of Object.keys(filled)) {
      for (const period of Object.keys(filled[day])) {
        if (filled[day][period] && filled[day][period].subject) continue;
        const subj = subjList[si % subjList.length];
        const teacher = teachers[si % teachers.length];
        filled[day][period] = {
          subject: subj.name,
          subjectCode: subj.code,
          teacher: teacher.name,
          type: subj.type || 'theory'
        };
        si++;
      }
    }

    res.json({ filled });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ✅ 5️⃣ Generate timetable PDF
router.get('/:id/pdf', async (req, res) => {
  try {
    const tdoc = await Timetable.findById(req.params.id);
    if (!tdoc) return res.status(404).send('Timetable not found');

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=timetable-${tdoc._id}.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text(`Timetable - Year ${tdoc.year} Section ${tdoc.section}`, { align: 'center' });
    doc.moveDown();

    const days = Object.keys(tdoc.data || {});
    const periods = Object.keys((tdoc.data && tdoc.data[days[0]]) || {});

    const cellWidth = 70;
    const startX = doc.x;
    const startY = doc.y + 10;

    // Table Header
    doc.fontSize(10).text('Day/Period', startX, startY);
    let x = startX + 80;
    periods.forEach(p => {
      doc.text(p, x, startY);
      x += cellWidth;
    });

    let y = startY + 16;
    days.forEach(d => {
      x = startX;
      doc.text(d, x, y);
      x += 80;
      periods.forEach(p => {
        const cell = tdoc.data[d] && tdoc.data[d][p];
        const text = cell
          ? `${cell.subjectCode || cell.subject || ''}\n${cell.teacher || ''}`
          : '-';
        doc.text(text, x, y, { width: cellWidth, height: 40 });
        x += cellWidth;
      });
      y += 40;
      if (y > 700) { doc.addPage(); y = 40; }
    });

    doc.end();
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;
