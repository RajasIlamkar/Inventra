const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const gmailRoutes = require('./routes/gmailRoutes');

const app = express();
app.use(cors());
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
  
