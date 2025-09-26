const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'ZioraAi Backend API' });
});

// User routes
app.use('/api/users', require('./routes/userRoutes'));

// Chat routes
app.use('/api/chat', require('./routes/chatRoutes'));

// Payment routes
app.use('/api/payment', require('./routes/paymentRoutes'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});