// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String },
    emailText: { type: String },
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      default: 'neutral',
    },
    items: [
      {
        product: { type: String },
        quantity: { type: Number },
        price: { type: Number, default: 0 },
      },
    ],
    status: { type: String, default: 'pending' },
    userEmail: { type: String, required: true }, // 👈 added for user-level filtering
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
