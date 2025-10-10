
const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');

router.get('/', async (req,res)=>{
  const list = await Subject.find();
  res.json(list);
});
router.post('/', async (req,res)=>{
  const s = new Subject(req.body);
  await s.save();
  res.json(s);
});
module.exports = router;
