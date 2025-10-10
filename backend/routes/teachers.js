
const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');

router.get('/', async (req,res)=>{
  const list = await Teacher.find();
  res.json(list);
});
router.post('/', async (req,res)=>{
  const t = new Teacher(req.body);
  await t.save();
  res.json(t);
});
module.exports = router;
