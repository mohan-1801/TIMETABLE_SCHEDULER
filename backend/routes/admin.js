const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login body:', req.body);

    const admin = await Admin.findOne({ username });
    if (!admin) {
      console.log('❌ No admin found for username:', username);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare plain passwords
    if (password.trim() !== admin.password.trim()) {
      console.log('❌ Password mismatch');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful for:', username);
    res.json({ token, username });
  } catch (err) {
    console.error('💥 Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
