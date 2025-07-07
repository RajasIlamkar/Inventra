const Inventory = require('../models/Inventory');
const Order = require('../models/Order');

const getStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userEmail = req.user.email;

    // Fetch inventory and orders
    const inventoryItems = await Inventory.find({ user: userId });
    const orders = await Order.find({ userEmail });

    // Create a lookup for inventory prices
    const priceMap = {};
    inventoryItems.forEach(item => {
      priceMap[item.name] = item.price || 0;
    });

    // ✅ Total revenue using inventory prices
    const totalRevenue = orders.reduce((sum, order) => {
      const orderTotal = order.items.reduce((acc, item) => {
        const itemPrice = priceMap[item.product] || 0;
        return acc + item.quantity * itemPrice;
      }, 0);
      return sum + orderTotal;
    }, 0);

    // Total orders
    const totalOrders = orders.length;

    // Low inventory items
    const lowInventory = inventoryItems.filter(item => item.quantity < item.threshold);

    // Top selling products (by quantity), again using inventory prices
    const productSalesMap = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const product = item.product;
        const price = priceMap[product] || 0;

        if (!productSalesMap[product]) {
          productSalesMap[product] = { quantity: 0, revenue: 0 };
        }

        productSalesMap[product].quantity += item.quantity;
        productSalesMap[product].revenue += item.quantity * price;
      });
    });

    const topProducts = Object.entries(productSalesMap)
      .sort((a, b) => b[1].quantity - a[1].quantity)
      .slice(0, 5)
      .map(([product, data]) => ({
        product,
        quantity: data.quantity,
        revenue: data.revenue
      }));

    // Orders per day (sales trend)
    const ordersByDate = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt).toISOString().split('T')[0];
      if (!ordersByDate[date]) ordersByDate[date] = 0;
      ordersByDate[date]++;
    });

    const salesTrend = Object.entries(ordersByDate).map(([date, count]) => ({
      date,
      orders: count
    }));

    // Final response
    res.json({
      totalOrders,
      totalRevenue,
      lowInventory,
      topProducts,
      salesTrend
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

module.exports = {
  getStats
};
