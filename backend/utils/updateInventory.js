const Inventory = require('../models/Inventory');
const User = require('../models/User');

async function updateInventory(order) {
  try {
    // Find the user by email
    const user = await User.findOne({ email: order.userEmail });

    if (!user) {
      console.warn(`⚠️ No user found with email ${order.userEmail}`);
      return;
    }

    for (const item of order.items) {
      const normalizedName = item.product.trim().toLowerCase();

      const inventoryItem = await Inventory.findOne({
        name: { $regex: new RegExp(`^${normalizedName}$`, 'i') }, // case-insensitive exact match
        user: user._id,
      });

      if (!inventoryItem) {
        console.warn(`⚠️ Inventory item "${item.product}" not found for user ${user.email}`);
        continue;
      }

      // Subtract ordered quantity
      inventoryItem.quantity -= item.quantity;

      // Prevent negative stock
      if (inventoryItem.quantity < 0) {
        inventoryItem.quantity = 0;
      }

      await inventoryItem.save();
      console.log(`✅ Inventory updated: ${item.product} → ${inventoryItem.quantity}`);
    }
  } catch (error) {
    console.error('❌ Inventory update failed:', error.message);
  }
}

module.exports = updateInventory;
