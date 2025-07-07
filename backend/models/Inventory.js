const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
  threshold: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

// 🧠 Dynamic pricing logic before save
inventorySchema.pre('save', function (next) {
  if (this.threshold != null && this.quantity != null) {
    const q = this.quantity;
    const t = this.threshold;

    if (q < t) {
      this.price = Math.round(this.price * 1.1); // +10%
    } else if (q > 3 * t) {
      this.price = Math.round(this.price * 0.95); // -5%
    }
  }
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);
