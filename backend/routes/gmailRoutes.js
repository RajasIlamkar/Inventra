// ✅ server/routes/gmailRoutes.js
const express = require('express');
const router = express.Router();
const { fetchEmails } = require('../utils/gmailService');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/fetch', authMiddleware, async (req, res) => {
  try {
    await fetchEmails();
    res.status(200).json({ message: 'Gmail fetch & parse completed.' });
  } catch (err) {
    console.error('❌ Gmail fetch failed:', err);
    res.status(500).json({ message: 'Failed to fetch Gmail orders.' });
  }
});


module.exports = router;
