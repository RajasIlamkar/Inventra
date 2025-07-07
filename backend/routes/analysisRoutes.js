// /server/routes/analysisRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { analyzeWithGroq } = require('../utils/groqService');
const { getStats } = require('../controllers/statsController');

const router = express.Router();

// Route 1: Statistics for dashboard (orders, revenue, etc.)
router.get('/stats', authMiddleware, getStats);

// Route 2: AI-powered analysis using Groq
router.get('/groq', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userEmail = req.user.email;

    const Inventory = require('../models/Inventory');
    const Order = require('../models/Order');

    const inventoryItems = await Inventory.find({ user: userId });
    const orders = await Order.find({ userEmail });

    const result = await analyzeWithGroq(inventoryItems, orders);
    res.json(result);
  } catch (err) {
    console.error('Groq analysis error:', err);
    res.status(500).json({ message: 'Failed to analyze data' });
  }
});

module.exports = router;
