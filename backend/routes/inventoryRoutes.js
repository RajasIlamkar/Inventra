// routes/inventoryRoutes.js
const express = require('express');
const Inventory = require('../models/Inventory');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  const items = await Inventory.find({ user: req.user.userId });
  res.json(items);
});

router.post('/', authMiddleware, async (req, res) => {
  const { name, quantity, price, threshold } = req.body;
  const item = new Inventory({
    name,
    quantity,
    price,
    threshold,
    user: req.user.userId,
  });
  await item.save();
  res.status(201).json(item);
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { quantity, threshold, price } = req.body;

    // Clone and prepare new values
    let newPrice = price;
    if (quantity != null && threshold != null) {
      if (quantity < threshold) {
        newPrice = Math.round(price * 1.1);
      } else if (quantity > 3 * threshold) {
        newPrice = Math.round(price * 0.95);
      }
    }

    const updated = await Inventory.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { ...req.body, price: newPrice },
      { new: true }
    );

    if (!updated) return res.status(403).json({ message: 'Not authorized' });

    res.json(updated);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/:id', authMiddleware, async (req, res) => {
  const deleted = await Inventory.findOneAndDelete({
    _id: req.params.id,
    user: req.user.userId,
  });
  if (!deleted) return res.status(403).json({ message: 'Not authorized' });
  res.json({ message: 'Deleted' });
});

module.exports = router;
