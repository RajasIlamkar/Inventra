const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const { extractOrderFromText } = require('../aiParser');
const updateInventory  = require('../utils/updateInventory');


// GET /api/orders - Fetch orders belonging to the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const orders = await Order.find({ userEmail }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/orders/parse-email - Parse an email and create an order
router.post('/parse-email', authMiddleware, async (req, res) => {
  try {
    const { emailText } = req.body;
    const userEmail = req.user.email;

    const parsed = await extractOrderFromText(emailText);

    const order = new Order({
      customerName: parsed.customer || 'Unknown',
      emailText,
      sentiment: parsed.sentiment,
      items: parsed.items,
      userEmail,
    });

    await order.save();

    res.status(201).json(order);
  } catch (error) {
    console.error('Order parsing error:', error.message);
    res.status(500).json({ message: 'Failed to parse order' });
  }
});

// PATCH /api/orders/:id/status - Update order status and inventory
router.patch('/:id/status', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userEmail = req.user.email;

  try {
    const order = await Order.findOne({ _id: id, userEmail });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const wasFulfilled = order.status === 'fulfilled';
    order.status = status;
    await order.save();

    if (status === 'fulfilled' && !wasFulfilled) {
      // ✅ Pass full order now
      await updateInventory(order);
    }

    res.status(200).json({ message: 'Status updated', order });
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});


module.exports = router;
