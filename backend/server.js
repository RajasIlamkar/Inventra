const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const gmailRoutes = require('./routes/gmailRoutes');

const app = express();
const allowedOrigins = [
  'https://inventra-alpha.vercel.app', // your frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // optional: if you use cookies
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', require('./routes/orders'));
app.use('/api/analysis', analysisRoutes);
app.use('/api/gmail', gmailRoutes);


const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, )
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Mongo Error:', err));
  
